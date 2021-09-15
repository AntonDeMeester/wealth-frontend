import type { FC } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { Box, Card, CardHeader, Tooltip, Typography } from "@material-ui/core";
import type { CardProps } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import InformationCircleIcon from "../../../icons/InformationCircle";
import { WealthItem } from "src/types/banking";
import moment from "moment";
import dataService from "src/services/dataService";
import { formatCurrency } from "src/services/formatService";

interface GraphProps extends CardProps {
    bankBalances: WealthItem[];
    stockBalances: WealthItem[];
}

const OverviewGraph: FC<GraphProps> = ({ bankBalances, stockBalances }) => {
    const theme = useTheme();
    const dataList = [
        {
            id: "bank",
            name: "Banks",
            balances: bankBalances,
        },
        {
            id: "stock",
            name: "Stocks",
            balances: stockBalances,
        },
    ];
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
            data: dataService.reduceLength(
                item.balances
                    .sort((a, b) => moment(a.date).diff(moment(b.date)))
                    .map((d) => ({ x: d.date, y: d.amountInEuro })),
                200
            ),
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
        <Card>
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
                            Total assets
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

export default OverviewGraph;
