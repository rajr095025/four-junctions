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
	TextField,
	CircularProgress,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { useGetAllProducers } from "../../hooks/producers";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { openDialog } from "../../store/slices/dialogSlice";
import ProducerDialog from "../../components/dialogs/ProducerDialog";
import { useState } from "react";

export default function Producers() {
	const dispatch = useDispatch();
	const { data: producersData, isLoading } = useGetAllProducers();
	const [searchTerm, setSearchTerm] = useState("");

	const filteredProducersData = (producersData ?? []).filter((producer) =>
		producer.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleOpen = (producer = null) => {
		dispatch(openDialog({ type: "producers", item: producer }));
	};

	if (isLoading) {
		return (
			<div className="h-full w-2/3 flex items-center justify-center">
				<CircularProgress size={20} />
			</div>
		);
	}

	return (
		<Box className="p-6">
			<Box className="flex justify-between items-center mb-6 w-full">
				<Typography variant="h4" className="font-bold">
					Producers
				</Typography>
				<TextField
					placeholder="Search Producers"
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
						{filteredProducersData.map((producer) => (
							<TableRow key={producer._id}>
								<TableCell>{producer.name}</TableCell>
								<TableCell>
									{producer.dob &&
										new Date(
											producer.dob
										).toLocaleDateString()}
								</TableCell>
								<TableCell>{producer.gender}</TableCell>
								<TableCell title={producer.bio}>
									{producer.bio && producer.bio.length > 100
										? `${producer.bio.substring(0, 100)}...`
										: producer.bio}
								</TableCell>
								<TableCell>
									<Box className="flex flex-wrap gap-2">
										{producer?.movies.map((actor) => (
											<Chip
												key={actor._id}
												label={actor.name}
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
