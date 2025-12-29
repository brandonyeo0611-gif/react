import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, TextField, Button, Box, Typography, Link } from "@mui/material";
import CardContent from "@mui/material/CardContent";

type LoginPageProps = {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
};
const LoginPage: React.FC<LoginPageProps> = ({ username, setUsername }) => {
    // variables need match with backend data json naming!!
    const navigate = useNavigate();
    // navigate pages in frontend
    const handleSubmit = async () => {
        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // sends json code
            body: JSON.stringify({ username }), // stringify the username to send json code, match json backend model
        });
        const res = await response.json();
        const data = res.payload.data;
        const token = data.RefreshToken;
        // store the token locally
        localStorage.setItem("token", token);
        if (res.errorCode === 0) {
            alert("Login Successful");
            navigate("/main");
        } else {
            alert("Login Failed: " + res.messages?.[0]); // remember in backend we did the messages so yea
        }
    };
    const nav = () => {
        navigate("/newuser");
    };
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
                        <Button onClick={handleSubmit}>Submit</Button>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                        <Typography sx={{ cursor: "pointer" }} variant="body2">
                            click<Link onClick={nav}> here</Link> to create new user
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LoginPage;
