import { CircularProgress } from "@mui/material";
import {
	useGetFullMovieDetails,
	useGetMovieVideoLinks,
} from "../../hooks/movies";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FaceIcon from "@mui/icons-material/Face";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CloseIcon from "@mui/icons-material/Close";

let videoTypeSortOrder = { Trailer: 0, Teaser: 1, Featurette: 2, Clip: 3 };

export default function MovieDetails({ movieId }) {
	const { data: movie, isLoading: movieLoading } =
		useGetFullMovieDetails(movieId);
	const { data: videos, isLoading: videoLoading } =
		useGetMovieVideoLinks(movieId);

	console.log("movie", movie);

	const isLoading = movieLoading || videoLoading;

	if (isLoading) {
		return (
			<div className="h-full w-2/3 flex items-center justify-center">
				<CircularProgress size={20} />
			</div>
		);
	}
	return (
		<div className="p-4 flex flex-col items-center">
			<header className="relative m-1 w-full">
				<h2 className="text-center text-2xl font-bold mb-2">
					{movie.title}
				</h2>
				<div className="absolute top-1 right-2 hover:cursor-pointer">
					<CloseIcon></CloseIcon>
				</div>
			</header>
			<div
				className={`grid [grid-template-columns:2fr_3fr_3fr]  text-center`}>
				<div>
					{movie.poster_path && (
						<img
							src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
							alt={movie.title}
							className="rounded-2xl shadow-lg mb-4 w-40 h-50"
						/>
					)}
				</div>

				<div>
					<p>
						<p className="text-left font-bold text-sm text-gray-500">
							Release Date: {movie.release_date}
						</p>
						{/* <p>{movie.release_date}</p> */}
					</p>

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
				<div>
					<p className="mb-2">{movie.overview}</p>
				</div>
			</div>
			{(videos?.results ?? []).length > 0 && (
				<div className="mt-8">
					<h3 className="text-xl font-semibold mb-2">Videos:</h3>
					<div className="flex flex-wrap gap-2 h-20 overflow-y-scroll">
						{console.log("videos ", videos)}
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
		</div>
	);
}
