import type { FC } from "react";
import numeral from "numeral";
import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";

interface OverviewTotalBalanceProps {
    totalAmount: number;
}

const OverviewTotalBalance: FC<OverviewTotalBalanceProps> = ({ totalAmount, ...props }) => (
    <Card {...props}>
        <CardHeader
            subheader={
                <Typography color="textPrimary" variant="h4">
                    {"€ " + numeral(totalAmount).format("0,0.00")}
                </Typography>
            }
            sx={{ pb: 0 }}
            title={
                <Typography color="textSecondary" variant="overline">
                    Total balance
                </Typography>
            }
        />
        <CardContent></CardContent>
    </Card>
);

export default OverviewTotalBalance;
