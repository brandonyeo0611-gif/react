import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { Typography, Divider, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
// need to set the type first so can use in declaring what typ eis the array

type ForumsProps = {
    category: string;
};
export default function BasicStack({ category }: ForumsProps) {
    const [relevance, setRelevance] = useState("mostRecent");
    const handleChange = (event: SelectChangeEvent) => {
        setRelevance(event.target.value as string);
    };
    const navigate = useNavigate();
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
        const response = await fetch(
            `https://brandonwebforumgobackend.onrender.com/posts?category=${category}&relevance=${relevance}`,
        ); // get no need method cause fetch inherently already is get
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
    }, [category, relevance]);
    return (
        <Box sx={{ width: "flex", maxHeight: "" }}>
            <Box alignItems="left" sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start" }}>
                <FormControl
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "10px",
                        }, // make it a little rounder
                        width: "20vw",
                        maxWidth: "150px",
                        mb: 2,
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
            <Box sx={{ width: "flex" }}>
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
    );
}
