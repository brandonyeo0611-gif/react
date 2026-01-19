import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Fab, FormControl, InputLabel, MenuItem } from "@mui/material";
import { Add } from "@mui/icons-material";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import type { SelectChangeEvent } from "@mui/material/Select";
// if its a tsx type u need to remember to add a type in front, not sure why the mui doesnt address it..

type CreatePostProps = {
    username: string;
};

const CreatePost: React.FC<CreatePostProps> = ({ username }) => {
    const [content, setContent] = React.useState("");

    const handleChange = (event: SelectChangeEvent<string>) => {
        setContent(event.target.value as string);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <Fab
                sx={{
                    position: "fixed",
                    bottom: 50,
                    right: 50,
                }}
                color="primary"
                aria-label="add"
                onClick={handleClickOpen}
            >
                <Add />
            </Fab>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: "form",
                    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const content = formJson.content;
                        console.log(content);
                        const content_type = formJson.contentType;
                        console.log(content_type);
                        const title = formJson.title;
                        console.log(title);
                        const token = localStorage.getItem("accesstoken");
                        const response = await fetch("https://brandonwebforumgobackend.onrender.com/posts", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, // sends json code
                            body: JSON.stringify({ title, username, content, content_type }), // stringify the username to send json code, match json backend model
                        });
                        if (response.status === 401) {
                            // unauthorized → navigate home
                            navigate("/");
                            return;
                        }
                        const data = await response.json();
                        if (data.errorCode === 0) {
                            alert("Create post successful");
                        } else {
                            alert("Create Post Failed: " + data.messages?.[0]); // remember in backend we did the messages so yea
                        }
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Create Post</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="title"
                        name="title"
                        label="title"
                        type="text"
                        fullWidth
                        variant="standard"
                        sx={{ p: 1 }}
                    />
                    <FormControl fullWidth sx={{ p: 1 }}>
                        <InputLabel sx={{ p: 1 }} id="demo-simple-select-label">
                            Content type
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={content}
                            label="content type"
                            onChange={handleChange}
                            name="contentType"
                        >
                            <MenuItem value={"Technology"}>Technology</MenuItem>
                            <MenuItem value={"Games"}>Games</MenuItem>
                            <MenuItem value={"Lifestyle"}>Lifestyle</MenuItem>
                            <MenuItem value={"Music"}>Music</MenuItem>
                            <MenuItem value={"Automotive"}>Automotive</MenuItem>
                            <MenuItem value={"Culture"}>Culture</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="content"
                        name="content"
                        label="content"
                        type="text"
                        fullWidth
                        variant="standard"
                        sx={{ p: 1 }}
                        multiline
                        minRows={5}
                        maxRows={5}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Post</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default CreatePost;
