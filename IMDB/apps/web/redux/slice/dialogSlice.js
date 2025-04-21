import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	movies: {
		open: false,
		selectedItem: null,
	},
	selectedMovie: {
		open: false,
		selectedItem: null,
	},
	actors: {
		open: false,
		selectedItem: null,
	},
	selectedActor: {
		open: false,
		selectedItem: null,
	},
	producers: {
		open: false,
		selectedItem: null,
	},
};

const dialogSlice = createSlice({
	name: "dialog",
	initialState,
	reducers: {
		openDialog: (state, action) => {
			const { type, item } = action.payload;
			state[type].open = true;
			state[type].selectedItem = item;
		},
		closeDialog: (state, action) => {
			const { type } = action.payload;
			state[type].open = false;
			state[type].selectedItem = null;
		},
	},
});

export const { openDialog, closeDialog } = dialogSlice.actions;

export default dialogSlice.reducer;
