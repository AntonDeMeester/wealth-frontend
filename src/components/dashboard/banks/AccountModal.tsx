import type { FC } from "react";
import { Box, Button, Dialog, TextField, Switch, FormControlLabel } from "@mui/material";
import { useDispatch } from "../../../store";
import { Account, EditAccount } from "src/types/banking";
import * as yup from "yup";
import { Formik } from "formik";
import { editAccount } from "src/slices/banking";

interface AccountModalProps {
    account: Account;
    open: boolean;
    onClose?: () => void;
}

const AccountModal: FC<AccountModalProps> = (props) => {
    const dispatch = useDispatch();
    const { account, onClose, open, ...other } = props;

    const validationSchema = yup.object().shape({
        isActive: yup.boolean(),
        name: yup.string(),
        bankAlias: yup.string(),
    });

    const onSubmit = async (values: EditAccount, { setErrors, setStatus, setSubmitting }): Promise<void> => {
        setSubmitting(true);
        try {
            dispatch(editAccount(account.accountId, values));
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
                <Formik initialValues={account} validationSchema={validationSchema} onSubmit={onSubmit}>
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
                                autoFocus
                                error={Boolean(touched.name && errors.name)}
                                fullWidth
                                helperText={touched.name && errors.name}
                                label="Account name"
                                margin="normal"
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="text"
                                value={values.name}
                                variant="outlined"
                            />
                            <TextField
                                error={Boolean(touched.bankAlias && errors.bankAlias)}
                                fullWidth
                                helperText={touched.bankAlias && errors.bankAlias}
                                label="Bank name"
                                margin="normal"
                                name="bankAlias"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                type="text"
                                value={values.bankAlias}
                                variant="outlined"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        color="primary"
                                        name="isActive"
                                        checked={values.isActive}
                                        onChange={handleChange}
                                    />
                                }
                                label="Enabled"
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
                                    Edit account
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Dialog>
    );
};

AccountModal.defaultProps = {
    open: false,
};

export default AccountModal;
