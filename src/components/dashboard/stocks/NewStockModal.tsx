import type { FC } from "react";
import { Box, Button, Dialog, TextField } from "@material-ui/core";
import { useDispatch } from "../../../store";
import * as yup from "yup";
import { Formik } from "formik";
import { createPosition } from "src/slices/stocks";
import { NewStockPosition, TickerSearchItem } from "src/types/stocks";
import moment from "moment";

interface NewStockModalProps {
    searchTicker: TickerSearchItem;
    open: boolean;
    onClose?: () => void;
}

const NewStockModal: FC<NewStockModalProps> = (props) => {
    const dispatch = useDispatch();
    const { searchTicker, onClose, open, ...other } = props;

    const validationSchema = yup.object().shape({
        amount: yup.number().required().min(0),
        startDate: yup.date().required().max(new Date()),
        ticker: yup.string(),
    });

    const onSubmit = async (values: NewStockPosition, { setErrors, setStatus, setSubmitting }): Promise<void> => {
        const formattedPosition = {
            ...values,
            startDate: moment(values.startDate).format("YYYY-MM-DD"),
            ticker: searchTicker?.ticker,
        };
        setSubmitting(true);
        try {
            dispatch(createPosition(formattedPosition));
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
                    py: 2,
                    px: 2,
                }}
            >
                <Formik
                    initialValues={{ ticker: searchTicker.ticker, startDate: "", amount: 0 }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
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
                                value={searchTicker?.ticker}
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
                                type="date"
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
                                    Create position
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

NewStockModal.defaultProps = {
    open: false,
};

export default NewStockModal;
