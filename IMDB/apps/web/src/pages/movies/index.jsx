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
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

import { useGetAllMovies } from "../../hooks/movies";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { openDialog } from "../../store/slices/dialogSlice";
import MovieDialog from "../../components/dialogs/MovieDialog";
import ActorDialog from "../../components/dialogs/ActorDialog";
import ProducerDialog from "../../components/dialogs/ProducerDialog";
import { useEffect, useState } from "react";
import MovieDetails from "./MovieDetails";
import MovieList from "./MovieList";

export default function Movies() {
	const dispatch = useDispatch();
	const { data: moviesData, isLoading } = useGetAllMovies();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedTab, setSelectedTab] = useState("imdb");
	const [selectedMovieId, setSelectedMovieId] = useState(null);

	let filteredMovieData = moviesData
		? moviesData?.filter((movie) =>
				movie.name.toLowerCase().includes(searchTerm.toLowerCase())
			)
		: moviesData;

	const handleOpen = (movie = null) => {
		dispatch(openDialog({ type: "movies", item: movie }));
	};

	const token =
		"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDNmMGZmNzk5OWQ2NDU5NTI0YjE2ZmFmZmVlYjZmNCIsIm5iZiI6MTY4MDY2NjM0MC42MTQsInN1YiI6IjY0MmNlZWU0MmRmZmQ4MDBiNWE1ZTdiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FOutSp3MM4JNLKsCmjSgCjtgddNNIFk0JUVpM9gLAGk";

	useEffect(() => {
		// 		fetch(`https://api.themoviedb.org/3/movie/550?api_key=a43f0ff7999d6459524b16faffeeb6f4`)
		//   .then(response => response.json())
		//   .then(data => console.log(data , "tmdb data"));
		fetch("https://api.themoviedb.org/3/movie/11", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				accept: "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => console.log(data, "tmdb data"));

		fetch(
			"https://api.themoviedb.org/3/movie/11?append_to_response=videos,images",
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					accept: "application/json",
				},
			}
		)
			.then((response) => response.json())
			.then((data) =>
				console.log(data, "tmdb data with image and video")
			);
	}, []);

	if (isLoading) {
		return <Typography>Loading...</Typography>;
	}

	return (
		<Box className="p-6">
			<Box className="flex justify-between items-center mb-6">
				<Typography variant="h4" className="font-bold">
					Movies
				</Typography>
				<Paper
					component="form"
					sx={{
						p: "2px 4px",
						display: "flex",
						alignItems: "center",
						width: 400,
					}}>
					<InputBase
						sx={{ ml: 1, flex: 1 }}
						placeholder="Search Movies"
						inputProps={{ "aria-label": "search movies" }}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<IconButton
						type="button"
						sx={{ p: "10px" }}
						aria-label="search">
						<SearchIcon />
					</IconButton>
				</Paper>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => handleOpen()}>
					Add Movie
				</Button>
			</Box>
			<Box sx={{ width: "100%", typography: "body1" }}>
				<TabContext value={selectedTab}>
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<TabList
							onChange={(e, newValue) => {
								console.log("value changed", newValue);
								setSelectedTab(newValue);
							}}
							aria-label="lab API tabs example">
							<Tab label="IMDB" value="imdb" />
							<Tab label="TMDB" value="tmdb" />
						</TabList>
					</Box>
				</TabContext>
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
										{movie.poster && (
											<Avatar
												src={`${import.meta.env.VITE_API_URL}${movie.poster}`}
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
									<TableCell>
										{movie.plot && movie.plot.length > 100
											? `${movie.plot.substring(0, 100)}...`
											: movie.plot}
									</TableCell>
									<TableCell>
										{movie.producer?.name || movie.producer}
									</TableCell>
									<TableCell>
										<Box
											sx={{
												display: "flex",
												flexWrap: "wrap",
												gap: 0.5,
											}}>
											{movie.actors?.map((actor) => (
												<Chip
													key={actor._id || actor}
													label={actor.name || actor}
													size="small"
												/>
											))}
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
				// <MovieList searchTerm={searchTerm}></MovieList>
				<div className="flex gap-8">
					<div className="flex-1">
						<MovieList
							searchTerm={searchTerm}
							selectedMovieId={selectedMovieId}
							onMovieSelect={setSelectedMovieId}
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
		</Box>
	);
}
