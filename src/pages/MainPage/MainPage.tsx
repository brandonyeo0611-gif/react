/* eslint-disable prettier/prettier */

import BasicStack from "./components/Forums";
import DrawerLeft from "./components/DrawerLeft";
import CreatePost from "./components/CreatePost";
import PrimarySearchAppBar from "./components/SearchBar";
import React, { useState } from "react";
import Box from "@mui/material/Box";

type MainPageProps = {
  username: string;
};
// learning to use map to reduce code

const MainPage: React.FC<MainPageProps> = ({ username }) => {
    const [category, setCategory] = useState("Technology");
    return (
        <Box sx ={{display: "flex" }}>
            <CreatePost username={username}></CreatePost>
            <DrawerLeft setCategory={setCategory}>

            </DrawerLeft>
            <Box sx={{ flexGrow: 1 }}>

            <PrimarySearchAppBar>
                
            </PrimarySearchAppBar>
            <Box sx={{ p: 2 }}>
            <BasicStack category={category}></BasicStack>
            </Box>
            </Box>
            </Box>
        

    );
};

export default MainPage;
