import React, { useEffect, useState } from "react";

const token =
	"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDNmMGZmNzk5OWQ2NDU5NTI0YjE2ZmFmZmVlYjZmNCIsIm5iZiI6MTY4MDY2NjM0MC42MTQsInN1YiI6IjY0MmNlZWU0MmRmZmQ4MDBiNWE1ZTdiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FOutSp3MM4JNLKsCmjSgCjtgddNNIFk0JUVpM9gLAGk";

const ActorList = ({ searchTerm, selectedActorId, onActorSelect }) => {
	const [actors, setActors] = useState([]);

	useEffect(() => {
		const fetchActors = async () => {
			try {
				const res = await fetch(
					"https://api.themoviedb.org/3/discover/person",
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
							accept: "application/json",
						},
					}
				);
				const data = await res.json();
				setActors(data.results);
			} catch (err) {
				console.error("Error fetching movies:", err);
			}
		};

		fetchActors();
	}, []);

	const fetchActorSuggestions = async (query) => {
		try {
			const res = await fetch(
				`https://api.themoviedb.org/3/search/person?query=${query}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						accept: "application/json",
					},
				}
			);
			const data = await res.json();
			setActors(data.results);
		} catch (err) {
			console.error("Error fetching actor suggestions:", err);
		}
	};

	useEffect(() => {
		if (searchTerm) fetchActorSuggestions(searchTerm);
	}, [searchTerm]);

	return (
		<div className="p-6">
			<ul className="grid grid-cols-4 md:grid-cols-6 gap-4">
				{actors?.map((actor) => (
					<li
						key={actor.id}
						className="text-center list-none"
						onClick={() => onActorSelect(actor.id)}>
						{actor.profile_path ? (
							<img
								src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
								alt={actor.name}
								className="rounded-full shadow-md hover:cursor-pointer hover:scale-105 transition-transform w-32 h-32 object-cover mx-auto"
							/>
						) : (
							<div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-700 mx-auto">
								No Image
							</div>
						)}
						<h2 className="text-sm mt-2">{actor.name}</h2>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ActorList;
