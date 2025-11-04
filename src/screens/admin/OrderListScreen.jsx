import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetOrders } from "../../hooks/api/useOrder";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@material-ui/data-grid";
import { AiOutlineSearch } from "react-icons/ai";
import { makeStyles } from "@material-ui/core/styles";
import { BiCommentDetail } from "react-icons/bi";
import Meta from "../../components/Meta";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(-10),
    marginBottom: 24,
  },
  button: {
    padding: "6px 0",
    minWidth: "50px",
    "& .MuiButton-startIcon": {
      margin: 0,
    },
  },
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
  },
  dataGrid: {
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
  },
}));

const OrderListScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [keyword, setKeyword] = useState("");

  const userInfo = useSelector((state) => state.userLogin?.userInfo);

  const { data: ordersResponse, isLoading: loading, error } = useGetOrders();
  const ordersData = ordersResponse?.data?.orders || [];
  const orders = ordersData.map((order) => ({ ...order, id: order._id }));

  const columns = [
    { field: "_id", headerName: "ID", width: 240 },
    {
      field: "user",
      headerName: "User",
      width: 130,
      valueFormatter: (params) => params.row?.user?.name,
    },
    {
      field: "updatedAt",
      headerName: "Date",
      width: 120,
      align: "left",
      headerAlign: "left",
      valueFormatter: (params) => params.value?.substring(0, 10),
    },
    {
      field: "totalPrice",
      headerName: "Total",
      width: 130,
      align: "left",
      headerAlign: "left",
      type: "number",
    },
    {
      field: "isPaid",
      headerName: "Paid",
      headerAlign: "center",
      width: 105,
      type: "boolean",
    },
    {
      field: "isDelivered",
      headerName: "Delivered",
      width: 136,
      type: "boolean",
    },
    {
      field: "isProcessing",
      headerName: "Confỉmed",
      width: 136,
      type: "boolean",
    },
    {
      field: "isCancelled",
      headerName: "Cancelled",
      width: 138,
      type: "boolean",
      headerClassName: "cancelled-header",
    },
    {
      field: "detail",
      align: "center",
      headerAlign: "center",
      headerName: "Detail",
      sortable: false,
      width: 90,
      renderCell: (params) => {
        const id = params.getValue(params.id, "_id") || "";
        return (
          <Button
            variant="contained"
            color="primary"
            startIcon={<BiCommentDetail />}
            className={classes.button}
            component={RouterLink}
            to={`/admin/order/${id}`}
          />
        );
      },
    },
  ];

  const handleSearchChange = (event) => {
    setKeyword(event.target.value);
  };

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }
  }, [history, userInfo]);

  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Dashboard | Orders" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            style={{ textAlign: "center" }}
          >
            Order Management
          </Typography>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="space-between" width="100%" mb={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search orders by ID..."
          value={keyword}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AiOutlineSearch />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {loading ? (
        <Loader></Loader>
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <Grid container>
          <Grid
            item
            xs={12}
            component={Paper}
            className={classes.dataGrid}
            elevation={0}
          >
            <DataGrid
              rows={orders}
              columns={columns}
              pageSize={10}
              autoHeight
              components={{
                Toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport />
                  </GridToolbarContainer>
                ),
              }}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default OrderListScreen;
