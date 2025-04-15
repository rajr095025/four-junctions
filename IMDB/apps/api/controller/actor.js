import { Actor } from "../models/actor.js";
import { Movie } from "../models/movie.js";

export const getAllActors = async (req, res) => {
	try {
		const actors = await Actor.find({}).lean();

		// Fetch movies for each actor
		const actorsWithMovies = await Promise.all(
			actors.map(async (actor) => {
				const movies = await Movie.find({ actors: actor._id })
					.select("_id name") // return only basic fields to keep it light
					.lean();
				return {
					...actor,
					movies,
				};
			})
		);

		return res.json({
			data: actorsWithMovies,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const addActor = async (req, res) => {
	try {
		const data = req.body;
		await Actor.create(data);
		return res.json({
			message: "Actor created successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const updateActor = async (req, res) => {
	try {
		const { id } = req.params;
		const data = req.body;
		await Actor.findByIdAndUpdate(id, data);
		return res.json({
			message: "Actor updated successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};
