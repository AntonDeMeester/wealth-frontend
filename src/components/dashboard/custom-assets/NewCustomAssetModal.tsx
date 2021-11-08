import type { FC } from "react";
import { Box, Button, Dialog, TextField } from "@material-ui/core";
import { useDispatch } from "../../../store";
import * as yup from "yup";
import { Formik } from "formik";
import { createAsset } from "src/slices/customAssets";
import moment from "moment";
import { NewCustomAsset } from "src/types/customAssets";

interface NewAssetModalProps {
    open: boolean;
    onClose?: () => void;
}

const NewAssetModal: FC<NewAssetModalProps> = (props) => {
    const dispatch = useDispatch();
    const { onClose, open, ...other } = props;

    const validationSchema = yup.object().shape({
        description: yup.string().required(),
        amount: yup.number().required().min(0),
        assetDate: yup.date().required().max(new Date()),
        currency: yup.string().required().default("EUR")
    });

    const onSubmit = async (values: NewCustomAsset, { setErrors, setStatus, setSubmitting }): Promise<void> => {
        const formattedAsset = {
            ...values,
            assetDate: moment(values.assetDate).format("YYYY-MM-DD"),
        };
        setSubmitting(true);
        try {
            dispatch(createAsset(formattedAsset));
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
                    initialValues={{ description: '', amount: null, assetDate: '', currency: "EUR" }}
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
                                label="Description"
                                margin="normal"
                                name="description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="text"
                                value={values.description}
                                variant="outlined"
                                helperText={touched.assetDate && errors.assetDate}
                                error={Boolean(touched.assetDate && errors.assetDate)}
                            />
                            <TextField
                                error={Boolean(touched.assetDate && errors.assetDate)}
                                fullWidth
                                helperText={touched.assetDate && errors.assetDate}
                                label="Purchase date"
                                margin="normal"
                                name="assetDate"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="date"
                                value={values.assetDate || ''}
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}  
                            />
                            <TextField
                                error={Boolean(touched.amount && errors.amount)}
                                fullWidth
                                helperText={touched.amount && errors.amount}
                                label="Amount (in EUR)"
                                margin="normal"
                                name="amount"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="number"
                                value={values.amount}
                                variant="outlined"
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
                                    Create asset
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

NewAssetModal.defaultProps = {
    open: false,
};

export default NewAssetModal;
