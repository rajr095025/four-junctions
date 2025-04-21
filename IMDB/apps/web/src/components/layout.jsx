import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Outlet, Link } from "react-router";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import LocalMoviesIcon from "@mui/icons-material/LocalMovies";
import PeopleIcon from "@mui/icons-material/People";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import ListItemIcon from "@mui/material/ListItemIcon";
import MailIcon from "@mui/icons-material/Mail";
import CardMedia from "@mui/material/CardMedia";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";


const drawerWidth = 240;

let sideNavBar = [
	{ name: "Movies", toLink: "/movies", icon: <LocalMoviesIcon /> },
	{ name: "Actors", toLink: "/actors", icon: <PeopleIcon /> },
	{ name: "Producers", toLink: "/producers", icon: <VideoCameraFrontIcon /> },
	{ name: "Watch List", toLink: "/watchlist", icon: <LoyaltyIcon /> },
];

export default function ResponsiveDrawer(props) {
	const { window } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [isClosing, setIsClosing] = React.useState(false);

	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};

	const handleDrawerTransitionEnd = () => {
		setIsClosing(false);
	};

	const handleDrawerToggle = () => {
		if (!isClosing) {
			setMobileOpen(!mobileOpen);
		}
	};

	const drawer = (
		<div>
			<Box className="bg-yellow-400 p-2 m-2 flex justify-center">
				<CardMedia
					component="img"
					alt="green iguana"
					height="30"
					image="/logo.png"
					className="w-36 h-12 "
				/>
			</Box>
			<Divider />
			<List>
				{sideNavBar.map((item, index) => (
					<ListItem key={item.name} disablePadding>
						<ListItemButton component={Link} to={item.toLink}>
							<ListItemIcon>
								{item.icon}
							</ListItemIcon>
							<ListItemText primary={item.name} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</div>
	);

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onTransitionEnd={handleDrawerTransitionEnd}
					onClose={handleDrawerClose}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
					slotProps={{
						root: {
							keepMounted: true,
						},
					}}>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", sm: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
					open>
					{drawer}
				</Drawer>
			</Box>
			<Box>
				<div className="grow p-4 min-w-[70vw]">
					<Outlet />
				</div>
			</Box>
		</Box>
	);
}
