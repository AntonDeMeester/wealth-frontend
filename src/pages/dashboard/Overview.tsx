import { useEffect, useState } from "react";
import type { FC } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Container, Grid, Typography } from "@mui/material";
import { OverviewTotalBalance } from "../../components/dashboard/overview";
import useSettings from "../../hooks/useSettings";
import { useDispatch } from "../../store";
import { selectAllBalances as selectAllBankBalances, getAccountsWithBalances } from "src/slices/banking";
import { selectAllBalances as selectAllStockBalances, getPositionsWithBalances } from "src/slices/stocks";
import { selectAllBalances as selectAllCustomAssetBalances, getAssetsWithBalances } from "src/slices/customAssets";
import OverviewGraph from "src/components/dashboard/overview/OverviewGraph";
import dataService from "src/services/dataService";
import moment from "moment";
import { WealthItem } from "src/types/banking";
import { useDebounceSelector } from "src/utils/debouncedSelector";
import { isEqual } from "lodash";
import OverviewPie from "src/components/dashboard/overview/OverviewPie";
import MonthSelector from "src/components/shared/MonthSelector";

const mapItems = (items: WealthItem[]) => {
    return dataService.sumByDay(items || []).sort((a, b) => moment(a.date).diff(b.date));
};

const Overview: FC = () => {
    const dispatch = useDispatch();
    const [selectedMonths, setSelectedMonths] = useState<number>(12);

    const bankBalances = dataService.getItemsOfLastXMonths(
        mapItems(useDebounceSelector((state) => selectAllBankBalances(state.banking), isEqual)) || [],
        selectedMonths
    );
    const stockBalances = dataService.getItemsOfLastXMonths(
        mapItems(useDebounceSelector((state) => selectAllStockBalances(state.stocks), isEqual)) || [],
        selectedMonths
    );
    const customAssetBalances = dataService.getItemsOfLastXMonths(
        mapItems(useDebounceSelector((state) => selectAllCustomAssetBalances(state.customAssets), isEqual)) || [],
        selectedMonths
    );

    const { settings } = useSettings();

    const lastBankBalance = bankBalances?.[bankBalances?.length - 1]?.amountInEuro || 0;
    const lastStockBalance = stockBalances?.[stockBalances?.length - 1]?.amountInEuro || 0;
    const lastCustomAssetBalance = customAssetBalances?.[customAssetBalances?.length - 1]?.amountInEuro || 0;
    const totalAmount = lastBankBalance + lastStockBalance + lastCustomAssetBalance;

    useEffect(() => {
        dispatch(getAccountsWithBalances());
        dispatch(getPositionsWithBalances());
        dispatch(getAssetsWithBalances())
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
                        <Grid item container sx={{ flexDirection: "row" }} spacing={3} xs={12}>
                            <Grid alignItems="center" justifyContent="space-between" spacing={3} item>
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
                            <Grid item sx={{ flexGrow: 1 }} />
                            <Grid item alignSelf="center">
                                <MonthSelector
                                    selectedMonths={selectedMonths}
                                    onSelectedMonthsChange={setSelectedMonths}
                                />
                            </Grid>
                        </Grid>
                        <Grid item md={8} xs={12}>
                            <OverviewGraph bankBalances={bankBalances} stockBalances={stockBalances} customAssetBalances={customAssetBalances}/>
                        </Grid>
                        <Grid item md={4}>
                            <Grid container spacing={3}>
                                <Grid item md={12} xs={12}>
                                    <OverviewTotalBalance totalAmount={totalAmount} />
                                </Grid>
                                <Grid item md={12} xs={12}>
                                    <OverviewPie bankBalance={lastBankBalance} stockBalance={lastStockBalance} customAssetBalance={lastCustomAssetBalance}/>
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
