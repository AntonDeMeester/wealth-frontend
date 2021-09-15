import { useEffect, useState } from "react";
import type { ChangeEvent, FC, MouseEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
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
import AccountModal from "src/components/dashboard/banks/AccountModal";

interface AccountsTableProps {
    accounts: Account[];
    onSelectionChange?: (selectedAccounts: string[]) => void;
}

const applyPagination = (accounts: Account[], page: number, limit: number): Account[] =>
    accounts.slice(page * limit, page * limit + limit);

const AccountsTable: FC<AccountsTableProps> = (props) => {
    const { accounts, onSelectionChange, ...other } = props;
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalAccount, setModalAccount] = useState<Account | null>(null);

    const openModal = (account: Account) => {
        setModalAccount(account);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalAccount(null);
        setModalOpen(false);
    };

    const handleSelectAllOrders = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedAccounts(event.target.checked ? accounts.map((account) => account.accountId) : []);
    };

    const handleSelectOneOrder = (event: ChangeEvent<HTMLInputElement>, orderId: string): void => {
        if (!selectedAccounts.includes(orderId)) {
            setSelectedAccounts((prevSelected) => [...prevSelected, orderId]);
        } else {
            setSelectedAccounts((prevSelected) => prevSelected.filter((id) => id !== orderId));
        }
    };
    useEffect(() => onSelectionChange && onSelectionChange(selectedAccounts), [selectedAccounts, onSelectionChange]);

    const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value, 10));
    };

    const paginatedOrders = applyPagination(accounts, page, limit);
    const selectedSomeOrders = selectedAccounts.length > 0 && selectedAccounts.length < accounts.length;
    const selectedAllOrders = selectedAccounts.length === accounts.length;

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
                                            checked={selectedAllOrders}
                                            color="primary"
                                            indeterminate={selectedSomeOrders}
                                            onChange={handleSelectAllOrders}
                                        />
                                    </TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Bank</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Amount in Euro</TableCell>
                                    <TableCell>Account Type</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedOrders.map((account) => {
                                    const isOrderSelected = selectedAccounts.includes(account.accountId);

                                    return (
                                        <TableRow
                                            hover
                                            key={account.accountId}
                                            selected={selectedAccounts.indexOf(account.accountId) !== -1}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isOrderSelected}
                                                    color="primary"
                                                    onChange={(event): void =>
                                                        handleSelectOneOrder(event, account.accountId)
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
                                                    {account.name || account.accountNumber}
                                                </Link>
                                                {/* <Typography color="textSecondary" variant="body2">
                                                    {format(account.createdAt, "dd MMM yyyy | HH:mm")}
                                                </Typography> */}
                                            </TableCell>
                                            <TableCell>
                                                <Typography color="textPrimary" variant="subtitle2">
                                                    {account.bankAlias}
                                                </Typography>
                                                <Typography color="textSecondary" variant="body2">
                                                    {account.bank}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {`${account.currency} ${numeral(
                                                    account.balances?.[account.balances?.length || 1 - 1]?.amount
                                                ).format("0,0.00")}`}
                                            </TableCell>
                                            <TableCell>
                                                {`€ ${numeral(
                                                    account.balances?.[account.balances?.length || 1 - 1]?.amount
                                                ).format("0,0.00")}`}
                                            </TableCell>
                                            <TableCell>{account.type}</TableCell>
                                            <TableCell align="right">
                                                <IconButton onClick={() => openModal(account)}>
                                                    <PencilAltIcon fontSize="small" />
                                                </IconButton>
                                                {/* <IconButton component={RouterLink} to="/dashboard/orders/1">
                                                    <ArrowRightIcon fontSize="small" />
                                                </IconButton> */}
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
                    count={accounts.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Card>
            {/* <OrderListBulkActions open={enableBulkActions} selected={selectedOrders} /> */}
            {accounts.length && modalAccount && (
                <AccountModal account={modalAccount} open={modalOpen} onClose={closeModal} />
            )}
        </>
    );
};

AccountsTable.propTypes = {
    accounts: PropTypes.array.isRequired,
};

export default AccountsTable;
