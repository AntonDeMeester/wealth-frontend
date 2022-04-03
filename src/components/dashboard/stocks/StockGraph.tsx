import type { FC } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { Box, Card, CardHeader, Typography } from "@mui/material";
import type { CardProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import dataService from "src/services/dataService";
import { formatCurrency } from "src/services/formatService";
import { StockPosition } from "src/types/stocks";

interface GraphProps extends CardProps {
    positions: StockPosition[];
    selectedPositions: string[];
    selectedDuration: number;
}

const StockGraph: FC<GraphProps> = ({ positions, selectedPositions, selectedDuration, ...props }) => {
    const theme = useTheme();
    const relevantPositions = selectedPositions.length
        ? positions.filter((pos) => selectedPositions.includes(pos.positionId))
        : positions;
    const data = dataService
        .getItemsOfLastXMonths(
            dataService.sumByDay(
                relevantPositions.reduce((balances, position) => balances.concat(position.balances || []), [])
            ), 
            selectedDuration
        )
        .sort((a, b) => moment(a.date).diff(moment(b.date)))
        .map((d) => ({ x: d.date, y: d.amountInEuro }));
    const graphData = [{ name: "Total", data }];

    const chartOptions: ApexOptions = {
        chart: {
            background: "transparent",
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
                            Stock balances
                        </Typography>
                    </Box>
                }
            />
            <Chart height="393" options={chartOptions} series={graphData} type="area" />
        </Card>
    );
};

export default StockGraph;
