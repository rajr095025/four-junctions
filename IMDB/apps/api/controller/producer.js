import { Producer } from "../models/producer.js";
import {Movie} from "../models/movie.js";

export const getAllProducers = async (req, res) => {
	try {
		const producers = await Producer.find({}).lean();

		
		const producersWithMovies = await Promise.all(
			producers.map(async (producer) => {
				const movies = await Movie.find({ producer: producer._id })
					.select("_id name") // light weight
					.lean();
				return {
					...producer,
					movies,
				};
			})
		);

		return res.json({
			data: producersWithMovies,
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const addProducer = async (req, res) => {
	try {
		const data = req.body;
		await Producer.create(data);
		return res.json({
			message: "Producer created successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const updateProducer = async (req, res) => {
	try {
		const { id } = req.params;
		const data = req.body;
		await Producer.findByIdAndUpdate(id, data);
		return res.json({
			message: "Producer updated successfully",
		});
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};
