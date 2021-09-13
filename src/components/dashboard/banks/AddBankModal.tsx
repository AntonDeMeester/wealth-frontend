import type { FC } from "react";
import { Box, Button, Dialog, TextField } from "@material-ui/core";
import * as yup from "yup";
import { Formik } from "formik";
import bankService from "src/services/bankService";

interface AddBankModalProps {
    onClose?: () => void;
    open: boolean;
}

interface TinkForm {
    market: string;
    test: string;
}

const AddBankModal: FC<AddBankModalProps> = ({ onClose, open }) => {
    const validationSchema = yup.object().shape({
        market: yup.string().default("SE"),
        test: yup.string().default("false"),
    });

    const markets = [
        { name: "Sweden", value: "SE" },
        { name: "Belgium", value: "BE" },
    ];
    const testOptions = [
        { name: "On", value: "true" },
        { name: "Off", value: "false" },
    ];
    const initialValue = { market: "", test: "" };

    const getTinkLink = async ({ market, test }: TinkForm) => {
        const response = await bankService.getTinkLink({ market, test: test === "true" ? test : undefined });
        if (response?.data?.url) {
            window.location.href = response?.data?.url;
        }
    };

    const onSubmit = async (values: TinkForm, { setErrors, setStatus, setSubmitting }): Promise<void> => {
        setSubmitting(true);
        try {
            getTinkLink(values);
        } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
        }
    };

    return (
        <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    py: 8,
                    px: 8,
                }}
            >
                <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values,
                    }): JSX.Element => (
                        <form noValidate onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Country"
                                name="market"
                                margin="normal"
                                select
                                SelectProps={{ native: true }}
                                onChange={handleChange}
                                value={values.market}
                                variant="outlined"
                            >
                                {markets.map((market) => (
                                    <option key={market.value} value={market.value}>
                                        {market.name}
                                    </option>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                label="Test Enabled"
                                name="test"
                                margin="normal"
                                select
                                SelectProps={{ native: true }}
                                onChange={handleChange}
                                value={values.test}
                                variant="outlined"
                            >
                                {testOptions.map((test) => (
                                    <option key={test.value} value={test.value}>
                                        {test.name}
                                    </option>
                                ))}
                            </TextField>
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
                                    Add account
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Dialog>
    );
};

AddBankModal.defaultProps = {
    open: false,
};

export default AddBankModal;
