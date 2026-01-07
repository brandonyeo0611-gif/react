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
    useEffect(() => {
        const fetchProfile = async () => {
            const profile_url = await GetProfilePic(username);
            setProfileUrl(profile_url);
        };
        fetchProfile();
    }, [username]);
    console.log(profileUrl);
    if (!profileUrl) {
        return <Avatar></Avatar>;
    }
    return <Avatar src={profileUrl}></Avatar>;
};
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));
const PostPage: React.FC = () => {
    const navigate = useNavigate();
    const { postID } = useParams<{ postID: string }>();
    const post_id = postID;
    const token = localStorage.getItem("accesstoken");
    const handleLikePost = async (likeValue: number) => {
        // using an argument reduces the need to useState to control the state
        const response = await fetch("http://localhost:8000/posts", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, // sends json code
            body: JSON.stringify({ like_value: likeValue, post_id }), // stringify the username to send json code, match json backend model
        });
        const res = await response.json();
        if (res.errorCode == 0) {
            return;
        }
    };
    const [post, setPost] = useState<Post>();
    const [downColor, setDownColor] = useState(false);
    const [upColor, setUpColor] = useState(false);
    const [like, setLike] = useState(0);
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
        const getforums = async () => {
            const response = await fetch(`http://localhost:8000/posts/${postID}`); // get no need method cause fetch inherently already is get
            // fetch need
            const result = await response.json();
            setPost(result.payload.data);
            console.log(result.payload.data);
        };
        const getlike = async () => {
            const response = await fetch(`http://localhost:8000/like/${postID}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, // sends json code// stringify the username to send json code, match json backend model
            });
            const likeValue = await response.json();
            setLike(likeValue.payload.data);
            console.log(likeValue.payload.data);
        };
        getforums();
        getlike();
    }, [postID]);
    useEffect(() => {
        setUpColor(like === 1);
        setDownColor(like === -1); // save the effect of liking/disliking the post
    }, [like]);

    if (!post) return <div>Loading post...</div>;

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <AppBar position="fixed" sx={{ width: "100%" }}>
                <Container>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                navigate("/main");
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
                            <Typography variant="body1" mt={2} position="static" sx={{ marginLeft: 1 }}>
                                {post.username}
                            </Typography>
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
                            <Typography variant="body1">{post.content}</Typography>
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
};

export default PostPage;
