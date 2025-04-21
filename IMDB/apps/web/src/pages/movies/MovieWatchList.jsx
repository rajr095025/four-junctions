import { useDispatch } from "react-redux";
import {
	Box,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tab,
	Typography,
	Chip,
	Avatar,
	Tabs,
	TextField,
	CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
	useGetAllMovies,
	useGetAllWatchListMovies,
	useGetMoviesByIds,
} from "../../hooks/movies";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { openDialog } from "../../store/slices/dialogSlice";
import MovieDialog from "../../components/dialogs/MovieDialog";
import ActorDialog from "../../components/dialogs/ActorDialog";
import ProducerDialog from "../../components/dialogs/ProducerDialog";
import { useState } from "react";
import MovieDetails from "./MovieDetails";
import MovieList from "./MovieList";
import SelectedMovieDialog from "../../components/dialogs/SelectedMovieDialog";

export default function MoviesWatchList() {
	const dispatch = useDispatch();
	const [searchTerm, setSearchTerm] = useState("");

	const { data: watchListMovies, isLoading: watchListMoviesLoading } =
		useGetAllWatchListMovies();

	const wishList = watchListMovies
		? watchListMovies?.map((movie) => movie.id)
		: [];

	const movieQueries = useGetMoviesByIds(wishList);

	const movies = movieQueries?.map((query) => query.data);

	let filteredMovieData = movies
		? movies?.filter((movie) =>
				movie?.title?.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: [];

	if (
		watchListMoviesLoading ||
		movieQueries?.some((query) => query.isLoading)
	) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<CircularProgress size={20} />
			</div>
		);
	}

	function onMovieSelect(movie) {
		dispatch(openDialog({ type: "selectedMovie", item: movie }));
	}

	return (
		<Box className="p-6 w-full">
			<Box className="flex justify-between items-center mb-6 ">
				<Typography variant="h4" className="font-bold">
					Movies Watch List
				</Typography>
				<Box component="form" className="p-2 flex items-center w-96">
					<TextField
						placeholder="Search Movies"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						slotProps={{
							input: {
								endAdornment: <SearchIcon />,
							},
						}}
					/>
				</Box>
			</Box>
			<div className="flex gap-8">
				<div className="flex-1">
					<div className="p-6 grid grid-cols-5 gap-x-12 gap-y-12">
						{filteredMovieData.map((movie) => (
							<div
								key={movie.id}
								className="flex flex-col items-center gap-3 hover:cursor-pointer"
								onClick={() => onMovieSelect(movie.id)}>
								<div className="relative">
									<img
										alt={`Movie Poster of ${movie.title}`}
										className="h-60 w-44 object-contain"
										src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
										onError={(e) => {
											e.target.onerror = null;
											e.target.src =
												"/ImageNotAvailable.jpg";
										}}
									/>
								</div>

								<h2 className="text-sm mt-2">
									{movie.title}
								</h2>
							</div>
						))}
					</div>
				</div>
			</div>
			<SelectedMovieDialog />
		</Box>
	);
}
