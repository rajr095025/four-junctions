import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Chip,
	OutlinedInput,
	IconButton,
	Typography,
	CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
	useAddMovie,
	useGetMovieSuggestions,
	useUpdateMovie,
} from "../../hooks/movies";
import { useGetAllActors } from "../../hooks/actors";
import { useGetAllProducers } from "../../hooks/producers";
import { closeDialog } from "../../store/slices/dialogSlice";
import { Add as AddIcon } from "@mui/icons-material";
import { openDialog } from "../../../redux/slice/dialogSlice";

const schema = yup.object().shape({
	name: yup.string().required("Name is required"),
	releasedAt: yup.date().required("Release date is required"),
	plot: yup.string().required("Plot is required"),
	poster: yup.mixed().required("Poster is required"),
	producer: yup.string().required("Producer is required"),
	actors: yup.array().min(1, "At least one actor is required"),
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const formatLocalDate = (isoDate) => {
	const date = new Date(isoDate);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export default function MovieDialog() {
	const dispatch = useDispatch();
	const { open, selectedItem } = useSelector((state) => state.dialog.movies);
	const { mutateAsync: addMovie, isPending: addMoviePending } = useAddMovie();
	const { mutateAsync: updateMovie, isPending: updateMoviePending } =
		useUpdateMovie(selectedItem?._id);
	const { data: actorsData } = useGetAllActors();
	const { data: producersData } = useGetAllProducers();
	const [suggestionsSearch, setSuggestionsSearch] = useState("");
	const { data: suggestions } = useGetMovieSuggestions(suggestionsSearch);

	const {
		register,
		handleSubmit,
		reset,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			name: "",
			releasedAt: "",
			plot: "",
			poster: "",
			producer: "",
			actors: [],
		},
	});
	const isPending = addMoviePending || updateMoviePending;
	const currentPosterPath = watch("poster");

	useEffect(() => {
		if (selectedItem) {
			const producer = selectedItem.producer._id;
			const actors = selectedItem.actors.map(({ _id }) => _id);
			reset({
				...selectedItem,
				producer,
				actors,
				releasedAt: selectedItem.releasedAt
					? selectedItem.releasedAt
						? formatLocalDate(selectedItem.releasedAt)
						: ""
					: "",
			});
		} else {
			reset({
				name: "",
				releasedAt: "",
				plot: "",
				poster: null,
				producer: "",
				actors: [],
			});
			dispatch(closeDialog({ type: "movies" }));
		}
	}, [selectedItem, reset, setValue, dispatch]);

	const handleClose = () => {
		if (isPending === false) {
			reset();
			dispatch(closeDialog({ type: "movies" }));
			setSuggestionsSearch("");
		}
	};

	const onMovieSelect = (movie) => () => {
		setValue("name", movie.title);
		setValue("releasedAt", movie.release_date);
		setValue("plot", movie.overview);
		if (movie?.poster_path != null) {
			setValue("poster", movie.poster_path);
		}
		setSuggestionsSearch("");
	};

	const onSubmit = async (data) => {
		if (selectedItem) {
			await updateMovie(data);
		} else {
			await addMovie(data);
		}
		reset();
		dispatch(closeDialog({ type: "movies" }));
		setSuggestionsSearch("");
	};

	const handleOpenActorDialog = () => {
		dispatch(openDialog({ type: "actors", item: null }));
	};

	const handleOpenProducerDialog = () => {
		dispatch(openDialog({ type: "producers", item: null }));
	};

	return (
		<>
			<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
				<DialogTitle>
					{selectedItem ? "Edit Movie" : "Add New Movie"}
				</DialogTitle>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogContent>
						<Box className="space-y-4">
							<TextField
								fullWidth
								label="Name"
								{...register("name", {
									onChange: (e) =>
										setSuggestionsSearch(e.target.value),
								})}
								autoComplete="off"
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
							{(suggestions ?? []).length > 0 && (
								<ul className="absolute z-10 border rounded bg-white mt-1 shadow-lg max-h-60 overflow-auto">
									{suggestions.map((movie) => (
										<li
											key={movie.id}
											className="p-2 hover:bg-gray-100 cursor-pointer"
											onClick={onMovieSelect(movie)}>
											{movie.title}
										</li>
									))}
								</ul>
							)}
							<TextField
								fullWidth
								label="Release Date"
								type="date"
								slotProps={{
									inputLabel: {
										shrink: true,
									},
								}}
								{...register("releasedAt")}
								error={!!errors.releasedAt}
								helperText={errors.releasedAt?.message}
							/>
							<TextField
								fullWidth
								label="Plot"
								multiline
								rows={4}
								{...register("plot")}
								error={!!errors.plot}
								helperText={errors.plot?.message}
							/>
							<Box className="flex gap-2 flex-col">
								<Typography variant="subtitle1" gutterBottom>
									Poster
								</Typography>
								<img
									className="h-40 w-40 self-center object-contain"
									src={`https://image.tmdb.org/t/p/w500${currentPosterPath}`}
								/>
								{errors.poster && (
									<Typography color="error" variant="caption">
										{errors.poster.message}
									</Typography>
								)}
							</Box>
							<Box className="flex items-center gap-2">
								<FormControl
									fullWidth
									error={!!errors.producer}>
									<InputLabel id="producer-label">
										Producer
									</InputLabel>
									<Controller
										name="producer"
										control={control}
										defaultValue=""
										render={({ field }) => (
											<Select
												{...field}
												labelId="producer-label"
												label="Producer">
												{producersData?.map(
													(producer) => (
														<MenuItem
															key={producer._id}
															value={
																producer._id
															}>
															{producer.name}
														</MenuItem>
													)
												)}
											</Select>
										)}
									/>
									{errors.producer && (
										<Box className="text-red-500 text-sm mt-1">
											{errors.producer.message}
										</Box>
									)}
								</FormControl>
								<IconButton
									color="primary"
									onClick={handleOpenProducerDialog}
									title="Add new producer">
									<AddIcon />
								</IconButton>
							</Box>
							<Box className="flex items-center gap-2">
								<FormControl fullWidth error={!!errors.actors}>
									<InputLabel id="actors-label">
										Actors
									</InputLabel>
									<Controller
										name="actors"
										control={control}
										defaultValue={[]}
										render={({ field }) => (
											<Select
												{...field}
												labelId="actors-label"
												multiple
												value={field.value}
												onChange={(e) =>
													field.onChange(
														e.target.value
													)
												}
												input={
													<OutlinedInput label="Actors" />
												}
												renderValue={(selected) => (
													<Box className="flex flex-wrap gap-2">
														{selected.map(
															(value) => {
																const actor =
																	actorsData?.find(
																		(a) =>
																			a._id ===
																			value
																	);
																return (
																	<Chip
																		key={
																			value?._id
																		}
																		label={
																			actor?.name ||
																			value
																		}
																	/>
																);
															}
														)}
													</Box>
												)}
												MenuProps={MenuProps}>
												{actorsData?.map((actor) => (
													<MenuItem
														key={actor._id}
														value={actor._id}>
														{actor.name}
													</MenuItem>
												))}
											</Select>
										)}
									/>
									{errors.actors && (
										<Box className="text-red-500 text-sm mt-1">
											{errors.actors.message}
										</Box>
									)}
								</FormControl>
								<IconButton
									color="primary"
									onClick={handleOpenActorDialog}
									title="Add new actor">
									<AddIcon />
								</IconButton>
							</Box>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button disabled={isPending} onClick={handleClose}>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="contained"
							startIcon={
								isPending ? (
									<CircularProgress size={15} />
								) : null
							}
							disabled={isPending}>
							{selectedItem ? "Update" : "Add"}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
