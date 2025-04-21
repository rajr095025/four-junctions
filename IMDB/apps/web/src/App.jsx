import { StyledEngineProvider } from "@mui/material/styles";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Layout from "./components/layout";
import Movies from "./pages/movies";
import Actors from "./pages/actors";
import Producers from "./pages/producers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { AxiosError } from "axios";
import MoviesWatchList from "./pages/movies/MovieWatchList";

const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			onError: (error) => {
				const statusCode = error?.status;
				let errorMessage = error?.message;

				if (statusCode >= 500 && statusCode < 600) {
					errorMessage = "Something went wrong!";
				} else {
					if (error instanceof AxiosError && error?.isAxiosError) {
						errorMessage =
							error?.response?.data?.message ?? error.message;
					}
				}
				enqueueSnackbar(errorMessage, {
					variant: "error",
				});
			},
		},
	},
});

function App() {
	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<StyledEngineProvider injectFirst>
					<SnackbarProvider
						maxSnack={3}
						autoHideDuration={8_000}
						anchorOrigin={{
							vertical: "top",
							horizontal: "right",
						}}>
						<BrowserRouter>
							<Routes>
								<Route
									index
									element={<Navigate to="movies" />}
								/>
								<Route element={<Layout />}>
									<Route path="movies" element={<Movies />} />
									<Route path="actors" element={<Actors />} />
									<Route
										path="producers"
										element={<Producers />}
									/>
									<Route
										path="watchlist"
										element={<MoviesWatchList />}
									/>
								</Route>
							</Routes>
						</BrowserRouter>
					</SnackbarProvider>
				</StyledEngineProvider>
			</QueryClientProvider>
		</Provider>
	);
}

export default App;
