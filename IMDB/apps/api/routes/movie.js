import Express from "express";
import {
	addMovies,
	getAllMovies,
	getAllWatchListMovies,
	addMovieToWatchList,
	updateMovies,
} from "../controller/movie.js";

const router = Express.Router();

router.get("/", getAllMovies);
router.get("/watch-list", getAllWatchListMovies);
router.post("/watch-list", addMovieToWatchList);
router.post("/", addMovies);
router.route("/:id").put(updateMovies);

export default router;
