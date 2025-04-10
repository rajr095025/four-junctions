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

const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			onError: (error) => {
				enqueueSnackbar(error.message, {
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
					<SnackbarProvider>
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
