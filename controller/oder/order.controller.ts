import { Request, Response } from "express";
import Order from "../../models/order/orderSchema";
import Cart from "../../models/cart/cartSchema";
import Product from "../../models/product/productSchema";
import User from "../../models/user/userSchema";
import { applyVoucher } from "../../utils/services/voucherService";
import { sendResponse, handleError } from "../../utils/responseUtil";
import { IProduct } from "../../utils/interface";

interface AuthRequest extends Request {
    user?: { id: string };
}

const generateOrderId = (): string => {
    const datePart = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomPart = Math.floor(100000 + Math.random() * 900000).toString();
    return `${datePart}${randomPart}`;
};

export const placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { elitePointsUsed, walletBalanceUsed, voucherCode } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 401, null, "User not authenticated");
        }

        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return sendResponse(res, 404, null, "Cart not found");
        }

        const user = await User.findById(userId);
        if (!user) {
            return sendResponse(res, 404, null, "User not found");
        }

        let totalAmount = cart.items.reduce((total, item) => {
            const product = item.product as IProduct;
            return total + product.sellingPrice * item.quantity;
        }, 0);

        let discountApplied = 0;

        // Apply voucher discount first
        if (voucherCode) {
            discountApplied = await applyVoucher(voucherCode, totalAmount);
            totalAmount -= discountApplied;
        }

        // Apply elite points
        if (elitePointsUsed) {
            if (user.elitePoints < elitePointsUsed) {
                return sendResponse(res, 400, null, "Insufficient elite points");
            }
            user.elitePoints -= elitePointsUsed;
            totalAmount -= elitePointsUsed;
            user.elitePointsHistory.push({
                points: elitePointsUsed,
                type: "spend",
                description: "Used for order",
                date: new Date()
            });
        }

        // Apply wallet balance
        if (walletBalanceUsed) {
            if (user.wallet < walletBalanceUsed) {
                return sendResponse(res, 400, null, "Insufficient wallet balance");
            }
            user.wallet -= walletBalanceUsed;
            totalAmount -= walletBalanceUsed;
            user.walletTransactions.push({
                amount: walletBalanceUsed,
                type: "debit",
                description: "Used for order",
                date: new Date()
            });
        }

        if (totalAmount < 0) {
            totalAmount = 0;
        }

        const orderId = generateOrderId();

        const order = new Order({
            user: userId,
            products: cart.items.map(item => {
                const product = item.product as IProduct;
                return {
                    name: product.name,
                    SKU: product.SKU,
                    MRP: product.MRP,
                    discount: product.discount,
                    sellingPrice: product.sellingPrice,
                    size: item.size,
                    quantity: item.quantity,
                    images: product.images,
                };
            }),
            totalAmount,
            elitePointsUsed,
            walletBalanceUsed,
            voucherCode,
            discountApplied,
            orderId
        });

        await order.save();
        await user.save();
        await Cart.deleteOne({ user: userId });

        sendResponse(res, 200, order, "Order placed successfully");
    } catch (error) {
        handleError(res, error);
    }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { orderId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 401, null, "User not authenticated");
        }

        const order = await Order.findOne({ orderId, user: userId });

        if (!order) {
            return sendResponse(res, 404, null, "Order not found");
        }

        if (order.status !== "pending" && order.status !== "confirmed") {
            return sendResponse(res, 400, null, "Order cannot be cancelled");
        }

        order.status = "cancelled";
        await order.save();

        const user = await User.findById(userId);

        if (user) {
            user.wallet += order.walletBalanceUsed;
            user.walletTransactions.push({
                amount: order.walletBalanceUsed,
                type: "credit",
                description: "Refund for cancelled order",
                date: new Date()
            });
            await user.save();
        }

        sendResponse(res, 200, order, "Order cancelled successfully and wallet refunded");
    } catch (error) {
        handleError(res, error);
    }
};

export const exchangeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { orderId, newProductId, newSize, newQuantity } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 401, null, "User not authenticated");
        }

        const order = await Order.findOne({ orderId, user: userId });

        if (!order) {
            return sendResponse(res, 404, null, "Order not found");
        }

        if (order.status !== "pending" && order.status !== "confirmed") {
            return sendResponse(res, 400, null, "Order cannot be exchanged");
        }

        // Fetch the new product details
        const newProduct = await Product.findById(newProductId);

        if (!newProduct) {
            return sendResponse(res, 404, null, "New product not found");
        }

        // Update the order with new product details
        order.products = [{
            name: newProduct.name,
            SKU: newProduct.SKU,
            MRP: newProduct.MRP,
            discount: newProduct.discount,
            sellingPrice: newProduct.sellingPrice,
            size: newSize,
            quantity: newQuantity,
            images: newProduct.images,
        }];
        order.status = "exchanged";
        await order.save();

        sendResponse(res, 200, order, "Order exchanged successfully");
    } catch (error) {
        handleError(res, error);
    }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return sendResponse(res, 401, null, "User not authenticated");
        }

        const orders = await Order.find({ user: userId });

        if (!orders || orders.length === 0) {
            return sendResponse(res, 404, null, "No orders found");
        }

        sendResponse(res, 200, orders, "Orders retrieved successfully");
    } catch (error) {
        handleError(res, error);
    }
};
