import { CircularProgress } from "@mui/material";
import {
	useAddWatchListMovie,
	useGetMovieSuggestions,
	useGetPopularMovies,
	useGetAllWatchListMovies,
} from "../../hooks/movies";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddWatchList from "../../assets/icons/wishlist1.png";
import WatchList from "../../assets/icons/watchList.png";

export default function MovieList({ searchTerm, onMovieSelect }) {
	const { data: popularMovies, isLoading: popularMoviesLoading } =
		useGetPopularMovies();

	const {
		mutateAsync: addMovieToWatchList,
		isPending: addMovieWatchListPending,
	} = useAddWatchListMovie();

	const {
		data: filteredMovies,
		isLoading: filteredMoviesLoading,
		isFetching,
	} = useGetMovieSuggestions(searchTerm);

	const { data: watchListMovies, isLoading: watchListMoviesLoading } =
		useGetAllWatchListMovies();

	const wishList = watchListMovies
		? watchListMovies?.map((movie) => movie.id)
		: [];

	console.log(watchListMovies, "watchListMovies ", wishList);

	const movies =
		searchTerm.length > 0 ? filteredMovies ?? [] : popularMovies ?? [];
	const isLoading = popularMoviesLoading || filteredMoviesLoading;

	if (isLoading || isFetching || addMovieWatchListPending) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<CircularProgress size={20} />
			</div>
		);
	}

	function onWatchListAddClick(e, movieId) {
		e.stopPropagation();
		addMovieToWatchList({
			id: movieId,
		});
	}

	return (
		<div className="p-6 grid grid-cols-5 gap-x-12 gap-y-12">
			{movies.map((movie) => (
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
								e.target.src = "/ImageNotAvailable.jpg";
							}}
						/>
						{wishList?.includes(movie.id) ? (
							<img
								className="absolute right-3"
								title="Your Watch List Movie"
								src={WatchList}></img>
						) : (
							<img
								className=" absolute right-3"
								src={AddWatchList}
								title="Click to add to Watch List."
								onClick={(e) =>
									onWatchListAddClick(e, movie.id)
								}></img>
						)}
					</div>

					<h2 className="text-sm mt-2">{movie.title}</h2>
				</div>
			))}
		</div>
	);
}
