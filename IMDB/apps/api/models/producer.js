import { model, Schema } from "mongoose";

const producerSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		dob: {
			type: Date,
			required: true,
		},
		gender: {
			type: String,
			enum: ["male", "female"],
			required: true,
		},
		bio: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

export const Producer = model("Producer", producerSchema);
