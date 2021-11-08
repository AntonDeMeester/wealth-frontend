import type { FC } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Avatar, Box, Divider, Drawer, Typography } from "@material-ui/core";
import type { Theme } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ChartPieIcon from "../../icons/ChartPie";
import ChartSquareBarIcon from "../../icons/ChartSquareBar";
import ShoppingBagIcon from "../../icons/ShoppingBag";
import Logo from "../Logo";
import NavSection from "../NavSection";
import Scrollbar from "../Scrollbar";
import { useSelector } from "src/store";
import { selectUser } from "src/slices/auth";

interface DashboardSidebarProps {
    onMobileClose: () => void;
    openMobile: boolean;
}

const sections = [
    {
        title: "General",
        items: [
            {
                title: "Overview",
                path: "/",
                icon: <ChartSquareBarIcon fontSize="small" />,
            },
            {
                title: "Banks",
                path: "/banks",
                icon: <ChartPieIcon fontSize="small" />,
            },
            {
                title: "Stocks",
                path: "/stocks",
                icon: <ShoppingBagIcon fontSize="small" />,
            },
            {
                title: "Custom Assets",
                path: "/custom-assets",
                icon: <ChartPieIcon fontSize="small" />,
            },
        ],
    },
];

const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
    const { onMobileClose, openMobile } = props;
    const location = useLocation();
    const user  = useSelector(state => selectUser(state.auth))
    const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

    const content = (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Scrollbar options={{ suppressScrollX: true }}>
                <Box
                    sx={{
                        display: {
                            lg: "none",
                            xs: "flex",
                        },
                        justifyContent: "center",
                        p: 2,
                    }}
                >
                    <RouterLink to="/">
                        <Logo
                            sx={{
                                height: 40,
                                width: 40,
                            }}
                        />
                    </RouterLink>
                </Box>
                <Box sx={{ p: 2 }}>
                    <Box
                        sx={{
                            alignItems: "center",
                            backgroundColor: "background.default",
                            borderRadius: 1,
                            display: "flex",
                            overflow: "hidden",
                            p: 2,
                        }}
                    >
                        <RouterLink to="/account">
                            <Avatar
                                src=""
                                sx={{
                                    cursor: "pointer",
                                    height: 48,
                                    width: 48,
                                }}
                            />
                        </RouterLink>
                        <Box sx={{ ml: 2 }}>
                            <Typography color="textPrimary" variant="subtitle2">
                                {user?.firstName}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Divider />
                <Box sx={{ p: 2 }}>
                    {sections.map((section) => (
                        <NavSection
                            key={section.title}
                            pathname={location.pathname}
                            sx={{
                                "& + &": {
                                    mt: 3,
                                },
                            }}
                            {...section}
                        />
                    ))}
                </Box>
                <Divider />
                {/* <Box sx={{ p: 2 }}>
                    <Typography color="textPrimary" variant="subtitle2">
                        Need Help?
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                        Check our docs
                    </Typography>
                    <Button
                        color="primary"
                        component={RouterLink}
                        fullWidth
                        sx={{ mt: 2 }}
                        to="/docs"
                        variant="contained"
                    >
                        Documentation
                    </Button>
                </Box> */}
            </Scrollbar>
        </Box>
    );

    if (lgUp) {
        return (
            <Drawer
                anchor="left"
                open
                PaperProps={{
                    sx: {
                        backgroundColor: "background.paper",
                        height: "calc(100% - 64px) !important",
                        top: "64px !Important",
                        width: 280,
                    },
                }}
                variant="permanent"
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            anchor="left"
            onClose={onMobileClose}
            open={openMobile}
            PaperProps={{
                sx: {
                    backgroundColor: "background.paper",
                    width: 280,
                },
            }}
            variant="temporary"
        >
            {content}
        </Drawer>
    );
};

DashboardSidebar.propTypes = {
    onMobileClose: PropTypes.func,
    openMobile: PropTypes.bool,
};

export default DashboardSidebar;
