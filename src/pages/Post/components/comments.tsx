import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";

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

export default function BasicStack({ postID }: BasicStackProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [comments, setComments] = React.useState<Comment[]>([]);
    const getforums = async () => {
        const response = await fetch(`http://localhost:8000/comments?post=${postID}`); // get no need method cause fetch inherently already is get
        // fetch need
        const result = await response.json();
        setComments(result.payload.data || []);
        console.log(result.payload.data);
    };

    useEffect(() => {
        getforums();
    }, [postID]);
    return (
        <Box sx={{ width: "100%" }}>
            <Stack spacing={2}>
                <Item></Item>
                <Item>Item 2</Item>
                <Item>Item 3</Item>
            </Stack>
        </Box>
    );
}
