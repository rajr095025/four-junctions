import {
	useMutation,
	useQuery,
	useQueries,
	useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useSnackbar } from "notistack";

export function useGetAllMovies() {
	return useQuery({
		queryKey: ["movies"],
		queryFn: () => axios.get("/movies"),
		select: (responseData) => responseData.data.data,
	});
}

export function useGetAllWatchListMovies() {
	return useQuery({
		queryKey: ["moviesWatchList"],
		queryFn: () => axios.get("/movies/watch-list"),
		select: (responseData) => responseData.data.data,
	});
}

export function useGetMoviesByIds(ids = []) {
	return useQueries({
		queries: ids.map((id) => ({
			queryKey: ["movie", "tmdb", id],
			queryFn: async () => {
				const response = await axios.get(
					`https://api.themoviedb.org/3/movie/${id}`,
					{
						headers: {
							Authorization: `Bearer ${
								import.meta.env.VITE_TMDB_TOKEN
							}`,
						},
					}
				);
				return response.data;
			},
		})),
	});
}

export function useAddMovie() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: (data) => axios.post("/movies", data),
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
		mutationFn: (data) => axios.put(`/movies/${id}`, data),
		onSuccess: () => {
			enqueueSnackbar("Movie updated successfully", {
				variant: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["movies"] });
		},
	});
}

export function useAddWatchListMovie() {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: (data) => axios.post("/movies/watch-list", data),
		onSuccess: () => {
			enqueueSnackbar("Movie added to watch list successfully", {
				variant: "success",
			});
			queryClient.invalidateQueries({ queryKey: ["moviesWatchList"] });
		},
	});
}

export function useGetFullMovieDetails(movieId) {
	return useQuery({
		queryKey: ["movies", movieId],
		queryFn: () =>
			axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
				},
			}),
		select: (responseData) => responseData.data,
		enabled: !!movieId,
	});
}

export function useGetMovieVideoLinks(movieId) {
	return useQuery({
		queryKey: ["movies", "video", movieId],
		queryFn: () =>
			axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
				},
			}),
		select: (responseData) => responseData.data,
		enabled: !!movieId,
	});
}

export function useGetMovieCredits(movieId) {
	return useQuery({
		queryKey: ["movies", "credits", movieId],
		queryFn: () =>
			axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
				},
			}),
		select: (responseData) => responseData.data,
		enabled: !!movieId,
	});
}

export function useGetPopularMovies(query = "") {
	return useQuery({
		queryKey: ["movies", "tmdb", query],
		queryFn: () =>
			axios.get(`https://api.themoviedb.org/3/discover/movie`, {
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
				},
				params: {
					query,
				},
			}),
		select: (responseData) => responseData.data.results,
	});
}

export function useGetMovieSuggestions(query = "") {
	return useQuery({
		queryKey: ["movies", "tmdb", "suggestions", query],
		queryFn: () =>
			axios.get(`https://api.themoviedb.org/3/search/movie`, {
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
				},
				params: {
					query,
				},
			}),
		select: (responseData) => responseData.data.results,
	});
}
