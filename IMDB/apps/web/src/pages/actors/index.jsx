import { useDispatch } from "react-redux";
import {
	Box,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Tab,
	Chip,
	TextField,
	Tabs,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useGetAllActors } from "../../hooks/actors";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { openDialog } from "../../store/slices/dialogSlice";
import ActorDialog from "../../components/dialogs/ActorDialog";
import { useState } from "react";
import ActorList from "./ActorList";
import ActorDetails from "./ActorDetails";

export default function Actors() {
	const dispatch = useDispatch();
	const { data: actorsData, isLoading } = useGetAllActors();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedActorId, setSelectedActorId] = useState(null);
	const [selectedTab, setSelectedTab] = useState("tmdb");

	const filteredActorsData = (actorsData ?? []).filter((actor) =>
		actor.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleOpen = (actor = null) => {
		dispatch(openDialog({ type: "actors", item: actor }));
	};

	if (isLoading) {
		return <Typography>Loading...</Typography>;
	}

	return (
		<Box className="p-6">
			<Box className="flex justify-between items-center mb-6">
				<Typography variant="h4" className="font-bold">
					Actors
				</Typography>
				<TextField
					placeholder="Search Actors"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					slotProps={{
						input: {
							endAdornment: <SearchIcon />,
						},
					}}
				/>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => handleOpen()}>
					Add Actor
				</Button>
			</Box>
			<Box className="w-full">
				<Tabs
					value={selectedTab}
					onChange={(e, newValue) => {
						setSearchTerm("");
						setSelectedTab(newValue);
					}}>
					<Tab label="TMDB" value="tmdb" />
					<Tab label="IMDB" value="imdb" />
				</Tabs>
			</Box>

			{selectedTab === "imdb" ? (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Date of Birth</TableCell>
								<TableCell>Gender</TableCell>
								<TableCell>Biography</TableCell>
								<TableCell>Movies</TableCell>
								<TableCell>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filteredActorsData.map((actor) => (
								<TableRow key={actor._id}>
									<TableCell>{actor.name}</TableCell>
									<TableCell>
										{actor?.dob
											? new Date(
													actor.dob
											  ).toLocaleDateString()
											: "No data"}
									</TableCell>
									<TableCell>{actor.gender}</TableCell>
									<TableCell title={actor.bio}>
										{actor.bio && actor.bio.length > 100
											? `${actor.bio.substring(
													0,
													100
											  )}...`
											: actor.bio}
									</TableCell>
									<TableCell>
										<Box className="flex flex-wrap gap-2">
											{(actor?.movies ?? []).map(
												(actor) => (
													<Chip
														key={actor._id || actor}
														label={
															actor.name || actor
														}
														size="small"
													/>
												)
											)}
										</Box>
									</TableCell>
									<TableCell>
										<Button
											startIcon={<EditIcon />}
											onClick={() => handleOpen(actor)}>
											Edit
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				<div className="flex gap-8">
					<ActorList
						searchTerm={searchTerm}
						selectedActorId={selectedActorId}
						onActorSelect={setSelectedActorId}
					/>
					<ActorDetails actorId={selectedActorId} />
				</div>
			)}

			<ActorDialog />
		</Box>
	);
}
