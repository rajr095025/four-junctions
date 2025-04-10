import Express from "express";
import { addMovies, getAllMovies, updateMovies } from "../controller/movie.js";

const router = Express.Router();

router.get("/", getAllMovies);
router.post("/", addMovies);
router.route("/:id").put(updateMovies);

export default router;
