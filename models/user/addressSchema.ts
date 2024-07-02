import mongoose, { Schema } from "mongoose";

// Define the address sub-schema
const AddressSchema: Schema = new Schema({
	label: { type: String, required: true },
	street: { type: String, required: true },
	city: { type: String, required: true },
	district: { type: String, required: true },
	province: { type: String, required: true },
	postalCode: { type: Number, required: true },
	country: { type: String, required: true },
});

export default AddressSchema;
