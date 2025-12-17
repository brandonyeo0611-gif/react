import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async () => {
        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // sends json code
            body: JSON.stringify({ username }), // stringify the username to send json code
        });
        const data = await response.json();
        if (data.errorCode === 0) {
            alert("Login Successful");
            navigate("/main");
        } else {
            alert("Login Failed: " + data.messages?.[0]);
        }
    };
    return (
        <div>
            <TextField
                helperText="Please enter your username"
                label="Name"
                onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    );
};

export default LoginPage;
