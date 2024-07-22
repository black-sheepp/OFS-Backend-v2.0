import mongoose from "mongoose";
import { Request, Response } from "express";
import Cart from "../../models/cart/cartSchema";
import Order from "../../models/order/orderSchema";
import User from "../../models/user/userSchema";
import Voucher from "../../models/voucher/voucherSchema";
import Product from "../../models/product/productSchema";
import { sendResponse, handleError } from "../../utils/responseUtil";
import { ProcessOrderRequest, IProduct, IOrderItem } from "../../utils/interface";
import { paymentProcessingMiddleware } from "../../middlewares/paymentMiddleware";
import { spendElitePoints } from "../../utils/services/elitePoints";
import { spendWalletAmount } from "../../utils/services/wallet";

interface AuthRequest extends Request {
    user?: { id: string };
}

// Generate a unique order ID
const generateOrderId = () => {
    const date = new Date();
    const ddmmyy = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear().toString().slice(-2)}`;
    const randomNum = Math.floor(100000 + Math.random() * 900000).toString();
    return `OFS${ddmmyy}${randomNum}`;
};

// Create a new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.userId;
        const voucherCode = req.body.voucherCode;
        const useElitePoints = req.body.elitePoints;
        const useWalletBalance = req.body.walletBalance;

        if (!userId) {
            return handleError(res, new Error("User ID is missing"), 400);
        }

        console.log("req body: ", req.body);
        console.log("Use Elite Points: ", useElitePoints);
        console.log("Use Wallet Balance: ", useWalletBalance);

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

        console.log("User Elite Points: ", user.elitePoints);
        console.log("User Wallet: ", user.wallet);

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
                voucherDiscount = Math.min(
                    (totalSellingPrice * voucher.discountValue) / 100,
                    voucher.maxDiscountValue || Infinity
                );
            } else {
                voucherDiscount = voucher.discountValue;
            }

            // Deduct used voucher
            voucher.remainingVouchers -= 1;
            await voucher.save();
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

        console.log("Voucher Discount: ", voucherDiscount);
        console.log("Elite Points Discount: ", elitePointsDiscount);
        console.log("Wallet Balance Discount: ", walletBalanceDiscount);

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

            // Deduct elite points and wallet balance using the respective service functions
            if (elitePointsDiscount > 0) {
                await spendElitePoints(userId, elitePointsDiscount, `Order ID: ${orderId}`);
            }
            if (walletBalanceDiscount > 0) {
                await spendWalletAmount(userId, walletBalanceDiscount, `Order ID: ${orderId}`);
            }

            for (const item of cart.items) {
                const product = (await Product.findById((item.product as IProduct)._id)) as IProduct;
                const inventoryItem = product.inventory.find((i) => i.size === item.size);
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

        sendResponse(
            res,
            201,
            { order, elitePointsUsed: elitePointsDiscount, walletBalanceUsed: walletBalanceDiscount },
            "Order created successfully"
        );
    } catch (error) {
        handleError(res, error);
    }
};

// Get user orders history
export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return handleError(res, new Error("User ID is missing"), 400);
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return handleError(res, new Error("User not found"), 404);
        }

        // Get user's orders
        const orders = await Order.find({ user: userId }).populate("items.product");

        // Return orders
        sendResponse(res, 200, orders, "Order history fetched successfully");
    } catch (error) {
        console.error("Error fetching order history:", error);
        handleError(res, error);
    }
};
