import { useEffect, useState } from "react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from "@material-ui/core";
import { StockGraph, StockTable } from "../../components/dashboard/stocks";
import useSettings from "../../hooks/useSettings";
import ChevronRightIcon from "../../icons/ChevronRight";
import { useDispatch } from "../../store";
import { getPositionsWithBalances, selectAllPositions, deletePosition } from "src/slices/stocks";
import SearchTickerModal from "src/components/dashboard/stocks/SearchTickerModal";
import NewStockModal from "src/components/dashboard/stocks/NewStockModal";
import { StockPosition, TickerSearchItem } from "src/types/stocks";
import { useDebounceSelector } from "src/utils/debouncedSelector";

const Stocks: FC = () => {
    const { settings } = useSettings();
    const dispatch = useDispatch();
    const positions = useDebounceSelector((state) => selectAllPositions(state.stocks));
    const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
    const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
    const [newPositionModalOpen, setNewPositionModalOpen] = useState<boolean>(false);
    const [selectedTicker, setSelectedTicker] = useState<TickerSearchItem | undefined>();

    const openSearchModal = () => {
        setSearchModalOpen(true);
    };

    const closeSearchModal = () => {
        setSearchModalOpen(false);
    };

    const onSearchTickerSelect = (ticker: TickerSearchItem) => {
        setSelectedTicker(ticker);
        closeSearchModal();
        setNewPositionModalOpen(true);
    };

    const closeNewPositionModal = () => {
        setNewPositionModalOpen(false);
    };

    useEffect(() => {
        dispatch(getPositionsWithBalances());
    }, [dispatch]);

    const selectedPositionChanged = (selected: string[]) => setSelectedPositions(selected);
    const onPositionDeleted = (position: StockPosition) => dispatch(deletePosition(position.positionId));

    return (
        <>
            <Helmet>
                <title>Stock Overview</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 8,
                }}
            >
                <Container maxWidth={settings.compact ? "xl" : false}>
                    <Grid container justifyContent="space-between" spacing={3}>
                        <Grid item>
                            <Typography color="textPrimary" variant="h5">
                                Stocks
                            </Typography>
                            <Breadcrumbs
                                aria-label="breadcrumb"
                                separator={<ChevronRightIcon fontSize="small" />}
                                sx={{ mt: 1 }}
                            >
                                <Link color="textPrimary" component={RouterLink} to="/" variant="subtitle2">
                                    Dashboard
                                </Link>
                                <Typography color="textSecondary" variant="subtitle2">
                                    Stocks
                                </Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item>
                            <Button
                                color="primary"
                                // endIcon={<ChevronDownIcon fontSize="small" />}
                                sx={{ ml: 2 }}
                                variant="contained"
                                onClick={openSearchModal}
                            >
                                Add stock
                            </Button>
                        </Grid>
                    </Grid>
                    <Box sx={{ py: 3 }}>
                        <StockGraph
                            positions={positions}
                            selectedPositions={selectedPositions}
                            sx={{ height: "100%" }}
                        />
                    </Box>
                    <Box>
                        <StockTable
                            positions={positions}
                            onSelectionChange={selectedPositionChanged}
                            onDeletePosition={onPositionDeleted}
                        />
                    </Box>
                </Container>
            </Box>
            <SearchTickerModal
                open={searchModalOpen}
                onClose={closeSearchModal}
                onTickerSelected={onSearchTickerSelect}
            />
            {selectedTicker && (
                <NewStockModal
                    open={newPositionModalOpen}
                    searchTicker={selectedTicker}
                    onClose={closeNewPositionModal}
                />
            )}
        </>
    );
};

export default Stocks;
