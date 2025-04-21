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
	Avatar,
} from "@mui/material";

import Divider from "@mui/material/Divider";
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
import MovieDetails from "../../pages/movies/MovieDetails";
import {
	useGetFullMovieDetails,
	useGetMovieVideoLinks,
	useGetMovieCredits,
} from "../../hooks/movies";
import Stack from "@mui/material/Stack";
import FaceIcon from "@mui/icons-material/Face";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CloseIcon from "@mui/icons-material/Close";

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

let videoTypeSortOrder = { Trailer: 0, Teaser: 1, Featurette: 2, Clip: 3 };

let crewTypeSortOrder = { Directing: 0, Production: 1, undefined: 2 };

export default function SelectedMovieDialog() {
	const dispatch = useDispatch();
	const { open, selectedItem } = useSelector(
		(state) => state.dialog.selectedMovie
	);
	const { mutateAsync: addMovie, isPending: addMoviePending } = useAddMovie();
	const { mutateAsync: updateMovie, isPending: updateMoviePending } =
		useUpdateMovie(selectedItem?._id);
	const { data: actorsData } = useGetAllActors();
	const { data: producersData } = useGetAllProducers();
	const [suggestionsSearch, setSuggestionsSearch] = useState("");
	const { data: suggestions } = useGetMovieSuggestions(suggestionsSearch);

	const handleClose = () => {
		dispatch(closeDialog({ type: "selectedMovie" }));
	};

	const { data: movie, isLoading: movieLoading } =
		useGetFullMovieDetails(selectedItem);
	const { data: videos, isLoading: videoLoading } =
		useGetMovieVideoLinks(selectedItem);
	const { data: credits, isLoading: creditLoading } =
		useGetMovieCredits(selectedItem);

	const director = credits?.crew?.find((person) => person.job === "Director");

	let uniqueCrew = credits?.crew?.sort(
		(a, b) =>
			crewTypeSortOrder[a.department] - crewTypeSortOrder[b.department]
	);

	uniqueCrew = uniqueCrew
		? Object.values(
				uniqueCrew?.reduce((acc, person) => {
					acc[person.id] = person;
					return acc;
				}, {})
		  )
		: [];

	const isLoading = movieLoading || videoLoading || creditLoading;

	if (!selectedItem)
		return null;

	if (isLoading) {
		return (
			<div className="h-full w-2/3 flex items-center justify-center">
				<CircularProgress size={20} />
			</div>
		);
	}

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth>
			<div className="p-4 flex flex-col items-center">
				<header className="relative m-1 w-full">
					<h2 className="text-center text-2xl font-bold mb-2">
						{movie.title}
					</h2>
					<div
						className="absolute top-1 right-2 hover:cursor-pointer"
						onClick={handleClose}>
						<CloseIcon></CloseIcon>
					</div>
				</header>
				<div
					className={`grid [grid-template-columns:2fr_2fr_3fr_3fr] gap-2 text-center`}>
					<div>
						{movie.poster_path && (
							<img
								src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
								alt={movie.title}
								className="rounded-2xl shadow-lg mb-4 w-50 h-60"
							/>
						)}
						<Divider orientation="vertical" flexItem />
					</div>
					<section>
						<header className="text-left font-bold text-md">
							Details
						</header>
						<div>
							{director && (
								<p className="text-left font-bold text-sm">
									<span className="text-left font-bold text-sm text-gray-500">
										Director : &nbsp;
									</span>
									{director?.original_name}
								</p>
							)}
							{movie.spoken_languages && (
								<p className="text-left font-bold text-sm">
									<span className="text-left font-bold text-sm text-gray-500">
										Language : &nbsp;
									</span>
									{
										movie.spoken_languages?.[0]
											?.english_name
									}
								</p>
							)}
							{movie.release_date && (
								<p className="text-left font-bold text-sm">
									<span className="text-left font-bold text-sm text-gray-500">
										Release Date : &nbsp;
									</span>
									{movie.release_date}
								</p>
							)}
							{movie.status && (
								<p className="text-left font-bold text-sm">
									<span className="text-left font-bold text-sm text-gray-500">
										Status : &nbsp;
									</span>
									{movie.status}
								</p>
							)}
							<p>
								<p className="text-left font-bold text-sm text-gray-500">
									Genre:
								</p>
								<Stack direction="row" spacing={1}>
									{movie?.genres?.map((genre) => (
										<Chip label={genre.name} />
									))}
								</Stack>
							</p>
						</div>
					</section>
					<div>
						<p className="text-left font-bold text-lg ">Plot</p>
						<p className="mb-2 text-left max-h-44 overflow-y-auto">
							{movie.overview}
						</p>
					</div>
					<section>
						{(videos?.results ?? []).length > 0 && (
							<div className="w-full">
								<h3 className="text-lg text-left font-semibold mb-2">
									Videos
								</h3>
								<div className="flex flex-wrap gap-2 max-h-44 max-w-96 overflow-y-auto">
									{videos.results
										?.sort(
											(a, b) =>
												videoTypeSortOrder[a.type] -
												videoTypeSortOrder[b.type]
										)
										?.map((video) => (
											<Chip
												icon={<YouTubeIcon />}
												label={`${video.type} - ${video.name}`}
												title="Click to view"
												onClick={() =>
													window.open(
														`https://www.youtube.com/watch?v=${video.key}`,
														"_blank"
													)
												}
											/>
										))}
								</div>
							</div>
						)}
					</section>
				</div>
				{(credits?.cast ?? []).length > 0 && (
					<div className="m-4 mt-4 px-16 w-full">
						<h3 className="text-xl text-left font-semibold mb-2">
							Casts
						</h3>
						<div className="grid grid-cols-4 gap-5 h-40 overflow-y-auto">
							{credits?.cast?.map((cast) => (
								<div className="flex">
										*/}
									<Avatar
										className="h-20 w-20"
										src={`https://image.tmdb.org/t/p/w500${cast?.profile_path}`}>
										{cast.name.slice(0, 2)}
									</Avatar>
									<p className="flex flex-col m-2 mt-2">
										<p className="font-bold">
											{cast.original_name}
										</p>
										<p>{cast.character}</p>
									</p>
								</div>
							))}
						</div>
					</div>
				)}
				{(uniqueCrew ?? []).length > 0 && (
					<div className="m-4 mt-4 px-16 w-full">
						<h3 className="text-xl text-left font-semibold mb-2">
							Crew
						</h3>
						<div className="grid grid-cols-4 gap-5 h-40 overflow-y-auto">
							{uniqueCrew?.map((person) => (
								<div className="flex">
									<Avatar
										className="h-20 w-20"
										src={`https://image.tmdb.org/t/p/w500${person?.profile_path}`}>
										{person.name.slice(0, 2)}
									</Avatar>
									<p className="flex flex-col m-2 mt-2">
										<p className="font-bold">
											{person.original_name}
										</p>
										<p>{person.job}</p>
									</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</Dialog>
	);
}
