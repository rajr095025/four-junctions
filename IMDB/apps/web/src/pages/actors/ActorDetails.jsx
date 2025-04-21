import { useGetFullActorDetails } from "../../hooks/actors";
import { CircularProgress } from "@mui/material";

export default function ActorDetails({ actorId }) {
	const { data: actor, isLoading } = useGetFullActorDetails(actorId);

	if (!actorId) return <></>;

	if (isLoading) {
		return (
			<div className="h-full w-2/3 flex items-center justify-center">
				<CircularProgress size={20} />
			</div>
		);
	}

	return (
		<div className="p-4 flex flex-col items-center  h-full">
			<div className="max-w-md text-center">
				<h2 className="text-2xl font-bold mb-2">{actor.name}</h2>
				{actor.profile_path && (
					<img
						src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
						alt={actor.name}
						className="rounded-full shadow-lg mb-4 w-48 h-48 object-cover mx-auto"
					/>
				)}
				<p className="mb-2">Known For: {actor.known_for_department}</p>
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
		</div>
	);
}
