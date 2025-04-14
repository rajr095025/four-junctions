import React, { useEffect, useState } from "react";

const MovieList = ({ searchTerm, selectedMovieId, onMovieSelect }) => {
	const [movies, setMovies] = useState([]);
	const [filteredMovies, setFilteredMovies] = useState([]);
	const token =
		"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDNmMGZmNzk5OWQ2NDU5NTI0YjE2ZmFmZmVlYjZmNCIsIm5iZiI6MTY4MDY2NjM0MC42MTQsInN1YiI6IjY0MmNlZWU0MmRmZmQ4MDBiNWE1ZTdiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FOutSp3MM4JNLKsCmjSgCjtgddNNIFk0JUVpM9gLAGk";

	useEffect(() => {
		const fetchMovies = async () => {
			try {
				const res = await fetch(
					"https://api.themoviedb.org/3/discover/movie",
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
							accept: "application/json",
						},
					}
				);
				const data = await res.json();
				setMovies(data.results);
			} catch (err) {
				console.error("Error fetching movies:", err);
			}
		};

		fetchMovies();
	}, []);

	const fetchMovieSuggestions = async (query) => {
		try {
			const res = await fetch(
				`https://api.themoviedb.org/3/search/movie?query=${query}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						accept: "application/json",
					},
				}
			);
			const data = await res.json();

			console.log("data search", data.results);

			setFilteredMovies(data.results);
			return data.results;
		} catch (err) {
			console.error("Error fetching movie suggestions:", err);
		}
	};

	useEffect(() => {
		fetchMovieSuggestions(searchTerm);
	}, [searchTerm]);

	return (
		<div className="p-6">
			<ul
				className={`grid grid-cols-${selectedMovieId ? 3 : 4} md:grid-cols-${selectedMovieId ? 3 : 4} lg:grid-cols-${selectedMovieId ? 3 : 6} gap-4`}>
				{(searchTerm?.length > 0 ? filteredMovies : movies)?.map(
					(movie) => (
						<li
							key={movie.id}
							className="text-center list-none"
							onClick={() => onMovieSelect(movie.id)}>
							{movie.poster_path ? (
								<img
									src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
									alt={movie.title}
									className="rounded-xl shadow-md hover:cursor-pointer hover:scale-105 transition-transform w-64 h-72"
								/>
							) : (
								<div className="w-full h-64 bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-700">
									No Image
								</div>
							)}
							<h2 className="text-sm mt-2">{movie.title}</h2>
						</li>
					)
				)}
			</ul>
		</div>
	);

	// return (
	// 	<div className="p-6">
	// 		<ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
	// 			{(searchTerm?.length > 0 ? filteredMovies : movies)?.map(
	// 				(movie) => (
	// 					<li key={movie.id} className="text-center list-none">
	// 						{movie.poster_path ? (
	// 							<img
	// 								src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
	// 								alt={movie.title}
	// 								className="rounded-xl shadow-md hover:cursor-pointer hover:scale-105 transition-transform w-64 h-72"
	// 							/>
	// 						) : (
	// 							<div className="w-full h-64 bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-700">
	// 								No Image
	// 							</div>
	// 						)}
	// 						<h2 className="text-sm mt-2">{movie.title}</h2>
	// 					</li>
	// 				)
	// 			)}
	// 		</ul>
	// 	</div>
	// );
};

export default MovieList;
