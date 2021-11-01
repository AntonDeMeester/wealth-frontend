import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Card, CardContent, Container, Divider, Link, Typography } from "@material-ui/core";
import { PasswordResetAmplify } from "../../components/authentication/password-reset";
import Logo from "../../components/Logo";
import useAuth from "../../hooks/useAuth";

const PasswordReset: FC = () => {
    const { platform } = useAuth() as any;

    return (
        <>
            <Helmet>
                <title>Password Reset | Material Kit Pro</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                }}
            >
                <Container maxWidth="sm" sx={{ py: 10 }}>
                    <Box
                        sx={{
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
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mb: 8,
                        }}
                    />
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
                                        Password Reset
                                    </Typography>
                                    <Typography color="textSecondary" variant="body2">
                                        Reset your account password using your code
                                    </Typography>
                                </div>
                            </Box>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    mt: 3,
                                }}
                            >
                                {platform === "Amplify" && <PasswordResetAmplify />}
                            </Box>
                            <Divider sx={{ my: 3 }} />
                            {platform === "Amplify" && (
                                <Link
                                    color="textSecondary"
                                    component={RouterLink}
                                    to="/auth/password-recovery"
                                    variant="body2"
                                >
                                    Did you not receive the code?
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        </>
    );
};

export default PasswordReset;
