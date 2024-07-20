// src/controllers/elitePointsController.ts
import userSchema, { UserModel } from "../../models/user/userSchema";
import { Request, Response } from "express";
import { sendResponse, handleError } from "../../utils/responseUtil";

// Add elite points to a user
export const addElitePoints = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, points, description } = req.body;
        const user = await (userSchema as UserModel).findById(userId);
        if (!user) {
            return handleError(res, new Error("User not found"), 404);
        }

        await user.addElitePointsTransaction({
            points,
            type: "earn",
            description,
            date: new Date(),
        });

        sendResponse(res, 200, null, "Elite points added successfully");
    } catch (error) {
        handleError(res, error);
    }
};

// Spend elite points of a user
export const spendElitePoints = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, points, description } = req.body;
        const user = await (userSchema as UserModel).findById(userId);
        if (!user) {
            return handleError(res, new Error("User not found"), 404);
        }

        await user.addElitePointsTransaction({
            points,
            type: "spend",
            description,
            date: new Date(),
        });

        sendResponse(res, 200, null, "Elite points spent successfully");
    } catch (error) {
        handleError(res, error);
    }
};

// Get elite points history of a user
export const getElitePointsHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const user = await (userSchema as UserModel).findById(userId);
        if (!user) {
            return handleError(res, new Error("User not found"), 404);
        }

        sendResponse(res, 200, user.elitePointsHistory);
    } catch (error) {
        handleError(res, error);
    }
};

// Get elite points of a user
export const getElitePoints = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const user = await (userSchema as UserModel).findById(userId);
        if (!user) {
            return handleError(res, new Error("User not found"), 404);
        }

        sendResponse(res, 200, { elitePoints: user.elitePoints });
    } catch (error) {
        handleError(res, error);
    }
};
