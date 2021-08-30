import { useEffect, useState } from "react";
import type { ChangeEvent, FC, MouseEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { format } from "date-fns";
import numeral from "numeral";
import PropTypes from "prop-types";
import {
    Box,
    Card,
    CardHeader,
    Checkbox,
    Divider,
    IconButton,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@material-ui/core";
import PencilAltIcon from "../../../icons/PencilAlt";
import Scrollbar from "../../Scrollbar";
// import OrderListBulkActions from "../order/OrderListBulkActions";
import { Account } from "src/types/banking";
import { StockPosition } from "src/types/stocks";
import { applyPaginations } from "src/utils/paginations";
import moment from "moment";
import StockModal from "src/components/dashboard/stocks/StockModal";

interface OrderListTableProps {
    positions: StockPosition[];
    onSelectionChange?: (selectedPositions: string[]) => void;
}

const getPercentIncrease = (position: StockPosition): number =>
    position.currentValue / (position.balances?.[0].amount || position.currentValue) - 1;

const calculateIRR = (position: StockPosition): number =>
    Math.pow(getPercentIncrease(position) + 1, 1 / (moment().diff(moment(position.startDate), "days") / 365)) - 1;

const OrderListTable: FC<OrderListTableProps> = (props) => {
    const { positions, onSelectionChange, ...other } = props;
    const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalPosition, setModalPosition] = useState<StockPosition | null>(null);

    const openModal = (position: StockPosition) => {
        setModalPosition(position);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalPosition(null);
        setModalOpen(false);
    };

    const handleSelectAllOrders = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedPositions(event.target.checked ? positions.map((position) => position.positionId) : []);
    };

    const handleSelectOneOrder = (event: any, positionId: string): void => {
        if (!selectedPositions.includes(positionId)) {
            setSelectedPositions((prevSelected) => [...prevSelected, positionId]);
        } else {
            setSelectedPositions((prevSelected) => prevSelected.filter((id) => id !== positionId));
        }
    };
    // Update selected position callback to parent
    useEffect(() => onSelectionChange && onSelectionChange(selectedPositions), [selectedPositions]);

    const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value, 10));
    };

    const paginatedOrders = applyPaginations(positions, page, limit);
    const selectedSomePositions = selectedPositions.length > 0 && selectedPositions.length < positions.length;
    const selectedAllPositions = selectedPositions.length === positions.length;

    return (
        <>
            <Card {...other}>
                <CardHeader title="Orders" />
                <Divider />
                <Scrollbar>
                    <Box sx={{ minWidth: 1150 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedAllPositions}
                                            color="primary"
                                            indeterminate={selectedSomePositions}
                                            onChange={handleSelectAllOrders}
                                        />
                                    </TableCell>
                                    <TableCell>Ticker</TableCell>
                                    <TableCell>Date Bought</TableCell>
                                    <TableCell>Number of Shares</TableCell>
                                    <TableCell>Current Value</TableCell>
                                    <TableCell>Current Value in Euro</TableCell>
                                    <TableCell>Increase</TableCell>
                                    <TableCell>IRR</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedOrders.map((position) => {
                                    const isOrderSelected = selectedPositions.includes(position.positionId);

                                    return (
                                        <TableRow hover key={position.positionId} selected={isOrderSelected}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isOrderSelected}
                                                    color="primary"
                                                    onClick={(event): void =>
                                                        handleSelectOneOrder(event, position.positionId)
                                                    }
                                                    value={isOrderSelected}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    color="textPrimary"
                                                    component={RouterLink}
                                                    to="/dashboard/orders/1"
                                                    underline="none"
                                                    variant="subtitle2"
                                                >
                                                    {position.ticker}
                                                </Link>
                                                {/* <Typography color="textSecondary" variant="body2">
                                                    {format(position.createdAt, "dd MMM yyyy | HH:mm")}
                                                </Typography> */}
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="textPrimary" variant="subtitle2">
                                                    {format(new Date(position.startDate), "dd/MM/yyyy")}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{position.amount}</TableCell>
                                            <TableCell>{numeral(position.currentValue).format(`0,0.00`)}</TableCell>
                                            <TableCell>
                                                {numeral(position.currentValueInEuro).format(`0,0.00`)}
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    color={getPercentIncrease(position) >= 0 ? "green" : "red"}
                                                    variant="subtitle2"
                                                >
                                                    {numeral(getPercentIncrease(position)).format("0%")}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    color={calculateIRR(position) >= 0 ? "green" : "red"}
                                                    variant="subtitle2"
                                                >
                                                    {numeral(calculateIRR(position)).format("0.0%")}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => openModal(position)}>
                                                    <PencilAltIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                </Scrollbar>
                <TablePagination
                    component="div"
                    count={positions.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Card>
            {/* <OrderListBulkActions open={enableBulkActions} selected={selectedOrders} /> */}
            {positions.length && modalPosition && (
                <StockModal position={modalPosition} open={modalOpen} onClose={closeModal} />
            )}
        </>
    );
};

OrderListTable.propTypes = {
    positions: PropTypes.array.isRequired,
};

export default OrderListTable;
