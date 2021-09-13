import type { FC } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { Box, Card, CardHeader, Tooltip, Typography } from "@material-ui/core";
import type { CardProps } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import InformationCircleIcon from "../../../icons/InformationCircle";
import { Account } from "src/types/banking";
import moment from "moment";
import dataService from "src/services/dataService";
import { formatCurrency } from "src/services/formatService";

interface GraphProps extends CardProps {
    accounts: Account[];
    selectedAccounts: string[];
}

const createFullAlias = (account: Account): string => {
    const accName = account.name || account.accountId;
    if (account.bankAlias) {
        return `${account.bankAlias} - ${accName}`;
    }
    return accName;
};

const AccountGraph: FC<GraphProps> = ({ accounts, selectedAccounts, ...props }) => {
    const theme = useTheme();
    const relevantAccounts = selectedAccounts.length
        ? accounts.filter((acc) => selectedAccounts.includes(acc.accountId))
        : accounts;
    const dataList = relevantAccounts.map((acc) => ({
        id: acc.accountId,
        name: createFullAlias(acc),
        balances: acc.balances || [],
    }));
    const allDates = new Set<string>();
    dataList.forEach((item) => {
        item.balances.forEach((balance) => allDates.add(balance.date));
    });
    const graphData = dataList
        .map((item) => ({
            ...item,
            balances: dataService.addEmptyDates(item.balances, Array.from(allDates.values())),
        }))
        .map((item) => ({
            id: item.id,
            name: item.name,
            data: item.balances
                .sort((a, b) => moment(a.date).diff(moment(b.date)))
                .map((d) => ({ x: d.date, y: d.amountInEuro })),
        }));

    const chartOptions: ApexOptions = {
        chart: {
            background: "transparent",
            animations: { animateGradually: { delay: 0 }, dynamicAnimation: { speed: 500 } },
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        noData: {
            text: "Loading",
        },
        grid: {
            borderColor: theme.palette.divider,
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
        },
        // labels: graphData.map((item) => item.label),
        legend: {
            show: false,
        },
        stroke: {
            curve: "smooth",
            lineCap: "butt",
            width: 3,
        },
        theme: {
            mode: theme.palette.mode,
        },
        xaxis: {
            type: "datetime",
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                },
            },
        },
        yaxis: {
            labels: {
                formatter: (value) => formatCurrency(value),
            },
        },
        fill: {
            type: "solid",
            gradient: {
                opacityFrom: 0.1,
                opacityTo: 0.7,
            },
            opacity: 0.3,
        },
        tooltip: {},
    };

    return (
        <Card {...props}>
            <CardHeader
                disableTypography
                title={
                    <Box
                        sx={{
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography color="textPrimary" variant="h6">
                            Bank balances
                        </Typography>
                        <Tooltip title="Widget25 Source by channel">
                            <InformationCircleIcon fontSize="small" />
                        </Tooltip>
                    </Box>
                }
            />
            <Chart height="393" options={chartOptions} series={graphData} type="area" />
        </Card>
    );
};

export default AccountGraph;
