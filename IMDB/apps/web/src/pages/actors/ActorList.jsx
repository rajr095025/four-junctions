import { Avatar, CircularProgress } from "@mui/material";
import {
	useGetActorSuggestions,
	useGetPopularActors,
} from "../../hooks/actors";
import { openDialog } from "../../store/slices/dialogSlice";
import { useDispatch } from "react-redux";
import ActorDialog from "../../components/dialogs/ActorDialog";
import SelectedActorDialog from "../../components/dialogs/SelectedActorDialog";

export default function ActorList({ searchTerm }) {
	const { data: popularActors, isLoading: popularActorsLoading } =
		useGetPopularActors();

	const dispatch = useDispatch();
	const {
		data: filteredActors,
		isLoading: filteredActorsLoading,
		isFetching,
	} = useGetActorSuggestions(searchTerm);

	function onActorSelect(actor, actor2) {
		dispatch(openDialog({ type: "selectedActor", item: actor }));
	}

	const actors =
		searchTerm.length > 0 ? filteredActors ?? [] : popularActors ?? [];
	const isLoading = popularActorsLoading || filteredActorsLoading;

	if (isLoading || isFetching) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<CircularProgress size={20} />
			</div>
		);
	}

	return (
		<>
			<div className="p-6 grid grid-cols-7 gap-x-12 gap-y-12 w-full">
				{actors.map((actor) => (
					<div
						key={actor.id}
						className="flex flex-col items-center gap-3 hover:cursor-pointer"
						onClick={() => onActorSelect(actor.id, actor)}>
						<Avatar
							className="h-60 w-44"
							src={`https://image.tmdb.org/t/p/w500${actor?.profile_path}`}>
							{actor.name.slice(0, 2)}
						</Avatar>
						<h2 className="text-sm mt-2">{actor.name}</h2>
					</div>
				))}
			</div>
			<SelectedActorDialog />
		</>
	);
}
