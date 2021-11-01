import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Card, CardContent, Container, Divider, Link, Typography } from "@material-ui/core";
import { VerifyCodeAmplify } from "../../components/authentication/verify-code";
import Logo from "../../components/Logo";
import useAuth from "../../hooks/useAuth";

const VerifyCode: FC = () => {
    const { platform } = useAuth() as any;

    return (
        <>
            <Helmet>
                <title>Verify Code | Material Kit Pro</title>
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
                                        Verify Code
                                    </Typography>
                                    <Typography color="textSecondary" variant="body2">
                                        Confirm registration using your verification code
                                    </Typography>
                                </div>
                            </Box>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    mt: 3,
                                }}
                            >
                                {platform === "Amplify" && <VerifyCodeAmplify />}
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

export default VerifyCode;
