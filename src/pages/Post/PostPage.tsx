import BasicStack from "./components/comments";
import CreateComment from "./components/CreateComment";
import TechIcon from "../../images/Technology.png";
import GamesIcon from "../../images/Games.png";
import MusicIcon from "../../images/Music.png";
import CultureIcon from "../../images/Culture.png";
import LifestyleIcon from "../../images/Lifestyle.png";
import AutomotiveIcon from "../../images/Automotive.png";
import { RefreshAccessToken } from "../../components/RenewAccessToken";
import { GetProfilePic } from "../../components/GetProfilePic";
import {
    Container,
    Divider,
    ButtonGroup,
    Icon,
    Avatar,
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Button,
    Link,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";

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

const renderSwitch = (param: string) => {
    switch (param) {
        case "Technology":
            return TechIcon;
        case "Music":
            return MusicIcon;
        case "Games":
            return GamesIcon;
        case "Lifestyle":
            return LifestyleIcon;
        case "Automotive":
            return AutomotiveIcon;
        case "Culture":
            return CultureIcon;
    }
};
const Avatars: React.FC<{ username: string }> = ({ username }) => {
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const [retry, setRetry] = useState(0);
    const [fail, setFail] = useState(false);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile_url = await GetProfilePic(username);
                if (typeof profile_url !== "string") {
                    throw new Error();
                }

                if (typeof profile_url === "string") {
                    setProfileUrl(profile_url);
                }
            } catch (err) {
                if (retry < 5) {
                    setRetry((prev) => prev + 1);
                } else {
                    setFail(true);
                }
            }
        };
        fetchProfile();
    }, [username, retry]);

    if (fail) {
        return <Avatar></Avatar>;
    }
    if (profileUrl) {
        return <Avatar src={profileUrl}></Avatar>;
    }
};
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));
const PostPage: React.FC = () => {
    const [post, setPost] = useState<Post>();
    const [downColor, setDownColor] = useState(false);
    const [upColor, setUpColor] = useState(false);
    const [like, setLike] = useState(null);
    const [refreshRetry, setRefreshRetry] = useState(0);
    const [fetchedLike, setFetchedLike] = useState(false);
    const [fail, setFail] = useState(false);
    const navigate = useNavigate();
    const { postID } = useParams<{ postID: string }>();
    const post_id = postID;
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const refresh = async () => {
            try {
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
                setToken(AccessToken);
                if (!post) {
                    const postResponse = await fetch(`https://brandonwebforumgobackend.onrender.com/posts/${postID}`);
                    const postData = await postResponse.json();
                    if (postData.errorCode != 0) {
                        throw new Error();
                    }
                    setPost(postData.payload.data);
                }
                if (!fetchedLike) {
                    const likeResponse = await fetch(`https://brandonwebforumgobackend.onrender.com/like/${postID}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${AccessToken}` }, // sends json code// stringify the username to send json code, match json backend model
                    });
                    const likeValue = await likeResponse.json();
                    if (likeValue.errorCode != 0) {
                        throw new Error();
                    }
                    setLike(likeValue.payload.data);

                    console.log(likeValue.payload.data);
                    setFetchedLike(true);
                }
            } catch (err) {
                if (refreshRetry < 60) {
                    setTimeout(() => setRefreshRetry((prev) => prev + 1), 300);
                } else {
                    setFail(true);
                }
            }
        };

        refresh();
    }, [refreshRetry, postID]);
    const handleLikePost = async (likeValue: number) => {
        // using an argument reduces the need to useState to control the state
        const response = await fetch("https://brandonwebforumgobackend.onrender.com/posts", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, // sends json code
            body: JSON.stringify({ like_value: likeValue, post_id }), // stringify the username to send json code, match json backend model
        });
        if (response.status === 401) {
            // unauthorized → navigate home
            navigate("/");
            return;
        }
        const res = await response.json();
        if (res.errorCode == 0) {
            return;
        }
        if (res.error == "Invalid token") {
            navigate("/");
            return;
        }
    };
    const changeDownvote = () => {
        const vote = downColor ? 0 : -1;
        setDownColor((prev) => !prev);
        if (upColor) {
            setUpColor(false);
        }
        handleLikePost(vote);
    };
    const changeUpvote = () => {
        const vote = upColor ? 0 : 1; // when used AI to check code this code is prefered to having if statement to handle the like post function as the code may not be updated fast enough
        setUpColor((prev) => !prev);
        if (downColor) {
            setDownColor(false);
        }
        handleLikePost(vote);
    };
    useEffect(() => {
        setUpColor(like === 1);
        setDownColor(like === -1); // save the effect of liking/disliking the post
    }, [like]);
    if (fail) {
        return (
            <Typography
                variant="h3"
                sx={{
                    display: "flex",
                    justifyContent: "center", // horizontal center
                    alignItems: "center", // vertical center
                    height: "100vh", // full viewport height
                    width: "100%",
                }}
            >
                Failed to fetch post...
            </Typography>
        );
    }
    if (post && fetchedLike) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                <Toolbar />
                <Box sx={{ mx: "auto", width: "80%" }}>
                    <Stack useFlexGap>
                        <Item>
                            <Box sx={{ display: "flex", marginBottom: 2 }}>
                                <Avatars username={post.username}></Avatars>
                                <Link
                                    onClick={() => {
                                        navigate(`/history/${post.username}`);
                                    }}
                                    variant="body1"
                                    mt={2}
                                    position="static"
                                    sx={{ marginLeft: 1, cursor: "pointer" }}
                                    underline="none"
                                    color="inherit"
                                >
                                    {post.username}
                                </Link>
                            </Box>
                            <Box sx={{ display: "flex", marginBottom: 1 }}>
                                <Typography sx={{ display: "flex" }} variant="subtitle1" fontWeight="bold">
                                    {post.title}
                                </Typography>
                                <Icon sx={{ marginLeft: 1 }}>
                                    <img src={renderSwitch(post.content_type)} alt={post.content_type} width={32} />
                                </Icon>
                            </Box>
                            <Box sx={{ display: "flex" }}>
                                <Typography align="left" variant="body1" sx={{ mr: "-" }}>
                                    {post.content}
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex" }}>
                                <IconButton disableRipple>
                                    <ButtonGroup>
                                        <Button
                                            type="button"
                                            onClick={changeUpvote}
                                            sx={{ color: upColor ? "success.main" : "action.disabled" }}
                                        >
                                            <ThumbUpIcon></ThumbUpIcon>
                                        </Button>
                                        <Button type="button" onClick={changeDownvote}>
                                            <ThumbDownAltIcon
                                                sx={{ color: downColor ? "red" : "action.disabled" }}
                                            ></ThumbDownAltIcon>
                                        </Button>
                                    </ButtonGroup>
                                </IconButton>
                                <Box sx={{ mt: 0.8, ml: 1, backgroundColor: "" }}>
                                    <CreateComment post_id={postID}></CreateComment>
                                </Box>
                            </Box>
                        </Item>
                        <Divider sx={{ mb: 3 }}></Divider>
                        <BasicStack postID={postID}></BasicStack>
                    </Stack>
                </Box>
            </Box>
        );
    }
    return (
        <Typography
            variant="h3"
            sx={{
                display: "flex",
                justifyContent: "center", // horizontal center
                alignItems: "center", // vertical center
                height: "100vh", // full viewport height
                width: "100%",
            }}
        >
            Loading post...
        </Typography>
    );
};

export default PostPage;
