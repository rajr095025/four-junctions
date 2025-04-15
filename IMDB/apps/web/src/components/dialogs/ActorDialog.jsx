import { useEffect, useState } from "react";
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
	CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
	useAddActor,
	useGetActorSuggestions,
	useUpdateActor,
} from "../../hooks/actors";
import { closeDialog } from "../../store/slices/dialogSlice";

const schema = yup.object().shape({
	name: yup.mixed().required("Name is required"),
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
	const { mutateAsync: addActor, isPending: addActorPending } = useAddActor();
	const { mutateAsync: updateActor, isPending: updateActorPending } =
		useUpdateActor(selectedItem?._id);
	const [suggestionsSearch, setSuggestionsSearch] = useState("");
	const { data: actorSuggestions } =
		useGetActorSuggestions(suggestionsSearch);
	const {
		register,
		handleSubmit,
		reset,
		control,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			name: null,
			dob: "",
			gender: "",
			bio: "",
		},
	});
	const isPending = addActorPending || updateActorPending;

	useEffect(() => {
		if (selectedItem) {
			const formattedItem = {
				...selectedItem,
				dob: selectedItem.dob
					? selectedItem.dob
						? formatLocalDate(selectedItem.dob)
						: ""
					: "",
				gender: selectedItem?.gender?.toLowerCase() ?? "",
			};
			reset(formattedItem);
		}
	}, [selectedItem, reset]);

	const handleClose = () => {
		if (isPending === false) {
			reset();
			dispatch(closeDialog({ type: "actors" }));
			setSuggestionsSearch("");
		}
	};

	const onActorSuggestionSelect = (actor) => () => {
		setValue("name", actor.name);
		if (actor.gender > 0) {
			switch (actor.gender) {
				case 1:
					setValue("gender", "female");
					break;
				case 2:
					setValue("gender", "male");
					break;
				case 3:
					setValue("gender", "other");
					break;
				default:
					break;
			}
		}
		setSuggestionsSearch("");
	};

	const onSubmit = async (data) => {
		const postData = { ...data, name: data.name.name };
		if (selectedItem) {
			await updateActor(postData);
		} else {
			await addActor(postData);
		}
		dispatch(closeDialog({ type: "actors" }));
		reset();
		setSuggestionsSearch("");
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
							{...register("name", {
								onChange: (e) =>
									setSuggestionsSearch(e.target.value),
							})}
							autoComplete="off"
							error={!!errors.name}
							helperText={errors.name?.message}
						/>
						{(actorSuggestions ?? []).length > 0 && (
							<ul className="absolute z-10 border rounded bg-white mt-1 shadow-lg max-h-60 overflow-auto">
								{actorSuggestions.map((actor) => (
									<li
										key={actor.id}
										className="p-2 hover:bg-gray-100 cursor-pointer"
										onClick={onActorSuggestionSelect(
											actor
										)}>
										{actor.name}
									</li>
								))}
							</ul>
						)}
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
										{...field}>
										<MenuItem value="male">Male</MenuItem>
										<MenuItem value="female">
											Female
										</MenuItem>
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
					<Button disabled={isPending} onClick={handleClose}>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={isPending}
						startIcon={
							isPending ? <CircularProgress size={15} /> : null
						}>
						{selectedItem ? "Update" : "Add"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
