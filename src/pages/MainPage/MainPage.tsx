/* eslint-disable prettier/prettier */

import BasicStack from "./Forums";
import DrawerLeft from "./DrawerLeft";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Typography, AppBar, Toolbar  } from "@mui/material";


// learning to use map to reduce code

const MainPage: React.FC = () => {
    const [category, setCategory] = useState("Technology");
    return (
        <Box sx ={{display: "flex" }}>
            <DrawerLeft setCategory={setCategory}>

            </DrawerLeft>

            <Box sx={{ flexGrow: 1 }}>
    
            <AppBar position='static'>
                <Toolbar>
                    <Typography variant="h6" align='center' component="div" sx={{ flexGrow: 1 }}>
                        yap
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 2 }}>
            <BasicStack category={category}></BasicStack>
            </Box>
            </Box>
            </Box>

    );
};

export default MainPage;
