import React, { useEffect, useState } from "react";

const token =
	"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDNmMGZmNzk5OWQ2NDU5NTI0YjE2ZmFmZmVlYjZmNCIsIm5iZiI6MTY4MDY2NjM0MC42MTQsInN1YiI6IjY0MmNlZWU0MmRmZmQ4MDBiNWE1ZTdiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FOutSp3MM4JNLKsCmjSgCjtgddNNIFk0JUVpM9gLAGk";

const ActorDetails = ({ actorId }) => {
	const [actor, setActor] = useState(null);

	useEffect(() => {
		if (!actorId) return;

		const fetchActor = async () => {
			const res = await fetch(
				`https://api.themoviedb.org/3/person/${actorId}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						accept: "application/json",
					},
				}
			);
			const data = await res.json();
			console.log("data fetched actor", data);
			setActor(data);
		};

		fetchActor();
	}, [actorId]);

	if (!actorId) return <p>Select an actor to view details</p>;

	return (
		<div className="p-4 flex flex-col items-center">
			{actor ? (
				<div className="max-w-md text-center">
					<h2 className="text-2xl font-bold mb-2">{actor.name}</h2>
					{actor.profile_path && (
						<img
							src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
							alt={actor.name}
							className="rounded-full shadow-lg mb-4 w-48 h-48 object-cover mx-auto"
						/>
					)}
					<p className="mb-2">
						Known For: {actor.known_for_department}
					</p>
					<p className="text-sm text-gray-500">
						Birthday: {actor.birthday || "Unknown"}
					</p>
					<p className="text-sm text-gray-500">
						Place of Birth: {actor.place_of_birth || "Unknown"}
					</p>
					{actor?.biography ?? (
						<p className="text-sm text-gray-500">
							Biography: {actor.biography || "Unknown"}
						</p>
					)}
				</div>
			) : (
				<p>Loading actor details...</p>
			)}
		</div>
	);
};

export default ActorDetails;
