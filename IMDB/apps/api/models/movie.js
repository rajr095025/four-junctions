import { model, Schema } from "mongoose";

const movieSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		releasedAt: {
			type: Date,
			required: true,
		},
		plot: {
			type: String,
			required: true,
			trim: true,
		},
		poster: {
			type: String,
		},
		producer: {
			type: Schema.Types.ObjectId,
			ref: "Producer",
			required: true,
		},
		actors: {
			type: [Schema.Types.ObjectId],
			ref: "Actor",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const Movie = model("Movie", movieSchema);
