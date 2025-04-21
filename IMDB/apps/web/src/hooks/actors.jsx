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
		mutationFn: (data) => axios.post("/actors", data),
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

export function useGetFullActorDetails(actorId) {
	return useQuery({
		queryKey: ["actors", actorId],
		queryFn: () =>
			axios.get(`https://api.themoviedb.org/3/person/${actorId}`, {
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
				},
			}),
		select: (responseData) => responseData.data,
		enabled: !!actorId,
	});
}

export function useGetFullActorMovies(actorId) {
	return useQuery({
		queryKey: ["movie_credits", actorId],
		queryFn: () =>
			axios.get(
				`https://api.themoviedb.org/3/person/${actorId}/movie_credits`,
				{
					headers: {
						Authorization: `Bearer ${
							import.meta.env.VITE_TMDB_TOKEN
						}`,
					},
				}
			),
		select: (responseData) => responseData.data,
		enabled: !!actorId,
	});
}

export function useGetPopularActors() {
	return useQuery({
		queryKey: ["actors", "tmdb", "popular"],
		queryFn: () =>
			axios.get(`https://api.themoviedb.org/3/discover/person`, {
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
				},
			}),
		select: (responseData) => responseData.data.results,
	});
}

export function useGetActorSuggestions(query = "") {
	return useQuery({
		queryKey: ["actors", "tmdb", "suggestions", query],
		queryFn: () =>
			axios.get(
				`https://api.themoviedb.org/3/search/person?query=${query}`,
				{
					headers: {
						Authorization: `Bearer ${
							import.meta.env.VITE_TMDB_TOKEN
						}`,
					},
					params: {
						query,
					},
				}
			),
		select: (responseData) => responseData.data.results,
	});
}
