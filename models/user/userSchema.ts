import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import AddressSchema from "./addressSchema";

export interface IUser extends Document {
    name: string;
    phone: string;
    email: string;
    password: string;
    profilePicture?: string;
    shippingAddresses?: Array<any>;
    roles: Array<string>;
    wishlist?: Array<mongoose.Schema.Types.ObjectId>;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
}

// Define the schema for the User
const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profilePicture: { type: String },
        shippingAddresses: { type: [AddressSchema], default: [] },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        roles: { type: [String], enum: ["customer", "admin", "seller"], default: ["customer"] },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        wallet: { type: Number, default: 0 },
        elitePoints: { type: Number, default: 0 },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
    },
    { timestamps: true }
);

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
    const user = this as unknown as IUser;
    if (!user.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
});

UserSchema.index({ email: 1 });

export default mongoose.model<IUser>("User", UserSchema);
