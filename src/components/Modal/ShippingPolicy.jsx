import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const ShippingPolicy = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="policy-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="policy-dialog-title">
        <Typography variant="h6" component="span">
          Shipping Policy
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: 'absolute', color:"#f50057", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          NovaWare is committed to delivering fast and accurate shipping services for all orders.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Currently, novaware collaborates with the reputable shipping partner - GIAO HÀNG TIẾT KIỆM to support nationwide and international shipping with the following policies:
        </Typography>
        <Typography variant="h6" gutterBottom>
          Delivery Time:
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell><strong>For Da Nang City</strong></TableCell>
                <TableCell>Express delivery within 4h to 24h for pre-order items (Excludes Sundays and public holidays).</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><strong>For Other Provinces/City</strong></TableCell>
                <TableCell>Delivery within 3-4 days (Excludes Sundays and public holidays).</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body1" style={{ marginTop: 16 }}>
          Note: Delivery time may vary from 3-5 days during major sales events.
        </Typography>
        <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
          Delivery Attempts:
        </Typography>
        <Typography variant="body1" gutterBottom>
          - Shipper will attempt delivery a maximum of 3 times per order.
        </Typography>
        <Typography variant="body1" gutterBottom>
          - In cases of unsuccessful delivery, the shipper will reschedule for 2 more attempts. In total, you have up to 3 opportunities to receive your order.
        </Typography>
        <Typography variant="body1" gutterBottom>
          - <em>Note: In case of unforeseen circumstances such as natural disasters or significant external events, delivery times may change without prior notice.</em>
        </Typography>
        <Typography variant="h6" gutterBottom style={{ marginTop: 16 }}>
          Order Status Tracking:
        </Typography>
        <Typography variant="body1" gutterBottom>
          You can check the status of your order directly via the "My Orders" section. Alternatively, you can contact Levents® customer service through our Fanpage, Instagram, or hotline.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingPolicy;
