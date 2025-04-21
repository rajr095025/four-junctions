import { model, Schema } from "mongoose";

const movieWatchListSchema = new Schema(
	{
		id: {
			type: Number,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

export const MovieWatchList = model("MovieWatchList", movieWatchListSchema);
