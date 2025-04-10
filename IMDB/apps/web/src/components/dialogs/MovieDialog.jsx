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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddMovie, useUpdateMovie } from "../../hooks/movies";
import { useGetAllActors } from "../../hooks/actors";
import { useGetAllProducers } from "../../hooks/producers";
import { closeDialog } from "../../store/slices/dialogSlice";
import {
	Add as AddIcon,
	Close as CloseIcon,
	CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
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
	const addMovie = useAddMovie();
	const updateMovie = useUpdateMovie(selectedItem?._id);
	const { data: actorsData } = useGetAllActors();
	const { data: producersData } = useGetAllProducers();
	const [posterPreview, setPosterPreview] = useState(null);

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
			poster: null,
			producer: "",
			actors: [],
		},
	});

	const posterFile = watch("poster");

	useEffect(() => {
		if (selectedItem) {
			const producer = selectedItem.producer._id;
			const actors = selectedItem.actors.map(({ _id }) => _id);
			reset({ ...selectedItem, producer, actors ,releasedAt: selectedItem.releasedAt
				? selectedItem.releasedAt ? formatLocalDate(selectedItem.releasedAt) : ""
				: "",});

			if (selectedItem.poster) {
				// setPosterPreview(selectedItem.poster);
				setPosterPreview(`${import.meta.env.VITE_API_URL}${selectedItem.poster}`)
			}
		} else {
			reset({
				name: "",
				releasedAt: "",
				plot: "",
				poster: null,
				producer: "",
				actors: [],
			});
			setValue("poster", null);
			setPosterPreview(null);
			dispatch(closeDialog({ type: "movies" }));
		}
	}, [selectedItem, reset]);

	useEffect(() => {
		if (posterFile instanceof FileList && posterFile.length > 0) {
			const file = posterFile[0];
			const reader = new FileReader();

			reader.onloadend = () => {
				setPosterPreview(reader.result);
			};

			reader.readAsDataURL(file);
		}
	}, [posterFile]);

	const handleClose = () => {
		reset();
		setPosterPreview(null);
		dispatch(closeDialog({ type: "movies" }));
	};

	const onSubmit = async (data) => {
		// Create FormData to handle file upload
		const formData = new FormData();

		// Append all form fields to FormData
		Object.keys(data).forEach((key) => {
			if (key === "poster" && data[key] instanceof FileList) {
				formData.append(key, data[key][0]);
			} else if (key === "actors") {
				// Handle array of actor IDs
				// data[key].forEach((actorId) => {
				// 	formData.append("actors[]", actorId);
				// });
				formData.append(key, JSON.stringify(data[key]));
				
			} else {
				formData.append(key, data[key]);
			}
		});

		if (selectedItem) {
			await updateMovie.mutateAsync(formData);
		} else {
			await addMovie.mutateAsync(formData);
		}
		handleClose();
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
								{...register("name")}
								error={!!errors.name}
								helperText={errors.name?.message}
							/>
							<TextField
								fullWidth
								label="Release Date"
								type="date"
								InputLabelProps={{ shrink: true }}
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
							<Box>
								<Typography variant="subtitle1" gutterBottom>
									Poster
								</Typography>
								<Box
									className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center"
									sx={{ minHeight: "150px" }}>
									{posterPreview ? (
										<Box className="relative w-full h-40">
											<img
												src={posterPreview}
												alt="Poster preview"
												className="w-full h-full object-contain"
											/>
											<IconButton
												className="absolute top-0 right-0 bg-white"
												onClick={() => {
													setValue("poster", null);
													setPosterPreview(null);
												}}>
												<CloseIcon />
											</IconButton>
										</Box>
									) : (
										<Box className="text-center">
											<CloudUploadIcon
												sx={{
													fontSize: 40,
													color: "text.secondary",
													mb: 1,
												}}
											/>
											<Typography
												variant="body2"
												color="text.secondary"
												gutterBottom>
												Click to upload or drag and drop
											</Typography>
											<Button
												variant="outlined"
												component="label">
												Upload Poster
												<input
													type="file"
													hidden
													accept="image/*"
													{...register("poster")}
												/>
											</Button>
										</Box>
									)}
								</Box>
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
													<Box
														sx={{
															display: "flex",
															flexWrap: "wrap",
															gap: 0.5,
														}}>
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
						<Button onClick={handleClose}>Cancel</Button>
						<Button
							type="submit"
							variant="contained"
							disabled={
								addMovie.isPending || updateMovie.isPending
							}>
							{selectedItem ? "Update" : "Add"}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
