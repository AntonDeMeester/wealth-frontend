import type { FC } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import type { CardProps } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { formatCurrency } from "src/services/formatService";

interface GraphProps extends CardProps {
    bankBalance: number;
    stockBalance: number;
}

const OverviewPie: FC<GraphProps> = ({ bankBalance, stockBalance }) => {
    const theme = useTheme();
    const data = [
        {
            data: bankBalance,
            label: "Banking",
        },
        {
            data: stockBalance,
            label: "Stocks",
        },
    ];
    const chartOptions: ApexOptions = {
        chart: {
            background: "transparent",
            stacked: false,
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        labels: data.map((item) => `${item.label}: ${formatCurrency(item.data)}`),
        legend: {
            position: "right",
            onItemHover: {
                highlightDataSeries: true,
            },
            show: true,
        },
        stroke: {
            colors: [theme.palette.background.paper],
            width: 1,
        },
        theme: {
            mode: theme.palette.mode,
        },
        tooltip: {
            y: {
                formatter: (value) => formatCurrency(value),
            },
        },
    };

    const chartSeries = data.map((item) => item.data);

    return (
        <Card>
            <CardHeader title="Current composition" />
            <CardContent>
                <Chart height="300" options={chartOptions} series={chartSeries} type="pie" />
            </CardContent>
        </Card>
    );
};

export default OverviewPie;
