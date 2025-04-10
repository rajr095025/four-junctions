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
	Chip,
	Avatar,
} from "@mui/material";

import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import { useGetAllActors } from "../../hooks/actors";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { openDialog } from "../../store/slices/dialogSlice";
import ActorDialog from "../../components/dialogs/ActorDialog";
import { useState } from "react";

export default function Actors() {
	const dispatch = useDispatch();
	const { data: actorsData, isLoading } = useGetAllActors();

	
			const [searchTerm, setSearchTerm] = useState("");
		
			let filteredActorsData = actorsData ? actorsData?.filter((actor) =>
				actor.name.toLowerCase().includes(searchTerm.toLowerCase())
			) : actorsData;
		

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
				<Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
 
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Actors"
        inputProps={{ 'aria-label': 'search actors' }}
		value={searchTerm}
		onChange={(e) => setSearchTerm(e.target.value)}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
 
    </Paper>
				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={() => handleOpen()}>
					Add Actor
				</Button>
			</Box>

			<TableContainer component={Paper} className="shadow-lg">
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
						{filteredActorsData?.map((actor) => (
							<TableRow key={actor._id}>
								<TableCell>{actor.name}</TableCell>
								<TableCell>
									{actor.dob &&
										new Date(
											actor.dob
										).toLocaleDateString()}
								</TableCell>
								<TableCell>{actor.gender}</TableCell>
								<TableCell>
									{actor.bio && actor.bio.length > 100
										? `${actor.bio.substring(0, 100)}...`
										: actor.bio}
								</TableCell>
								{/* <TableCell>{actor.movies}</TableCell> */}	
								
								<TableCell>
									<Box
										sx={{
											display: "flex",
											flexWrap: "wrap",
											gap: 0.5,
										}}>
										{actor.movies?.map((actor) => (
											<Chip
												key={actor._id || actor}
												label={actor.name || actor}
												size="small"
											/>
										))}
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

			<ActorDialog />
		</Box>
	);
}
