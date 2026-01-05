/* eslint-disable prettier/prettier */
import TechIcon from "../../../images/Technology.png";
import AutomotiveIcon from "../../../images/Automotive.png";
import GamesIcon from "../../../images/Games.png";
import MusicIcon from "../../../images/Music.png";
import CultureIcon from "../../../images/Culture.png";
import LifestyleIcon from "../../../images/Lifestyle.png";
import AllIcon from "../../../images/All.png";
import { Toolbar, Divider, List, ListItemButton, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import React from "react";

const drawerWidth = 240;
// learning to use map to reduce code
const categories = [
    { label: 'All', icon: AllIcon },
    { label: 'Technology', icon: TechIcon },
    { label: 'Games', icon: GamesIcon },
    { label: 'Lifestyle', icon: LifestyleIcon },
    { label: 'Music', icon: MusicIcon },
    { label: 'Automotive', icon: AutomotiveIcon },
    { label: 'Culture', icon: CultureIcon }
]

type DrawerLeftProps = {
    setCategory: (category: string) => void;
};

export default function DrawerLeft({setCategory}: DrawerLeftProps) {
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar>
            </Toolbar>
            <Divider />
            <List>
                {categories.map(({ label, icon }) => (
                    <ListItem key={label} disablePadding>
                        <ListItemButton onClick={() => setCategory(label)}>
                            <ListItemIcon>
                                <img src={icon} style={{ width: 32, height: 32 }} />
                            </ListItemIcon>
                            <ListItemText primary={label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}
