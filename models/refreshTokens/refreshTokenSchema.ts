// src/models/refreshTokenSchema.ts

import mongoose, { Schema, Document } from 'mongoose';

interface IRefreshToken extends Document {
    token: string;
    userId: string;
    expiryDate: Date;
}

const refreshTokenSchema: Schema = new Schema({
    token: { type: String, required: true },
    userId: { type: String, required: true },
    expiryDate: { type: Date, required: true },
});

const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);
export default RefreshToken;
export { IRefreshToken };
