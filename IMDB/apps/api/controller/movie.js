import { existsSync, mkdirSync } from "node:fs";
import { Movie } from "../models/movie.js";
import { join } from "node:path";

const uploadsDir = "./posters";

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
		let data = req.body;
		const poster = req.files.poster;

		data = { ...data,actors: JSON.parse(data.actors),}

		const movie = await Movie.create(data);

		const movieDir = `${uploadsDir}/${movie.id}`;
		if (existsSync(movieDir) === false) {
			mkdirSync(movieDir, { recursive: true });
		}

		const filePath = join(movieDir, poster.name);
		await req.files.poster.mv(filePath);
		await Movie.findByIdAndUpdate(movie.id, {
			poster: filePath,
		});
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

		
		const poster = req?.files?.poster;

		if(poster) {
			const filePath = `/${id}/${poster.name}`;

			await req.files.poster.mv(filePath);
			await Movie.findByIdAndUpdate(id, { ...data, actors: JSON.parse(data.actors),  poster: filePath });
		} else {
			const { poster, ...rest } = data;
			await Movie.findByIdAndUpdate(id, { ...rest, actors: JSON.parse(data.actors) });
		}
	
		return res.json({
			message: "Movie updated successfully",
		});
	} catch (error) {
		
		res.status(500).json({
			message: error.message,
		});
	}
};
