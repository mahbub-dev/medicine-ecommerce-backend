import mongoose, { Document, Schema } from "mongoose";

export interface IOtp extends Document {
	email: string;
	token: string;
	expiresAt: Date;
}

const otpSchema: Schema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		otp: {
			type: String,
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

const Otp = mongoose.model<IOtp>("Otp", otpSchema);

export default Otp;
