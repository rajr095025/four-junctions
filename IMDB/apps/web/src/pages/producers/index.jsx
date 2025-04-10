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
import { useGetAllProducers } from "../../hooks/producers";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { openDialog } from "../../store/slices/dialogSlice";
import ProducerDialog from "../../components/dialogs/ProducerDialog";
import { useState } from "react";

export default function Producers() {
	const dispatch = useDispatch();
	const { data: producersData, isLoading } = useGetAllProducers();

		const [searchTerm, setSearchTerm] = useState("");
	
		let filteredProducersData = producersData ? producersData?.filter((producer) =>
			producer.name.toLowerCase().includes(searchTerm.toLowerCase())
		) : producersData;
	

	const handleOpen = (producer = null) => {
		dispatch(openDialog({ type: "producers", item: producer }));
	};

	if (isLoading) {
		return <Typography>Loading...</Typography>;
	}

	return (
		<Box className="p-6">
			<Box className="flex justify-between items-center mb-6">
				<Typography variant="h4" className="font-bold">
					Producers
				</Typography>
				<Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
 
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Producers"
        inputProps={{ 'aria-label': 'search producers' }}
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
					Add Producer
				</Button>
			</Box>

			<TableContainer component={Paper} className="shadow-lg">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Date of Birth</TableCell>
							<TableCell>Gender</TableCell>
							<TableCell>Bio</TableCell>
							<TableCell>Movies</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredProducersData?.map((producer) => (
							<TableRow key={producer._id}>
								<TableCell>{producer.name}</TableCell>
								<TableCell>
									{producer.dob &&
										new Date(
											producer.dob
										).toLocaleDateString()}
								</TableCell>
								<TableCell>{producer.gender}</TableCell>
								<TableCell>
									{producer.bio && producer.bio.length > 100
										? `${producer.bio.substring(0, 100)}...`
										: producer.bio}
								</TableCell>
								<TableCell>
									<Box
										sx={{
											display: "flex",
											flexWrap: "wrap",
											gap: 0.5,
										}}>
										{producer.movies?.map((actor) => (
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
										onClick={() => handleOpen(producer)}>
										Edit
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<ProducerDialog />
		</Box>
	);
}
