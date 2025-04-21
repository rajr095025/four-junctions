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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useGetAllMovies } from "../../hooks/movies";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { openDialog } from "../../store/slices/dialogSlice";
import MovieDialog from "../../components/dialogs/MovieDialog";
import ActorDialog from "../../components/dialogs/ActorDialog";
import ProducerDialog from "../../components/dialogs/ProducerDialog";
import { useState } from "react";
import MovieDetails from "./MovieDetails";
import MovieList from "./MovieList";
import SelectedMovieDialog from "../../components/dialogs/SelectedMovieDialog";

export default function Movies() {
	const dispatch = useDispatch();
	const { data: moviesData, isLoading } = useGetAllMovies();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTab, setSelectedTab] = useState("tmdb");
	const [selectedMovieId, setSelectedMovieId] = useState(null);

	let filteredMovieData = moviesData
		? moviesData?.filter((movie) =>
				movie.name.toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: moviesData;

	const handleOpen = (movie = null) => {
		dispatch(openDialog({ type: "movies", item: movie }));
	};

	if (isLoading) {
		return <Typography>Loading...</Typography>;
	}

	function onMovieSelect(movie) {
		dispatch(openDialog({ type: "selectedMovie", item: movie }));
		// setSelectedMovieId(movie);
	}

	return (
		<Box className="p-6 w-full">
			<Box className="flex justify-between items-center mb-6 ">
				<Typography variant="h4" className="font-bold">
					Movies
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
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => handleOpen()}>
					Add Movie
				</Button>
			</Box>
			<Box className="w-full">
				<Tabs
					value={selectedTab}
					onChange={(e, newValue) => {
						setSelectedTab(newValue);
						setSearchTerm("");
					}}>
					<Tab label="TMDB" value="tmdb" />
					<Tab label="IMDB" value="imdb" />
				</Tabs>
			</Box>
			{selectedTab === "imdb" ? (
				<TableContainer component={Paper} className="shadow-lg">
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Poster</TableCell>
								<TableCell>Name</TableCell>
								<TableCell>Release Date</TableCell>
								<TableCell>Plot</TableCell>
								<TableCell>Producer</TableCell>
								<TableCell>Actors</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredMovieData?.map((movie) => (
								<TableRow key={movie._id}>
									<TableCell>
										{movie.poster.length > 0 && (
											<Avatar
												src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
												alt={movie.name}
												variant="rounded"
												sx={{ width: 60, height: 90 }}
											/>
										)}
									</TableCell>
									<TableCell>{movie.name}</TableCell>
									<TableCell>
										{new Date(
											movie.releasedAt
										).toLocaleDateString()}
									</TableCell>
									<TableCell title={movie.plot}>
										{movie.plot && movie.plot.length > 100
											? `${movie.plot.substring(
													0,
													100
											  )}...`
											: movie.plot}
									</TableCell>
									<TableCell>{movie.producer.name}</TableCell>
									<TableCell>
										<Box className="flex flex-wrap gap-2">
											{(movie?.actors ?? [])?.map(
												(actor) => (
													<Chip
														key={actor._id}
														label={actor.name}
														size="small"
													/>
												)
											)}
										</Box>
									</TableCell>
									<TableCell>
										<Button
											startIcon={<EditIcon />}
											onClick={() => handleOpen(movie)}>
											Edit
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<div className="flex gap-8">
					<div className="flex-1">
						<MovieList
							searchTerm={searchTerm}
							onMovieSelect={onMovieSelect}
						/>
					</div>
					{selectedMovieId && (
						<div className="flex-1">
							<MovieDetails movieId={selectedMovieId} />
						</div>
					)}
				</div>
			)}

			<ActorDialog />
			<ProducerDialog />
			<MovieDialog />
			<SelectedMovieDialog />
		</Box>
	);
}
