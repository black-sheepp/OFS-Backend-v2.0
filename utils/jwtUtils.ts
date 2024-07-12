import jwt from "jsonwebtoken";
import { IUser } from "../utils/interface";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

export const generateToken = (user: IUser): string => {
    const payload = {
        id: user._id,
        email: user.email,
        roles: user.roles
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

export const verifyToken = (req: Request & { user?: any }, res: Response, next: NextFunction): void => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        res.status(401).send({ message: "Access denied. No token provided." });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send({ message: "Invalid token." });
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request & { user?: any }, res: Response, next: NextFunction): void => {
        if (!roles.includes(req.user?.roles)) {
            res.status(403).send({ message: "Access denied." });
            return;
        }
        next();
    };
};
