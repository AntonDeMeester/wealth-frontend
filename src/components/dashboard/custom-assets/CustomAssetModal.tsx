import type { FC } from "react";
import { Box, Button, Dialog, Divider, IconButton, TextField } from "@mui/material";
import { useDispatch } from "../../../store";
import * as yup from "yup";
import { Formik, FieldArray } from "formik";
import { deleteAssetEvent, editAsset, putAssetEvent } from "src/slices/customAssets";
import { CustomAsset, EditCustomAsset } from "src/types/customAssets";
import Trash from "src/icons/Trash";

interface CustomAssetModalProps {
    asset: CustomAsset;
    open: boolean;
    onClose?: () => void;
}

const CustomAssetModal: FC<CustomAssetModalProps> = (props) => {
    const dispatch = useDispatch();
    const { asset, onClose, open, ...other } = props;

    const validationSchema = yup.object().shape({
        description: yup.string(),
        currency: yup.string().default("EUR"),
        events: yup.array().of(
            yup.object().shape({
                date: yup.date().required().max(new Date()),
                amount: yup.number().required().min(0),
            })
        ).min(1, "Need at least one item").required(),
    });

    const onSubmit = async (values: EditCustomAsset, { setErrors, setStatus, setSubmitting }): Promise<void> => {
        setSubmitting(true);
        const newEventDates = values.events.map(event => event.date)
        try {
            asset.events?.forEach(oldEvent => {
                if(!newEventDates.includes(oldEvent.date)) {
                    dispatch(deleteAssetEvent(asset.assetId, oldEvent))
                }
            })
            values.events?.map((event) => dispatch(putAssetEvent(asset.assetId, event)));
            dispatch(editAsset(asset.assetId, values));
            setStatus({ success: true });
            setSubmitting(false);
            onClose();
        } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    };

    return (
        <Dialog fullWidth maxWidth="md" onClose={onClose} open={open} {...other}>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    py: 8,
                    px: 8,
                }}
            >
                <Formik initialValues={asset} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values,
                    }): JSX.Element => (
                        <form noValidate onSubmit={handleSubmit} {...props}>
                            <TextField
                                fullWidth
                                error={Boolean(touched.description && errors.description)}
                                helperText={touched.description && errors.description}
                                label="Description"
                                margin="normal"
                                name="description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="text"
                                value={values?.description}
                                variant="outlined"
                            />
                            <Divider />
                            <FieldArray
                                name="events"
                                render={(arrayHelpers) => (
                                    <div>
                                        {values?.events?.map((event, i) => (
                                            <Box key={i} sx={{ pl: 0, alignItems: "center", display: "flex" }}>
                                                <TextField
                                                    label="Date"
                                                    name={`events[${i}].date`}
                                                    value={event.date}
                                                    type="date"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    // error={Boolean(touched.events?.[i]?.date )}
                                                    // helperText={touched.events?.[i]?.date }
                                                    margin="normal"
                                                    style={{ marginRight: "16px" }}
                                                    InputLabelProps={{ shrink: true }}
                                                />
                                                <TextField
                                                    label="Amount"
                                                    name={`events[${i}].amount`}
                                                    value={event.amount}
                                                    type="number"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    variant="outlined"
                                                    // error={Boolean(touched.events?.[i]?.amount)}
                                                    // helperText={touched.events?.[i]?.amount}
                                                    margin="normal"
                                                />
                                                <IconButton onClick={() => arrayHelpers.remove(i)}>
                                                    <Trash fontSize="large" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                        <Button
                                            color="primary"
                                            disabled={isSubmitting}
                                            size="medium"
                                            type="submit"
                                            variant="outlined"
                                            onClick={() => arrayHelpers.push({amount: 0, date: ''})}
                                            sx={{ mt: "8px" }}
                                        >
                                            Add event
                                        </Button>
                                    </div>
                                )}
                            />
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    color="primary"
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                >
                                    Edit asset
                                </Button>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    color="secondary"
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    onClick={() => onClose()}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Dialog>
    );
};

CustomAssetModal.defaultProps = {
    open: false,
};

export default CustomAssetModal;
