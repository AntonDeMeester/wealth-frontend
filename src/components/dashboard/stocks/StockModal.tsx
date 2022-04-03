import type { FC } from "react";
import { Box, Button, Dialog, TextField } from "@mui/material";
import { useDispatch } from "../../../store";
import * as yup from "yup";
import { Formik } from "formik";
import { editPosition } from "src/slices/stocks";
import { EditStockPosition, StockPosition } from "src/types/stocks";

interface StockModalProps {
    position: StockPosition;
    open: boolean;
    onClose?: () => void;
}

const StockModal: FC<StockModalProps> = (props) => {
    const dispatch = useDispatch();
    const { position, onClose, open, ...other } = props;

    const validationSchema = yup.object().shape({
        amount: yup.number(),
        startDate: yup.date(),
        ticker: yup.string(),
    });

    const onSubmit = async (values: EditStockPosition, { setErrors, setStatus, setSubmitting }): Promise<void> => {
        setSubmitting(true);
        try {
            dispatch(editPosition(position.positionId, values));
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
                <Formik initialValues={position} validationSchema={validationSchema} onSubmit={onSubmit}>
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
                                label="Ticker name"
                                margin="normal"
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="text"
                                value={position?.ticker}
                                variant="outlined"
                                disabled
                            />
                            <TextField
                                autoFocus
                                error={Boolean(touched.startDate && errors.startDate)}
                                fullWidth
                                helperText={touched.startDate && errors.startDate}
                                label="Purchase date"
                                margin="normal"
                                name="startDate"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="text"
                                value={values.startDate}
                                variant="outlined"
                            />
                            <TextField
                                error={Boolean(touched.amount && errors.amount)}
                                fullWidth
                                helperText={touched.amount && errors.amount}
                                label="Amount (in stock units)"
                                margin="normal"
                                name="amount"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="number"
                                value={values.amount}
                                variant="outlined"
                            />
                            {/* {errors.submit && (
                                <Box sx={{ mt: 3 }}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Box>
                            )} */}
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    color="primary"
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                >
                                    Edit position
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

StockModal.defaultProps = {
    open: false,
};

export default StockModal;
