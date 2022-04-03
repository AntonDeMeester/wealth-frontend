import { useRef, useState } from "react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Avatar, Box, Button, ButtonBase, Divider, Popover, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "src/store";
import { selectUser } from "src/slices/auth";

const AccountPopover: FC = () => {
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const { logout } = useAuth();
    const user  = useSelector(state => selectUser(state.auth))
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const handleLogout = async (): Promise<void> => {
        try {
            handleClose();
            await logout();
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error("Unable to logout.");
        }
    };

    return (
        <>
            <Box
                component={ButtonBase}
                onClick={handleOpen}
                ref={anchorRef}
                sx={{
                    alignItems: "center",
                    display: "flex",
                }}
            >
                <Avatar
                    src=""
                    sx={{
                        height: 32,
                        width: 32,
                    }}
                />
            </Box>
            <Popover
                anchorEl={anchorRef.current}
                anchorOrigin={{
                    horizontal: "center",
                    vertical: "bottom",
                }}
                keepMounted
                onClose={handleClose}
                open={open}
                PaperProps={{
                    sx: { width: 240 },
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography color="textPrimary" variant="subtitle2">
                        {user?.firstName}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle2">
                        {user?.lastName}
                    </Typography>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <Button color="primary" fullWidth onClick={handleLogout} variant="outlined">
                        Logout
                    </Button>
                </Box>
            </Popover>
        </>
    );
};

export default AccountPopover;
