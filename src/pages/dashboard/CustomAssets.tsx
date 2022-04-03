import { useEffect, useState } from "react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Box, Breadcrumbs, Button, Container, Grid, Link, Typography } from "@mui/material";
import useSettings from "../../hooks/useSettings";
import ChevronRightIcon from "../../icons/ChevronRight";
import { useDispatch } from "../../store";
import { useDebounceSelector } from "src/utils/debouncedSelector";
import MonthSelector from "src/components/shared/MonthSelector";
import { getAssetsWithBalances, selectAllAssets, deleteAsset } from "src/slices/customAssets";
import { CustomAsset as CustomAssetType } from "src/types/customAssets";
import { CustomAssetGraph, CustomAssetTable } from "src/components/dashboard/custom-assets";
import NewCustomAssetModal from "src/components/dashboard/custom-assets/NewCustomAssetModal";

const CustomAsset: FC = () => {
    const { settings } = useSettings();
    const dispatch = useDispatch();
    const assets = useDebounceSelector((state) => selectAllAssets(state.customAssets));
    const [selectedCustomAssets, setSelectedCustomAssets] = useState<string[]>([]);
    const [newCustomAssetModalOpen, setNewCustomAssetModalOpen] = useState<boolean>(false);
    const [selectedMonths, setSelectedMonths] = useState<number>(12);

    const openNewCustomAssetModal = () => {
        setNewCustomAssetModalOpen(true);
    };

    const closeNewCustomAssetModal = () => {
        setNewCustomAssetModalOpen(false);
    };

    useEffect(() => {
        dispatch(getAssetsWithBalances());
    }, [dispatch]);

    const selectedCustomAssetChanged = (selected: string[]) => setSelectedCustomAssets(selected);
    const onCustomAssetDeleted = (asset: CustomAssetType) => dispatch(deleteAsset(asset.assetId));

    return (
        <>
            <Helmet>
                <title>Custom assets Overview</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    minHeight: "100%",
                    py: 8,
                }}
            >
                <Container maxWidth={settings.compact ? "xl" : false}>
                    <Grid container justifyContent="flex-end" spacing={3}>
                        <Grid item justifySelf="flex-start">
                            <Typography color="textPrimary" variant="h5">
                                Custom Assets
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
                                    Custom Assets
                                </Typography>
                            </Breadcrumbs>
                        </Grid>
                        <Grid item sx={{ flexGrow: 1 }} />
                        <Grid item>
                            <MonthSelector selectedMonths={selectedMonths} onSelectedMonthsChange={setSelectedMonths} />
                        </Grid>
                        <Grid item alignSelf="center">
                            <Button
                                color="primary"
                                // endIcon={<ChevronDownIcon fontSize="small" />}
                                sx={{ ml: 2 }}
                                variant="contained"
                                onClick={openNewCustomAssetModal}
                                size="large"
                            >
                                Add custom asset
                            </Button>
                        </Grid>
                    </Grid>
                    <Box sx={{ py: 3 }}>
                        <CustomAssetGraph
                            assets={assets}
                            selectedAssets={selectedCustomAssets}
                            selectedDuration={selectedMonths}
                            sx={{ height: "100%" }}
                        />
                    </Box>
                    <Box>
                        <CustomAssetTable
                            assets={assets}
                            onSelectionChange={selectedCustomAssetChanged}
                            onDeleteAsset={onCustomAssetDeleted}
                        />
                    </Box>
                </Container>
            </Box>
            <NewCustomAssetModal open={newCustomAssetModalOpen} onClose={closeNewCustomAssetModal} />
        </>
    );
};

export default CustomAsset;
