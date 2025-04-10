import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { useForm,Controller  } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddActor, useUpdateActor } from "../../hooks/actors";
import { closeDialog } from "../../store/slices/dialogSlice";

const schema = yup.object().shape({
	name: yup.string().required("Name is required"),
	dob: yup.date().required("Date of birth is required"),
	gender: yup.string().required("Gender is required"),
	bio: yup.string().required("Biography is required"),
});

const formatLocalDate = (isoDate) => {
	const date = new Date(isoDate);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

export default function ActorDialog() {
	const dispatch = useDispatch();
	const { open, selectedItem } = useSelector((state) => state.dialog.actors);
	const addActor = useAddActor();
	const updateActor = useUpdateActor(selectedItem?._id);

	
	const {
		register,
		handleSubmit,
		reset,control,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			name: "",
			dob: "",
			gender: "",
			bio: "",
		},
	});



	useEffect(() => {
		if (selectedItem) {
			const formattedItem = {
				...selectedItem,
				dob: selectedItem.dob
					? selectedItem.dob ? formatLocalDate(selectedItem.dob) : ""
					: "",
				gender: selectedItem.gender?.toLowerCase() || "",
			};

			reset(formattedItem);
		} else {
			reset({
				name: "",
				dob: "",
				gender: "",
				bio: "",
			});
		}
	}, [selectedItem, reset]);

	const handleClose = () => {
		reset();
		dispatch(closeDialog({ type: "actors" }));
	};

	const onSubmit = async (data) => {
		if (selectedItem) {
			await updateActor.mutateAsync(data);
		} else {
			await addActor.mutateAsync(data);
		}
		handleClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				{selectedItem ? "Edit Actor" : "Add New Actor"}
			</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<Box className="space-y-4">
						<TextField
							fullWidth
							label="Name"
							{...register("name")}
							error={!!errors.name}
							helperText={errors.name?.message}
						/>
						<TextField
							fullWidth
							label="Date of Birth"
							type="date"
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
							{...register("dob")}
							error={!!errors.dob}
							helperText={errors.dob?.message}
						/>
						<FormControl fullWidth error={!!errors.gender}>
							<InputLabel id="gender-label">Gender</InputLabel>
							<Controller
								name="gender"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<Select
										labelId="gender-label"
										label="Gender"
										{...field}
									>
										<MenuItem value="male">Male</MenuItem>
										<MenuItem value="female">Female</MenuItem>
										<MenuItem value="other">Other</MenuItem>
									</Select>
								)}
							/>
							{errors.gender && (
								<Box className="text-red-500 text-sm mt-1">
									{errors.gender.message}
								</Box>
							)}
						</FormControl>
						<TextField
							fullWidth
							label="Biography"
							multiline
							rows={4}
							{...register("bio")}
							error={!!errors.bio}
							helperText={errors.bio?.message}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={addActor.isPending || updateActor.isPending}>
						{selectedItem ? "Update" : "Add"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
