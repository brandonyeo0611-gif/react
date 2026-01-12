import { GetProfilePic } from "../../../components/GetProfilePic";
import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Typography, Avatar, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
    username: string;
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
export default function BasicStack({ postID }: BasicStackProps) {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [comments, setComments] = React.useState<Comment[]>([]);
    const getComments = async (x = 1) => {
        try {
            const response = await fetch(`http://localhost:8000/comments?post=${postID}`); // get no need method cause fetch inherently already is get
            // fetch need
            const result = await response.json();
            if (result.errorCode != 0) {
                throw new Error();
            }
            setComments(result.payload.data || []);
            console.log(result.payload.data);
        } catch (err) {
            if (x < 10) {
                x += 1;
                setTimeout(() => getComments(), 1000);
            }
        }
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
                                <Avatars username={c.username}></Avatars>
                                <Link
                                    onClick={() => {
                                        navigate(`/history/${c.username}`);
                                    }}
                                    variant="body1"
                                    mt={2}
                                    position="static"
                                    sx={{ marginLeft: 1, cursor: "pointer" }}
                                    underline="none"
                                    color="inherit"
                                >
                                    {c.username}
                                </Link>
                            </Box>
                            <Box sx={{ display: "flex" }}>
                                <Typography
                                    align="left"
                                    sx={{ mt: 1, ml: 2, wordWrap: "break-word", wordBreak: "break-word" }}
                                >
                                    {c.content}
                                </Typography>
                            </Box>
                        </Box>
                    </Item>
                ))}
            </Stack>
        </Box>
    );
}
