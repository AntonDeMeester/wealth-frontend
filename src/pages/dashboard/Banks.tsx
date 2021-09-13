import { useEffect, useState } from "react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from "@material-ui/core";
import { AccountsGraph, AccountsTable } from "../../components/dashboard/banks";
import useSettings from "../../hooks/useSettings";
import ChevronRightIcon from "../../icons/ChevronRight";
import { useDispatch, useSelector } from "../../store";
import { getAccountsWithBalances, selectAllAccounts } from "src/slices/banking";
import AddBankModal from "src/components/dashboard/banks/AddBankModal";
import { useLocation } from "react-router";
import bankService from "src/services/bankService";

const Banks: FC = () => {
    const location = useLocation();
    const { settings } = useSettings();
    const dispatch = useDispatch();
    const accounts = useSelector((state) => selectAllAccounts(state.banking));
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [tinkModalOpen, setTinkModalOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getAccountsWithBalances());
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get("code");
        const credentialsId = queryParams.get("credentialsId");
        if (!code && !credentialsId) {
            return;
        }
        const processTinkCode = async () => {
            await bankService.tinkCallback({ code, credentialsId });
            // navigate("/dashboard/banks");
        };
        processTinkCode();
    }, [location]);

    const selectedAccountsChanged = (selected: string[]) => setSelectedAccounts(selected);

    const openAddBankModal = () => {
        setTinkModalOpen(true);
    };
    const closeBankModal = () => {
        setTinkModalOpen(false);
    };

    return (
        <>
            <Helmet>
                <title>Banks Overview</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 8,
                }}
            >
                <Container maxWidth={settings.compact ? "xl" : false}>
                    <Grid container justifyContent="space-between" spacing={3}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h5">
                                Account
                            </Typography>
                            <Breadcrumbs
                                aria-label="breadcrumb"
                                separator={<ChevronRightIcon fontSize="small" />}
                                sx={{ mt: 1 }}
                            >
                                <Link color="textPrimary" component={RouterLink} to="/" variant="subtitle2">
                                    Dashboard
                                </Link>
                                <Typography color="textSecondary" variant="subtitle2">
                                    Banks
                                </Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item>
                            <Button
                                color="primary"
                                // endIcon={<ChevronDownIcon fontSize="small" />}
                                sx={{ ml: 2 }}
                                variant="contained"
                                onClick={openAddBankModal}
                            >
                                Add Bank
                            </Button>
                        </Grid>
                    </Grid>
                    <Box sx={{ py: 3 }}>
                        <AccountsGraph
                            accounts={accounts}
                            selectedAccounts={selectedAccounts}
                            sx={{ height: "100%" }}
                        />
                    </Box>
                    <Box>
                        <AccountsTable accounts={accounts} onSelectionChange={selectedAccountsChanged} />
                    </Box>
                </Container>
            </Box>
            <AddBankModal open={tinkModalOpen} onClose={closeBankModal} />
        </>
    );
};

export default Banks;
