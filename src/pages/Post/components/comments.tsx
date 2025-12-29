import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";
import { Typography, Avatar } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

type BasicStackProps = {
    postID: string | undefined;
};

type Comment = {
    comment_id: string;
    post_id: string;
    user_id: number;
    content: string;
    created_at: string;
};

export default function BasicStack({ postID }: BasicStackProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [comments, setComments] = React.useState<Comment[]>([]);
    const getComments = async () => {
        const response = await fetch(`http://localhost:8000/comments?post=${postID}`); // get no need method cause fetch inherently already is get
        // fetch need
        const result = await response.json();
        setComments(result.payload.data || []);
        console.log(result.payload.data);
    };

    useEffect(() => {
        getComments();
    }, [postID]);
    return (
        <Box sx={{ width: "100%" }}>
            <Stack spacing={2}>
                {comments.map((c) => (
                    <Item key={c.comment_id}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "flex" }}>
                                <Avatar></Avatar>
                                <Typography sx={{ mt: 1, ml: 2 }}>{c.user_id}</Typography>
                            </Box>
                            <Box sx={{ display: "flex" }}>
                                <Typography sx={{ mt: 1, ml: 2, wordWrap: "break-word", wordBreak: "break-word" }}>
                                    {c.content}
                                </Typography>
                            </Box>
                        </Box>
                    </Item>
                ))}
                <Item>content</Item>
                <Item>Item 3</Item>
            </Stack>
        </Box>
    );
}
