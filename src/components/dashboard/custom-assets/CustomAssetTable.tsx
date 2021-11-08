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
import { applyPaginations } from "src/utils/paginations";
import moment from "moment";
import Trash from "src/icons/Trash";
import { CustomAsset } from "src/types/customAssets";
import CustomAssetModal from "./CustomAssetModal"

interface OrderListTableProps {
    assets: CustomAsset[];
    onSelectionChange?: (selectedAssets: string[]) => void;
    onDeleteAsset?: (deletedAsset: CustomAsset) => void;
}

const getPercentIncrease = (asset: CustomAsset): number =>
    asset.currentValue / (asset.balances?.[0]?.amount || asset.currentValue) - 1;

const calculateIRR = (asset: CustomAsset): number => {
    if(!asset.events?.length || !asset.balances?.length) {
        return 0
    }
    return Math.pow(getPercentIncrease(asset) + 1, 1 / (moment().diff(moment(asset.events[0].date), "days") / 365)) - 1;

}

const OrderListTable: FC<OrderListTableProps> = ({ assets, onSelectionChange, onDeleteAsset, ...other }) => {
    const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalAsset, setModalAsset] = useState<CustomAsset | null>(null);

    const openModal = (asset: CustomAsset) => {
        setModalAsset(asset);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalAsset(null);
        setModalOpen(false);
    };

    const handleSelectAllOrders = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedAssets(event.target.checked ? assets.map((asset) => asset.assetId) : []);
    };

    const handleSelectOneOrder = (event: any, assetId: string): void => {
        if (!selectedAssets.includes(assetId)) {
            setSelectedAssets((prevSelected) => [...prevSelected, assetId]);
        } else {
            setSelectedAssets((prevSelected) => prevSelected.filter((id) => id !== assetId));
        }
    };
    // Update selected asset callback to parent
    useEffect(() => onSelectionChange && onSelectionChange(selectedAssets), [selectedAssets, onSelectionChange]);

    const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value, 10));
    };

    const paginatedOrders = applyPaginations(assets, page, limit);
    const selectedSomeAssets = selectedAssets.length > 0 && selectedAssets.length < assets.length;
    const selectedAllAssets = selectedAssets.length === assets.length;

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
                                            checked={selectedAllAssets}
                                            color="primary"
                                            indeterminate={selectedSomeAssets}
                                            onChange={handleSelectAllOrders}
                                        />
                                    </TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Date first seen</TableCell>
                                    <TableCell>Current Value</TableCell>
                                    <TableCell>Current Value in Euro</TableCell>
                                    <TableCell>Increase</TableCell>
                                    <TableCell>IRR</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedOrders.map((asset) => {
                                    const isOrderSelected = selectedAssets.includes(asset.assetId);

                                    return (
                                        <TableRow hover key={asset.assetId} selected={isOrderSelected}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isOrderSelected}
                                                    color="primary"
                                                    onClick={(event): void =>
                                                        handleSelectOneOrder(event, asset.assetId)
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
                                                    {asset.description}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="textPrimary" variant="subtitle2">
                                                    {format(new Date(asset.events?.[0]?.date), "dd/MM/yyyy")}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{numeral(asset.currentValue).format(`0,0.00`)}</TableCell>
                                            <TableCell>
                                                {numeral(asset.currentValueInEuro).format(`0,0.00`)}
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    color={getPercentIncrease(asset) >= 0 ? "green" : "red"}
                                                    variant="subtitle2"
                                                >
                                                    {numeral(getPercentIncrease(asset)).format("0%")}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    color={calculateIRR(asset) >= 0 ? "green" : "red"}
                                                    variant="subtitle2"
                                                >
                                                    {numeral(calculateIRR(asset)).format("0.0%")}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => openModal(asset)}>
                                                    <PencilAltIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={() => onDeleteAsset?.(asset)}>
                                                    <Trash fontSize="small" />
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
                    count={assets.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Card>
            {/* <OrderListBulkActions open={enableBulkActions} selected={selectedOrders} /> */}
            {assets.length && modalAsset && (
                <CustomAssetModal asset={modalAsset} open={modalOpen} onClose={closeModal} />
            )}
        </>
    );
};

OrderListTable.propTypes = {
    assets: PropTypes.array.isRequired,
};

export default OrderListTable;
