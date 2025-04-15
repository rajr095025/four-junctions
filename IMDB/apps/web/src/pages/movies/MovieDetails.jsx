import { CircularProgress } from "@mui/material";
import {
	useGetFullMovieDetails,
	useGetMovieVideoLinks,
} from "../../hooks/movies";

export default function MovieDetails({ movieId }) {
	const { data: movie, isLoading: movieLoading } =
		useGetFullMovieDetails(movieId);
	const { data: videos, isLoading: videoLoading } =
		useGetMovieVideoLinks(movieId);

	const isLoading = movieLoading || videoLoading;

	if (!movieId)
		return (
			<div className="h-full w-2/3 flex items-center justify-center">
				<p>Select an Movie to view details</p>
			</div>
		);

	if (isLoading) {
		return (
			<div className="h-full w-2/3 flex items-center justify-center">
				<CircularProgress size={20} />
			</div>
		);
	}
	return (
		<div className="p-4 flex flex-col items-center">
			<div className="max-w-md text-center">
				<h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
				{movie.poster_path && (
					<img
						src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
						alt={movie.title}
						className="rounded-2xl shadow-lg mb-4"
					/>
				)}
				<p className="mb-2">{movie.overview}</p>
				<p className="text-sm text-gray-500">
					Release Date: {movie.release_date}
				</p>
			</div>
			{(videos?.results ?? []).length > 0 && (
				<div className="mt-8">
					<h3 className="text-xl font-semibold mb-2">Videos:</h3>
					{videos.results.map((video) => (
						<a
							key={video.id}
							href={`https://www.youtube.com/watch?v=${video.key}`}
							target="_blank"
							rel="noopener noreferrer"
							className="block text-blue-600 hover:underline mb-1">
							{video.name}
						</a>
					))}
				</div>
			)}
		</div>
	);
}
