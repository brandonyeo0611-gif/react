import { GetProfilePic } from "./GetProfilePic";
import { RefreshAccessToken } from "./RenewAccessToken";
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { HistoryOutlined, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/material/";
import type { AvatarProps } from "@mui/material/Avatar";
const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));
const Avatars: React.FC<{ username: string } & AvatarProps> = ({ username }) => {
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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

export default function PrimarySearchAppBar() {
    const refreshToken = localStorage.getItem("refreshtoken");
    const [AccessToken, setAccessToken] = useState(localStorage.getItem("accesstoken"));
    if (refreshToken) {
        const accessToken = RefreshAccessToken(refreshToken);
        console.log(accessToken);
    }
    useEffect(() => {
        const refresh = async () => {
            const refreshToken = localStorage.getItem("refreshtoken");
            if (!refreshToken) {
                navigate("/"); // redirect if no refresh token
                return;
            }
            const token = await RefreshAccessToken(refreshToken);
            if (token === 401 || token === 402) {
                navigate("/"); // redirect if no refresh token
                return;
            }
            localStorage.setItem("accesstoken", token);
            setAccessToken(AccessToken);
        };
        refresh();
    }, []);

    const username = localStorage.getItem("username");
    if (!username) {
        return;
    }
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const handleHistory = () => {
        navigate(`/history/${username}`);
    };

    const handleLogOut = () => {
        localStorage.removeItem("refreshtoken");
        localStorage.removeItem("accesstoken");
        navigate("/");
    };
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "profile_picture");
        data.append("cloud_name", "ds9ctxlri");
        const res = await fetch("https://api.cloudinary.com/v1_1/ds9ctxlri/image/upload", {
            method: "POST",
            body: data,
        });
        const cloudData = await res.json();
        const profile_url = cloudData.secure_url;

        const response = await fetch("https://brandonwebforumgobackend.onrender.com/users/profile_pic", {
            method: "PUT", // sends json code
            body: JSON.stringify({ profile_url }),
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${AccessToken}` }, // stringify the username to send json code, match json backend model
        });
        const Data = await response.json();
        if (Data.errorCode != 0) {
            alert("fail to update profile picture");
        } else {
            alert("successfully change profile picture");
        }
    };
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleClickChangeProfilePic = () => {
        fileInputRef.current?.click(); // programmatically open file picker
    };

    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
            <MenuItem onClick={handleClickChangeProfilePic}>Change Profile Pic</MenuItem>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileUpload}></input>
            <MenuItem></MenuItem>
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Avatars
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                        username={username}
                    ></Avatars>
                </IconButton>
                <p>Profile</p>
            </MenuItem>
            <MenuItem onClick={handleHistory}>
                <IconButton size="large" color="inherit">
                    <HistoryOutlined />
                </IconButton>
                <p>History</p>
            </MenuItem>
            <MenuItem onClick={handleLogOut}>
                <IconButton
                    size="large"
                    aria-label="logout"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Logout></Logout>
                </IconButton>
                <p>Logout</p>
            </MenuItem>
        </Menu>
    );
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" } }}>
                        YAP
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: "none", md: "flex" } }}>
                        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                        <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                            <Badge badgeContent={17} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatars
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                }}
                                username={username}
                            ></Avatars>
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}
