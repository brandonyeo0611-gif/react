/* eslint-disable prettier/prettier */

import { RefreshAccessToken } from "../../components/RenewAccessToken";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Divider, FormControl, InputLabel, MenuItem, Select, AppBar, Container, IconButton, Toolbar } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import type { SelectChangeEvent } from "@mui/material";
type Post = {
    post_id: string;
    user_id: number;
    username: string;
    content: string;
    created_at: string;
    content_type: string;
    title: string;
    likes: number;
};

// learning to use map to reduce code

const HistoryPage: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    console.log(username)
    const [relevance, setRelevance] = useState("mostRecent");
    const handleChange = (event: SelectChangeEvent) => {
        setRelevance(event.target.value as string);
    };
    console.log(username)
    const navigate = useNavigate()
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
            if (AccessToken === 401 || AccessToken === 402) {
                navigate("/");
                return;
            }
            localStorage.setItem("accesstoken", AccessToken);
        };
        refresh();
    }, []);
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    }));
    const [posts, setPosts] = useState<Post[]>([]);
    const [retry, setRetry] = useState(0);
    useEffect(() => {
        try {
            getforums();
        } catch (err) {
            if (retry < 10) {
                setRetry((prev) => prev + 1);
            } else navigate("/main");
        }

        getforums();
    }, [retry]);
    const getforums = async () => {
        const response = await fetch(`http://localhost:8000/history/${username}?relevance=${relevance}`); // get no need method cause fetch inherently already is get
        // fetch need
        const result = await response.json();
        setPosts(result.payload.data || []);
        console.log(result.payload.data);
    };
    const handleClick = (postID: string) => {
        navigate(`/thread/${postID}`);
    };
    useEffect(() => {
        setRetry(0);
        getforums();
    }, [relevance]);
    if (posts) {
        return (
            <Box sx={{ display: "flex" }}>
                <Box sx={{ flexGrow: 1 }}>

                    <AppBar position="fixed" sx={{ width: "100%" }}>
                        <Container>
                            <Toolbar>
                                <IconButton
                                    color="inherit"
                                    onClick={() => {
                                        navigate(-1);
                                    }}
                                    sx={{ ml: -3 }}
                                >
                                    <ArrowBackIosIcon></ArrowBackIosIcon>
                                </IconButton>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        position: "absolute",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                    }}
                                // make it in the middle
                                >
                                    yap
                                </Typography>
                            </Toolbar>
                        </Container>
                    </AppBar>
                    <Box sx={{ mx: "auto", width: "80%" }}>
                        <Toolbar></Toolbar>
                        <Typography variant="h4" sx={{ mb: 1, mt: 2 }}>{username}{`'`}s history</Typography>
                        <Box alignItems="left" sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start" }}>
                            <FormControl
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "10px",
                                    }, // make it a little rounder
                                    width: "20vw",
                                    maxWidth: "150px",
                                    mb: 2,
                                    mt: 2,
                                }}
                            >
                                <InputLabel id="demo-simple-select-label">Relevance</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={relevance}
                                    label="Relevance"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"mostRecent"}>Most Recent</MenuItem>
                                    <MenuItem value={"leastRecent"}>Least Recent</MenuItem>
                                    <MenuItem value={"mostLikes"}>Most likes</MenuItem>
                                    <MenuItem value={"leastLikes"}>Least likes</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Stack useFlexGap spacing={3}>
                            {posts.map((post) => (
                                <Item key={post.post_id} onClick={() => handleClick(post.post_id)}>
                                    <Typography variant="h6">{post.title}</Typography>
                                    <Divider sx={{ my: 0.2 }} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            WebkitLineClamp: 3,
                                            // if want to overflow and ... there is more then 1 line.. cause noWrap only gives one line
                                        }}
                                    >
                                        {post.content}
                                    </Typography>
                                    <Divider sx={{ my: 0.2 }} />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            borderRadius: 2,
                                            bgcolor: "background.paper",
                                            color: "text.secondary",
                                            "& svg": {
                                                m: 1,
                                            },
                                        }}
                                    >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" sx={{ p: 1 }}>
                                                Author : {post.username}
                                            </Typography>
                                        </Box>
                                        <Divider orientation="vertical" variant="middle" flexItem />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" sx={{ p: 1 }}>
                                                Tag : {post.content_type}
                                            </Typography>
                                        </Box>
                                        <Divider orientation="vertical" variant="middle" flexItem />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle2" sx={{ p: 1 }}>
                                                Likes: {post.likes}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Item>
                            ))}
                        </Stack>
                    </Box>
                </Box>
            </Box>


        );
    }

};

export default HistoryPage;
