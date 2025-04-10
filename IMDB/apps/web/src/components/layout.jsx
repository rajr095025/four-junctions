import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Outlet, Link } from "react-router";

export default function Layout() {
	return (
		<main className="flex h-screen">
			<List className="flex-[0.3]">
				<ListItem disablePadding>
					<ListItemButton component={Link} to="/producers">
						<ListItemText primary="Producers" />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton component={Link} to="/actors">
						<ListItemText primary="Actors" />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton component={Link} to="/movies">
						<ListItemText primary="Movies" />
					</ListItemButton>
				</ListItem>
			</List>
			<div className="grow p-4">
				<Outlet />
			</div>
		</main>
	);
}
