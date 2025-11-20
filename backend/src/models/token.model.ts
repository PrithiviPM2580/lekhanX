// ============================================================
// 🧩 TokenModel — Handles token-related data structures and operations
// ============================================================
import mongoose, { type HydratedDocument, type Model, Schema } from "mongoose";

// ------------------------------------------------------
// Define Token Interface
// ------------------------------------------------------
export interface IToken {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	token: string;
	userAgent: string;
	ip: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

//Type for Token
export type TokenDocument = HydratedDocument<IToken>; // Document type
export type TokenModel = Model<IToken>; // Model type
export type TokenObject = IToken; // Plain object type

// ------------------------------------------------------
// Define Token Schema
// ------------------------------------------------------
const tokenSchema = new Schema<IToken>(
	{
		_id: {
			type: Schema.Types.ObjectId,
			auto: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		token: {
			type: String,
			required: true,
		},
		userAgent: {
			type: String,
			required: true,
		},
		ip: {
			type: String,
			required: true,
		},
		expiresAt: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

// ------------------------------------------------------
// Transform output (remove password,__v)
// ------------------------------------------------------
tokenSchema.set("toJSON", {
	transform(_, ret: Partial<IToken> & { __v?: number }) {
		delete ret.__v;
		return ret;
	},
});

// ------------------------------------------------------
// Token Model export
// ------------------------------------------------------
const TokenModel = mongoose.model<IToken>("Token", tokenSchema);

export default TokenModel;
