import { useEffect, useState } from "react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from "@mui/material";
import { AccountsGraph, AccountsTable } from "../../components/dashboard/banks";
import useSettings from "../../hooks/useSettings";
import ChevronRightIcon from "../../icons/ChevronRight";
import { useDispatch } from "../../store";
import { getAccountsWithBalances, selectAllAccounts } from "src/slices/banking";
import AddBankModal from "src/components/dashboard/banks/AddBankModal";
import { useLocation } from "react-router";
import bankService from "src/services/bankService";
import { useDebounceSelector } from "src/utils/debouncedSelector";
import MonthSelector from "src/components/shared/MonthSelector";
import {
    usePlaidLink,
    PlaidLinkOptions
  } from 'react-plaid-link';

const Banks: FC = () => {
    const location = useLocation();
    const { settings } = useSettings();
    const dispatch = useDispatch();
    const accounts = useDebounceSelector((state) => selectAllAccounts(state.banking));
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [tinkModalOpen, setTinkModalOpen] = useState<boolean>(false);
    const [selectedMonths, setSelectedMonths] = useState<number>(12);

    useEffect(() => {
        dispatch(getAccountsWithBalances());
    }, [dispatch]);

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

    const config: PlaidLinkOptions = {
        onSuccess: (public_token, metadata) => {},
        onExit: (err, metadata) => {},
        onEvent: (eventName, metadata) => {},
        token: 'link-sandbox-5c5f53a6-86a4-4501-a270-16408fc1915d',
    };
    const { open, ready } = usePlaidLink(config);
    useEffect(() => {
        if (ready) {
          open();
        }
      }, [ready, open]);

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
                    <Grid container justifyContent="flex-end" spacing={3}>
                        <Grid item justifySelf="flex-start">
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
                        <Grid item sx={{ flexGrow: 1 }}/>
                        <Grid item>
                            <MonthSelector selectedMonths={selectedMonths} onSelectedMonthsChange={setSelectedMonths} />
                        </Grid>
                        <Grid item alignSelf="center">
                            <Button
                                color="primary"
                                // endIcon={<ChevronDownIcon fontSize="small" />}
                                sx={{ ml: 2 }}
                                variant="contained"
                                onClick={openAddBankModal}
                                size="large"
                            >
                                Add Bank
                            </Button>
                            <Button >
                                Add bank via Plaid
                            </Button>
                        </Grid>
                    </Grid>
                    <Box sx={{ py: 3 }}>
                        <AccountsGraph
                            accounts={accounts}
                            selectedAccounts={selectedAccounts}
                            selectedDuration={selectedMonths}
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
