import Express from "express";
import {
	addProducer,
	getAllProducers,
	updateProducer,
} from "../controller/producer.js";

const router = Express.Router();

router.get("/", getAllProducers);
router.post("/", addProducer);
router.route("/:id").put(updateProducer);

export default router;
