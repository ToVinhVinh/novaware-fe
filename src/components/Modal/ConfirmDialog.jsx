import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    makeStyles,
} from "@material-ui/core";
import WarningIcon from "@material-ui/icons/Warning";

const useStyles = makeStyles((theme) => ({
    dialog: {
        "& .MuiDialog-paper": {
            borderRadius: 12,
            minWidth: 400,
        },
    },
    dialogTitle: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "24px 24px 16px 24px",
        "& .MuiTypography-root": {
            fontWeight: 600,
            fontSize: "1.25rem",
        },
    },
    icon: {
        color: theme.palette.warning.main,
        fontSize: 28,
    },
    dialogContent: {
        padding: "0 24px 24px 24px",
    },
    dialogActions: {
        padding: "8px 24px 24px 24px",
        gap: 12,
    },
    cancelButton: {
        borderRadius: 8,
        textTransform: "none",
        padding: "8px 24px",
    },
    confirmButton: {
        borderRadius: 8,
        textTransform: "none",
        padding: "8px 24px",
    },
}));

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmColor = "secondary",
    loading = false,
}) => {
    const classes = useStyles();

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            className={classes.dialog}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle className={classes.dialogTitle}>
                <WarningIcon className={classes.icon} />
                <Typography variant="h6">{title}</Typography>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="body1" color="textSecondary">
                    {message}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    className={classes.cancelButton}
                    disabled={loading}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color={confirmColor}
                    className={classes.confirmButton}
                    disabled={loading}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;

