import React, { useEffect, useState } from "react";

// const MovieDetails = () => {
// 	const [movie, setMovie] = useState(null);
// 	const [videos, setVideos] = useState(null);

// 	const token =
// 		"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDNmMGZmNzk5OWQ2NDU5NTI0YjE2ZmFmZmVlYjZmNCIsIm5iZiI6MTY4MDY2NjM0MC42MTQsInN1YiI6IjY0MmNlZWU0MmRmZmQ4MDBiNWE1ZTdiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FOutSp3MM4JNLKsCmjSgCjtgddNNIFk0JUVpM9gLAGk";

// 	useEffect(() => {
// 		const fetchMovie = async () => {
// 			try {
// 				const res = await fetch(
// 					"https://api.themoviedb.org/3/movie/11",
// 					{
// 						method: "GET",
// 						headers: {
// 							Authorization: `Bearer ${token}`,
// 							accept: "application/json",
// 						},
// 					}
// 				);
// 				const data = await res.json();
// 				setMovie(data);
// 			} catch (err) {
// 				console.error("Error fetching movie details:", err);
// 			}
// 		};

// 		const fetchVideos = async () => {
// 			try {
// 				const res = await fetch(
// 					"https://api.themoviedb.org/3/movie/11/videos",
// 					{
// 						method: "GET",
// 						headers: {
// 							Authorization: `Bearer ${token}`,
// 							accept: "application/json",
// 						},
// 					}
// 				);
// 				const data = await res.json();
// 				setVideos(data);
// 			} catch (err) {
// 				console.error("Error fetching movie videos:", err);
// 			}
// 		};

// 		fetchMovie();
// 		fetchVideos();
// 	}, []);

// 	return (
// 		<div className="p-4 flex flex-col items-center">
// 			{movie ? (
// 				<div className="max-w-md text-center">
// 					<h2 className="text-2xl font-bold mb-2">{movie.title}</h2>
// 					{movie.poster_path && (
// 						<img
// 							src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
// 							alt={movie.title}
// 							className="rounded-2xl shadow-lg mb-4"
// 						/>
// 					)}
// 					<p className="mb-2">{movie.overview}</p>
// 					<p className="text-sm text-gray-500">
// 						Release Date: {movie.release_date}
// 					</p>
// 				</div>
// 			) : (
// 				<p>Loading movie details...</p>
// 			)}

// 			{videos && videos.results.length > 0 ? (
// 				<div className="mt-8">
// 					<h3 className="text-xl font-semibold mb-2">Videos:</h3>
// 					{videos.results.map((video) => (
// 						<a
// 							key={video.id}
// 							href={`https://www.youtube.com/watch?v=${video.key}`}
// 							target="_blank"
// 							rel="noopener noreferrer"
// 							className="block text-blue-600 hover:underline mb-1">
// 							{video.name}
// 						</a>
// 					))}
// 				</div>
// 			) : (
// 				<p className="mt-4">Loading videos...</p>
// 			)}
// 		</div>
// 	);
// };

// export default MovieDetails;

const MovieDetails = ({ movieId }) => {
	const [movie, setMovie] = useState(null);
	const [videos, setVideos] = useState(null);
	const token =
		"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDNmMGZmNzk5OWQ2NDU5NTI0YjE2ZmFmZmVlYjZmNCIsIm5iZiI6MTY4MDY2NjM0MC42MTQsInN1YiI6IjY0MmNlZWU0MmRmZmQ4MDBiNWE1ZTdiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FOutSp3MM4JNLKsCmjSgCjtgddNNIFk0JUVpM9gLAGk";

	useEffect(() => {
		if (!movieId) return;

		const fetchMovie = async () => {
			const res = await fetch(
				`https://api.themoviedb.org/3/movie/${movieId}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						accept: "application/json",
					},
				}
			);
			const data = await res.json();
			setMovie(data);
		};

		const fetchVideos = async () => {
			const res = await fetch(
				`https://api.themoviedb.org/3/movie/${movieId}/videos`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						accept: "application/json",
					},
				}
			);
			const data = await res.json();
			setVideos(data);
		};

		fetchMovie();
		fetchVideos();
	}, [movieId]);

	if (!movieId) return <p>Select a movie to view details</p>;

	return (
		<div className="p-4 flex flex-col items-center">
			{movie ? (
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
			) : (
				<p>Loading movie details...</p>
			)}

			{videos && videos.results.length > 0 ? (
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
			) : (
				<p className="mt-4">Loading videos...</p>
			)}
		</div>
	);
};

export default MovieDetails;
