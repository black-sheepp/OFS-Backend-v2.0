// src/utils/jwtUtils.ts

import jwt, { JwtPayload } from "jsonwebtoken";
import { IJWTPayload, IUser } from "../utils/interface";
import { Request, Response, NextFunction } from "express";
import mongoose from 'mongoose';
import RefreshToken from "../models/refreshTokens/refreshTokenSchema";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1d";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret_key";
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || "7d";

export const generateToken = (user: IJWTPayload): string => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const generateRefreshToken = async (user: IJWTPayload): Promise<string> => {
    const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(REFRESH_TOKEN_EXPIRATION));

    const newRefreshToken = new RefreshToken({
        token: refreshToken,
        userId: user.id,
        expiryDate,
    });

    await newRefreshToken.save();
    return refreshToken;
};

export const verifyToken = (token: string, secret: string): JwtPayload | string => {
    try {
        return jwt.verify(token, secret);
    } catch (ex) {
        throw new Error("Invalid token or token expired");
    }
};

export const verifyTokenMiddleware = (req: Request & { user?: any }, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        res.status(401).send({ message: "Access denied. No token provided." });
        return;
    }
    try {
        const decoded = verifyToken(token, JWT_SECRET) as IJWTPayload;
        req.user = decoded;
        if (req.user.status !== 'active') {
            res.status(403).send({ message: "User is inactive." });
            return;
        }
        next();
    } catch (ex) {
        res.status(400).send({ message: "Invalid token." });
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request & { user?: any }, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).send({ message: "Access denied." });
            return;
        }
        next();
    };
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.body.refreshToken;
    if (!token) {
        res.status(401).send({ message: "No refresh token provided." });
        return;
    }
    try {
        const decoded = verifyToken(token, REFRESH_TOKEN_SECRET) as IJWTPayload;

        const existingToken = await RefreshToken.findOne({ token });
        if (!existingToken) {
            res.status(401).send({ message: "Invalid refresh token." });
            return;
        }

        const user = { id: decoded.id, email: decoded.email, role: decoded.role, status: decoded.status };
        if (user.status !== 'active') {
            res.status(403).send({ message: "User is inactive." });
            return;
        }

        const newAccessToken = generateToken(user);
        const newRefreshToken = await generateRefreshToken(user);

        await RefreshToken.deleteOne({ _id: existingToken._id });

        res.status(200).send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (ex) {
        res.status(400).send({ message: "Invalid refresh token." });
    }
};

export const deleteRefreshToken = async (userId: string): Promise<void> => {
    await RefreshToken.deleteMany({ userId });
};