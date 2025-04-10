import { configureStore } from "@reduxjs/toolkit";
import dialogSlice from "./slice/dialogSlice";

export const store = configureStore({
	reducer: {
		dialog: dialogSlice,
	},
});
