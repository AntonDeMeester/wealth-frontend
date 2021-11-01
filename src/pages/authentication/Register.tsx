import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Card, CardContent, Container, Divider, Link, Typography } from "@material-ui/core";
import { Register as RegisterComponent } from "../../components/authentication/register";
import Logo from "../../components/Logo";

const Register: FC = () => {
    return (
        <>
            <Helmet>
                <title>Register | Material Kit Pro</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <Container maxWidth="sm" sx={{ py: "80px" }}>
                    <Box
                        sx={{
                            mb: 8,
                            display: "flex",
                            justifyContent: "center",
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
                    <Card>
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                p: 4,
                            }}
                        >
                            <Box
                                sx={{
                                    alignItems: "center",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 3,
                                }}
                            >
                                <div>
                                    <Typography color="textPrimary" gutterBottom variant="h4">
                                        Register
                                    </Typography>
                                    <Typography color="textSecondary" variant="body2">
                                        Register on the internal platform
                                    </Typography>
                                </div>
                            </Box>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    mt: 3,
                                }}
                            >
                                <RegisterComponent />
                            </Box>
                            <Divider sx={{ my: 3 }} />
                            <Link color="textSecondary" component={RouterLink} to="/auth/login" variant="body2">
                                I already have an account
                            </Link>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default Register;
