import React from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";

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
        const data = await response.json();
        if (data.errorCode === 0) {
            alert("Login Successful");
            navigate("/main");
        } else {
            alert("Login Failed: " + data.messages?.[0]); // remember in backend we did the messages so yea
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
