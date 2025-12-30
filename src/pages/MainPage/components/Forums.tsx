import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { Typography, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
    }));
    const [posts, setPosts] = useState<Post[]>([]);

    const getforums = async () => {
        const response = await fetch(`http://localhost:8000/posts?category=${category}`); // get no need method cause fetch inherently already is get
        // fetch need
        const result = await response.json();
        setPosts(result.payload.data || []);
        console.log(result.payload.data);
    };
    const handleClick = (postID: string) => {
        navigate(`/thread/${postID}`);
    };

    useEffect(() => {
        getforums();
    }, [category]);
    return (
        <Box sx={{ width: "flex", maxHeight: "" }}>
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
    );
}
