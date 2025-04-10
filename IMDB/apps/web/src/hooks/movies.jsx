import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSnackbar } from "notistack";

export function useGetAllMovies() {
	return useQuery({
		queryKey: ["movies"],
		queryFn: () => axios.get("/movies"),
		select: (responseData) => responseData.data.data,
	});
}

export function useAddMovie() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: (data) =>
			axios.postForm("/movies", data, {
				formSerializer: {
					dots: true,
				},
			}),
		onSuccess: () => {
			enqueueSnackbar("Movie added successfully", {
				variant: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["movies"] });
		},
	});
}

export function useUpdateMovie(id) {
	const queryClient = useQueryClient();
	
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: (data) =>
			axios.putForm(`/movies/${id}`, data, {
				formSerializer: {
					dots: true,
				},
			}),
		onSuccess: () => {
			enqueueSnackbar("Movie updated successfully", {
				variant: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["movies"] });
		},
	});
}
