import { Movie } from "../models/movie.js";

export const getAllMovies = async (req, res) => {
	try {
		const movies = await Movie.find({})
			.populate("producer", "name")
			.populate("actors", "name")
			.lean();

		return res.json({
			data: movies,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const addMovies = async (req, res) => {
	try {
		const data = req.body;
		await Movie.create(data);
		return res.json({
			message: "Movie created successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const updateMovies = async (req, res) => {
	try {
		const { id } = req.params;
		const data = req.body;
		await Movie.findByIdAndUpdate(id, data);
		return res.json({
			message: "Movie updated successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};
