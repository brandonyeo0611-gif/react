/* eslint-disable prettier/prettier */

import DrawerLeft from "../../components/DrawerLeft";
import CreatePost from "../../components/CreatePost";
import BasicStack from "../../components/Forums";
import PrimarySearchAppBar from "../../components/SearchBar";
import { RefreshAccessToken } from "../../components/RenewAccessToken";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
type MainPageProps = {
    username: string;
};
// learning to use map to reduce code

const MainPage: React.FC<MainPageProps> = ({ username }) => {
    console.log(username)
    const navigate = useNavigate()
    const [category, setCategory] = useState("Technology");
    const refreshToken = localStorage.getItem("refreshtoken")
    if (refreshToken) {
        const accessToken = RefreshAccessToken(refreshToken)
        console.log(accessToken)
    }
    useEffect(() => {
        const refresh = async () => {
            const refreshToken = localStorage.getItem("refreshtoken");
            if (!refreshToken) {
                navigate("/"); // redirect if no refresh token
                return;
            }
            const AccessToken = await RefreshAccessToken(refreshToken);
            localStorage.setItem("accesstoken", AccessToken);
        };
        refresh();
    }, []);
    return (
        <Box sx={{ display: "flex" }}>
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
