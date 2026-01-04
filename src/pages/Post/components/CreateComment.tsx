import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Fab } from "@mui/material";
import MessageTwoToneIcon from "@mui/icons-material/Message";

// if its a tsx type u need to remember to add a type in front, not sure why the mui doesnt address it..

type CreateCommentProps = {
    post_id: string | undefined;
};

const CreateComment: React.FC<CreateCommentProps> = ({ post_id }) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Fab
                sx={{
                    width: 30,
                    height: 30,
                    boxShadow: "0px",
                }}
                color="primary"
                aria-label="add"
                onClick={handleClickOpen}
            >
                <MessageTwoToneIcon sx={{ width: 20 }} />
            </Fab>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: "50%",
                        height: "50%",
                    },
                    component: "form",
                    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const content = formJson.content;
                        const token = localStorage.getItem("accesstoken");
                        const response = await fetch("http://localhost:8000/comments", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, // sends json code
                            body: JSON.stringify({ content, post_id }), // stringify the username to send json code, match json backend model
                        });
                        const data = await response.json();
                        if (data.errorCode === 0) {
                            alert("Create comment successful");
                        } else {
                            alert("Create comment Failed: " + data.messages?.[0]); // remember in backend we did the messages so yea
                        }
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Create Comment</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="content"
                        name="content"
                        label="content"
                        type="text"
                        fullWidth
                        multiline
                        minRows={9}
                        maxRows={9}
                        sx={{ p: 1, height: "100%" }}
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

export default CreateComment;
