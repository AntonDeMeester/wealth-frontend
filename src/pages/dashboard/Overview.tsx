import { useEffect } from "react";
import type { FC } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Container, Grid, Typography } from "@material-ui/core";
import { OverviewTotalBalance } from "../../components/dashboard/overview";
import useSettings from "../../hooks/useSettings";
import { useDispatch } from "../../store";
import { selectAllBalances as selectAllBankBalances, getAccountsWithBalances } from "src/slices/banking";
import { selectAllBalances as selectAllStockBalances, getPositionsWithBalances } from "src/slices/stocks";
import OverviewGraph from "src/components/dashboard/overview/OverviewGraph";
import dataService from "src/services/dataService";
import moment from "moment";
import { WealthItem } from "src/types/banking";
import { useDebounceSelector } from "src/utils/debouncedSelector";
import { isEqual } from "lodash";
import OverviewPie from "src/components/dashboard/overview/OverviewPie";

const mapItems = (items: WealthItem[]) => {
    console.log("Hello world");
    return dataService.sumByDay(items || []).sort((a, b) => moment(a.date).diff(b.date));
};

const Overview: FC = () => {
    const dispatch = useDispatch();

    const bankBalances = mapItems(useDebounceSelector((state) => selectAllBankBalances(state.banking), isEqual)) || [];
    const stockBalances = mapItems(useDebounceSelector((state) => selectAllStockBalances(state.stocks), isEqual)) || [];

    const { settings } = useSettings();

    const lastBankBalance = bankBalances?.[bankBalances?.length - 1]?.amountInEuro || 0;
    const lastStockBalance = stockBalances?.[stockBalances?.length - 1]?.amountInEuro || 0;
    const totalAmount = lastBankBalance + lastStockBalance;

    useEffect(() => {
        dispatch(getAccountsWithBalances());
        dispatch(getPositionsWithBalances());
    }, [dispatch]);

    return (
        <>
            <Helmet>
                <title>Overview</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 8,
                }}
            >
                <Container maxWidth={settings.compact ? "xl" : false}>
                    <Grid container spacing={3}>
                        <Grid alignItems="center" container justifyContent="space-between" spacing={3} item xs={12}>
                            <Grid item>
                                <Typography color="textSecondary" variant="overline">
                                    Overview
                                </Typography>
                                <Typography color="textPrimary" variant="h5">
                                    Welcome back!
                                </Typography>
                                <Typography color="textSecondary" variant="subtitle2">
                                    Here&apos;s what&apos;s happening with your assets today
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item md={8} xs={12}>
                            <OverviewGraph bankBalances={bankBalances} stockBalances={stockBalances} />
                        </Grid>
                        <Grid item md={4}>
                            <Grid container spacing={3}>
                                <Grid item md={12} xs={12}>
                                    <OverviewTotalBalance totalAmount={totalAmount} />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <OverviewPie bankBalance={lastBankBalance} stockBalance={lastStockBalance} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

export default Overview;
