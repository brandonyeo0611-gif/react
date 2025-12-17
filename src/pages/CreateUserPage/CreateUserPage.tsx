import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const CreateUserPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const handleSubmit = async () => {
        const response = await fetch("http://localhost:8000/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // sends json code
            body: JSON.stringify({ username }), // stringify the username to send json code
        });
        const data = await response.json();
        if (data.errorCode === 0) {
            alert("Successfully Created User");
        } else {
            alert("Unable to Create User:" + data.messages?.[0]);
        }
    };

    return (
        <div>
            <TextField
                helperText="Enter Desired Username"
                label="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    );
};

export default CreateUserPage;
