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
import { useGetAllActors } from "../../hooks/actors";
import { useGetAllProducers } from "../../hooks/producers";
import { closeDialog } from "../../store/slices/dialogSlice";
import { Add as AddIcon } from "@mui/icons-material";
import { openDialog } from "../../../redux/slice/dialogSlice";
import MovieDetails from "../../pages/movies/MovieDetails";
import {
	useGetFullActorDetails,
	useGetFullActorMovies,
} from "../../hooks/actors";
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

export default function SelectedActorDialog() {
	const dispatch = useDispatch();
	const object = useSelector((state) => state.dialog.selectedActor);

	const { open, selectedItem } = object;
	const handleClose = () => {
		dispatch(closeDialog({ type: "selectedActor" }));
	};

	const { data: actor, isActorDetailsLoading } =
		useGetFullActorDetails(selectedItem);
	const { data: actorMovies, isActorMoviesLoading } =
		useGetFullActorMovies(selectedItem);

	if (!selectedItem || !actor){ 
		return null
	};

	if (!selectedItem){
		return null
	};

	if (isActorDetailsLoading || isActorMoviesLoading) {
		return (
			<div className="h-full w-2/3 flex items-center justify-center">
				<CircularProgress size={20} />
			</div>
		);
	}

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
			<div className="p-4 px-20 flex flex-col items-center h-full ">
				<header className="relative w-full mb-1">
					<h2 className="text-center text-2xl font-bold mb-2">
						{actor.name}
					</h2>
					<div
						className="absolute top-1 right-0 hover:cursor-pointer"
						onClick={handleClose}>
						<CloseIcon></CloseIcon>
					</div>
				</header>
				<section className="grid grid-cols-3">
					<section>
						{actor.profile_path && (
							<img
								src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
								alt={actor.name}
								className="rounded-full shadow-lg mb-4 w-48 h-48 object-cover mx-auto"
							/>
						)}
					</section>
					<section>
						<h3 className="text-lg text-left font-semibold mb-2">
							Details
						</h3>
						{actor.known_for_department && (
							<p className="text-left font-bold text-sm">
								<span className="text-left font-bold text-sm text-gray-500">
									Known For : &nbsp;
								</span>
								{actor.known_for_department}
							</p>
						)}
						{actor.birthday && (
							<p className="text-left font-bold text-sm">
								<span className="text-left font-bold text-sm text-gray-500">
									Birthday : &nbsp;
								</span>
								{actor.birthday}
							</p>
						)}
						{actor.place_of_birth && (
							<p className="text-left font-bold text-sm">
								<span className="text-left font-bold text-sm text-gray-500">
									Place of Birth : &nbsp;
								</span>
								{actor.place_of_birth}
							</p>
						)}
					</section>

					<section>
						<h3 className="text-lg text-left font-semibold mb-2">
							Biography
						</h3>
						{actor?.biography ? (
							<p className="text-sm text-gray-500 max-h-60 overflow-y-auto">
								Biography: {actor.biography || "Unknown"}
							</p>
						) : (
							<p></p>
						)}
					</section>
				</section>
				{(actorMovies?.cast ?? []).length > 0 && (
					<div className="m-4 mt-4 px-4 w-full">
						<h3 className="text-xl text-left font-semibold mb-2">
							Movies
						</h3>
						<div className="grid grid-cols-3 gap-5 h-64 overflow-y-auto">
							{actorMovies?.cast?.map((cast) => (
								<div className="flex">
									<img
										className="h-24 w-20"
										src={`https://image.tmdb.org/t/p/w500${cast?.poster_path}`}>
									</img>
									<p className="flex flex-col m-2 mt-2">
										<p className="font-bold">
											{cast.title}
										</p>
										<p>{cast.character}</p>
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
