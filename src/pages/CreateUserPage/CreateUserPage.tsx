import React, { useEffect, useState } from "react";
import { TextField, Button, Box, Card, CardContent, Link, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const CreateUserPage: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const handleSubmit = async () => {
        const response = await fetch("https://brandonwebforumgobackend.onrender.com/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // sends json code
            body: JSON.stringify({ username }), // stringify the username to send json code
        });
        const data = await response.json();
        if (data.errorCode === 0) {
            alert("Successfully Created User");
            navigate("/");
        } else {
            alert("Unable to Create User:" + data.messages?.[0]);
        }
    };
    const nav = () => {
        navigate("/");
    };
    useEffect(() => {
        document.title = "new user | yap ";
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f5f7fa",
            }}
        >
            <Card variant="outlined">
                <CardContent>
                    <Box sx={{ display: "flex" }}>
                        <Typography variant="h5" sx={{ mb: 5 }}>
                            Welcome to yap :{")"}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                        <TextField
                            helperText="Please enter your username"
                            label="Name"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Button sx={{ mt: -2 }} onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                        <Typography sx={{ cursor: "pointer" }} variant="body2">
                            click<Link onClick={nav}> here</Link> to login
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CreateUserPage;
