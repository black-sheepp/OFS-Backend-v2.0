import { Request, Response } from "express";
import mongoose from "mongoose";
import Cart from "../../models/cart/cartSchema";
import Order from "../../models/order/orderSchema";
import User from "../../models/user/userSchema";
import Voucher from "../../models/voucher/voucherSchema";
import Product from "../../models/product/productSchema";
import { sendResponse, handleError } from "../../utils/responseUtil";
import { ProcessOrderRequest, IProduct, IOrderItem } from "../../utils/interface";
import { paymentProcessingMiddleware } from "../../middlewares/paymentMiddleware";

const generateOrderId = () => {
    const date = new Date();
    const ddmmyy = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear().toString().slice(-2)}`;
    const randomNum = Math.floor(100000 + Math.random() * 900000).toString();
    return `OFS${ddmmyy}${randomNum}`;
};

export const createOrder = async (req: ProcessOrderRequest, res: Response): Promise<void> => {
    try {
        const { voucherCode, useElitePoints, useWalletBalance } = req.body;
        const userId = req.user?.id;

        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return handleError(res, new Error("Cart is empty"), 400);
        }

        const user = await User.findById(userId);
        if (!user) {
            return handleError(res, new Error("User not found"), 404);
        }

        // Ensure elitePoints and wallet are initialized
        user.elitePoints = user.elitePoints || 0;
        user.wallet = user.wallet || 0;

        const totalSellingPrice = cart.items.reduce((total, item) => {
            const product = item.product as IProduct;
            return total + product.sellingPrice * item.quantity;
        }, 0);

        let voucherDiscount = 0;
        if (voucherCode) {
            const voucher = await Voucher.findOne({ code: voucherCode });
            if (!voucher || voucher.expiryDate < new Date()) {
                return handleError(res, new Error("Invalid or expired voucher code"), 400);
            }
            if (voucher.discountType === "percentage") {
                voucherDiscount = Math.min((totalSellingPrice * voucher.discountValue) / 100, voucher.maxDiscountValue || Infinity);
            } else {
                voucherDiscount = voucher.discountValue;
            }
        }

        let elitePointsDiscount = 0;
        if (useElitePoints > 0) {
            if (useElitePoints > user.elitePoints) {
                return handleError(res, new Error("Insufficient elite points"), 400);
            }
            elitePointsDiscount = useElitePoints;
        }

        let walletBalanceDiscount = 0;
        if (useWalletBalance > 0) {
            if (useWalletBalance > user.wallet) {
                return handleError(res, new Error("Insufficient wallet balance"), 400);
            }
            walletBalanceDiscount = useWalletBalance;
        }

        const totalDiscount = voucherDiscount + elitePointsDiscount + walletBalanceDiscount;
        const finalAmount = totalSellingPrice - totalDiscount;

        if (isNaN(totalDiscount) || isNaN(finalAmount)) {
            return handleError(res, new Error("Invalid discount or final amount calculations"), 400);
        }

        const orderId = generateOrderId();
        const order = await Order.create({
            orderId,
            user: userId,
            items: cart.items as IOrderItem[],
            totalAmount: totalSellingPrice,
            discount: totalDiscount,
            finalAmount,
            elitePointsUsed: elitePointsDiscount,
            walletBalanceUsed: walletBalanceDiscount,
            voucherCodeUsed: voucherCode,
            status: "pending",
        });

        const paymentResult = await paymentProcessingMiddleware(order.finalAmount);

        if (paymentResult.success) {
            order.status = "confirmed";
            order.paymentDetails = paymentResult.paymentDetails;

            user.elitePoints -= elitePointsDiscount;
            user.wallet -= walletBalanceDiscount;
            await user.save();

            for (const item of cart.items) {
                const product = await Product.findById((item.product as IProduct)._id) as IProduct;
                const inventoryItem = product.inventory.find(i => i.size === item.size);
                if (inventoryItem) {
                    inventoryItem.quantity -= item.quantity;
                    if (inventoryItem.quantity < 0) {
                        return handleError(res, new Error("Insufficient inventory"), 400);
                    }
                }
                await product.save();
            }

            cart.items = [];
            await cart.save();
        } else {
            order.status = "failed";
        }

        await order.save();

        sendResponse(res, 201, order, "Order created successfully");
    } catch (error) {
        handleError(res, error);
    }
};