import Express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

import actorRouter from "./routes/actors.js";
import producerRouter from "./routes/producer.js";
import movieRouter from "./routes/movie.js";

const app = Express();

app.use(
	cors({
		origin: "http://localhost:5173",
	})
);
app.use(bodyParser.json());

app.use("/actors", actorRouter);
app.use("/producers", producerRouter);
app.use("/movies", movieRouter);

try {
	await mongoose.connect(process.env.DB_URL);
	app.listen(process.env.PORT);
	console.log("App started on Port: ", process.env.PORT);
} catch (error) {
	console.log("Error when connecting to DB: ", error.message);
}
