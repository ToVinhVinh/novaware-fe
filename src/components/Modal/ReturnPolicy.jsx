import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const ReturnPolicy = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="policy-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="policy-dialog-title">
        <Typography variant="h6" component="span">
          Return & Exchange Policy
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          1. Conditions for Exchange (Applicable throughout the Levents® system):
        </Typography>
        <Typography variant="body1" gutterBottom>
          - Exchange is applicable for all products if the product remains in its original condition with tags, unused, and undamaged.<br />
          - Only one exchange is allowed per order. The exchanged product must have an equivalent or higher value. Please pay the price difference if applicable.<br />
          - For refunds caused by order issues, we will process the refund within 48 working hours after receiving your request.
        </Typography>
        <TableContainer component={Paper} style={{ marginTop: 16 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell><strong>For Clothing Products</strong></TableCell>
                <TableCell>Exchange period: 14 days from the date the customer receives the parcel.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>For Accessories</strong></TableCell>
                <TableCell>Exchange period: 30 days from the date the customer receives the parcel.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body1" style={{ marginTop: 16 }}>
          Note:<br />
          - If the product is missing its tag, you must provide feedback within 1 day after receipt. Beyond this time, we will not process the exchange.<br />
          - Please provide clear evidence (photos, videos) of the issue for us to validate your exchange request.
        </Typography>
        <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
          2. On-Site Exchange Service:
        </Typography>
        <Typography variant="body1" gutterBottom>
          - This service allows a shipper to visit your address for the exchange.<br />
          - Only one on-site exchange is allowed per order.
        </Typography>
        <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
          3. Shipping Fees:
        </Typography>
        <Typography variant="body1" gutterBottom>
          a. Shipping fees supported by NovaWare:
        </Typography>
        <TableContainer component={Paper} style={{ marginTop: 8 }}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell><strong>Size mismatch</strong></TableCell>
                <TableCell>100% shipping fee covered.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Exchange for a different product</strong></TableCell>
                <TableCell>Support 1-way shipping fee.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>Faulty product</strong></TableCell>
                <TableCell>Support 2-way shipping fee.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body1" style={{ marginTop: 16 }}>
          b. Shipping fees not covered by NovaWare:<br />
          - For discounted or promotional items, customers are responsible for the shipping fees.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnPolicy;
