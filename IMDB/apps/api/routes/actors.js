import Express from "express";
import { addActor, getAllActors, updateActor } from "../controller/actor.js";

const router = Express.Router();

router.get("/", getAllActors);
router.post("/", addActor);
router.route("/:id").put(updateActor);

export default router;
