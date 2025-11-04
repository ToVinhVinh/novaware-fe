import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Link,
  makeStyles,
} from "@material-ui/core";
import { FaTimes } from "react-icons/fa";
import Message from "../Message";
import Loader from "../Loader";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 20,
    minHeight: 500,
    border: `1px solid ${theme.palette.divider}`,
  },
}));

const OrdersContent = ({ orders, loadingOrders, errorOrders }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.paper} elevation={0}>
      <Typography variant="h5" style={{ marginBottom: 24 }}>
        My Orders
      </Typography>
      {loadingOrders ? (
        <Loader />
      ) : errorOrders ? (
        <Message>{errorOrders}</Message>
      ) : !orders.length ? (
        <Message mt={8} severity="info">
          You haven't placed any orders yet.{" "}
          <Link component={RouterLink} to="/">
            Shop now!
          </Link>
        </Message>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Total&nbsp;($)</TableCell>
              <TableCell align="right">Paid</TableCell>
              <TableCell align="right">Delivered</TableCell>
              <TableCell align="right">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell component="th" scope="order">
                  {order._id}
                </TableCell>
                <TableCell align="right">
                  {order.createdAt?.substring(0, 10)}
                </TableCell>
                <TableCell align="right">{order.totalPrice}</TableCell>
                <TableCell align="right">
                  {order.paidAt ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes color="red" />
                  )}
                </TableCell>
                <TableCell align="right">
                  {order.deliveredAt ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes color="red" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    size="small"
                    component={RouterLink}
                    to={`/order/${order._id}`}
                    color="secondary"
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default OrdersContent;

