import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSnackbar } from "notistack";

export function useGetAllActors() {
	return useQuery({
		queryKey: ["actors"],
		queryFn: () => axios.get("/actors"),
		select: (responseData) => responseData.data.data,
	});
}

export function useAddActor() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: (data) =>
			axios.postForm("/actors", data, {
				formSerializer: {
					dots: true,
				},
			}),
		onSuccess: () => {
			enqueueSnackbar("Actor added successfully", {
				variant: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["actors"] });
		},
	});
}

export function useUpdateActor(id) {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: (data) => axios.put(`/actors/${id}`, data),
		onSuccess: () => {
			enqueueSnackbar("Actor updated successfully", {
				variant: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["actors"] });
		},
	});
}
