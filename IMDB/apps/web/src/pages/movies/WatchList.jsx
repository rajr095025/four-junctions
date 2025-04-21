import { CircularProgress } from "@mui/material";
import {
	useGetMovieSuggestions,
	useGetPopularMovies,
} from "../../hooks/movies";

export default function WatchList({ searchTerm, onMovieSelect }) {
	const { data: popularMovies, isLoading: popularMoviesLoading } =
		useGetPopularMovies();
	const {
		data: filteredMovies,
		isLoading: filteredMoviesLoading,
		isFetching,
	} = useGetMovieSuggestions(searchTerm);

	const movies =
		searchTerm.length > 0 ? filteredMovies ?? [] : popularMovies ?? [];
	const isLoading = popularMoviesLoading || filteredMoviesLoading;

	if (isLoading || isFetching) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<CircularProgress size={20} />
			</div>
		);
	}

	return (
		<div className="p-6 grid grid-cols-4 gap-x-12 gap-y-12">
			{movies.map((movie) => (
				<div
					key={movie.id}
					className="flex flex-col items-center gap-3 hover:cursor-pointer"
					onClick={() => onMovieSelect(movie.id)}>
					<img
						alt={`Movie Poster of ${movie.title}`}
						className="h-60 w-44 object-contain"
						src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = "/ImageNotAvailable.jpg";
							console.log("e.taget ", e.target);
						}}
					/>
					<h2 className="text-sm mt-2">{movie.title}</h2>
				</div>
			))}
		</div>
	);
}
