import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSnackbar } from "notistack";

export function useGetAllProducers() {
	return useQuery({
		queryKey: ["producers"],
		queryFn: () => axios.get("/producers"),
		select: (responseData) => responseData.data.data,
	});
}

export function useAddProducers() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: (data) => axios.post("/producers", data),
		onSuccess: () => {
			enqueueSnackbar("Producer added successfully", {
				variant: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["producers"] });
		},
	});
}

export function useUpdateProducers(id) {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: (data) => axios.put(`/producers/${id}`, data),
		onSuccess: () => {
			enqueueSnackbar("Producer updated successfully", {
				variant: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["producers"] });
		},
	});
}
