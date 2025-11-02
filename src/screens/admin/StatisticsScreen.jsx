import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetOrders } from "../../hooks/api/useOrder";
import { useGetProducts } from "../../hooks/api/useProduct";
import { Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import {
  format,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  subDays,
  subMonths,
  isSameDay,
  parseISO,
} from "date-fns";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Meta from "../../components/Meta";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import ProductStatistics from "../../components/Statistics/ProductStatistics";
import OrderStatistics from "../../components/Statistics/OrderStatistics";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(-10),
    marginBottom: 24,
  },
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  statsContainer: {
    marginBottom: theme.spacing(4),
  },
  chartContainer: {
    width: "100%",
    height: 300,
  },
  toggleButtonGroup: {
    marginBottom: theme.spacing(2),
  },
  formControl: {
    width: "150px",
  },
  datePicker: {
    marginBottom: theme.spacing(2),
  },
}));

const OrderStatsScreen = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [dailyStats, setDailyStats] = useState({ count: 0, revenue: 0 });
  const [monthlyStats, setMonthlyStats] = useState({ count: 0, revenue: 0 });
  const [chartData, setChartData] = useState({
    dailyOrderCount: [],
    dailyRevenue: [],
    monthlyOrderCount: [],
    monthlyRevenue: [],
  });
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedView, setSelectedView] = useState("order");
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [totalStockSold, setTotalStockSold] = useState(0);
  const [numProductsSold, setNumProductsSold] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateOrderCount, setSelectedDateOrderCount] = useState(0);
  const [selectedDateRevenue, setSelectedDateRevenue] = useState(0);

  // States for Order Summary
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalDeliveredOrders, setTotalDeliveredOrders] = useState(0);
  const [totalCancelledOrders, setTotalCancelledOrders] = useState(0);
  const [averageDailyRevenue, setAverageDailyRevenue] = useState(0);

  // States for daily and monthly cancelled orders
  const [dailyCancelled, setDailyCancelled] = useState(0);
  const [monthlyCancelled, setMonthlyCancelled] = useState(0);

  const userInfo = useSelector((state) => state.userLogin?.userInfo);
  
  const { data: ordersResponse, isLoading: loadingOrders, error: errorOrders } = useGetOrders();
  const orders = ordersResponse?.data?.orders || [];
  
  const { data: productsResponse, isLoading: loadingProducts } = useGetProducts({ option: 'all' });
  const products = productsResponse?.data?.products || [];
  
  const loading = loadingOrders || loadingProducts;
  const error = errorOrders;

  const calculateOrderStats = useCallback(() => {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const startOfThisMonth = startOfMonth(today);
    const endOfThisMonth = endOfMonth(today);

    let dailyCount = 0;
    let dailyRevenue = 0;
    let monthlyCount = 0;
    let monthlyRevenue = 0;
    let dailyCancelledCount = 0;
    let monthlyCancelledCount = 0;

    const filteredOrders = orders.filter((order) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "delivered") return order.isDelivered;
      if (filterStatus === "pending") return !order.isDelivered;
      return true;
    });

    filteredOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      // Assuming you have a field to indicate cancelled orders, e.g., order.isCancelled
      if (order.isCancelled) {
        if (orderDate >= startOfToday && orderDate <= endOfToday) {
          dailyCancelledCount++;
        }
        if (orderDate >= startOfThisMonth && orderDate <= endOfThisMonth) {
          monthlyCancelledCount++;
        }
      } else {
        if (orderDate >= startOfToday && orderDate <= endOfToday) {
          dailyCount++;
          dailyRevenue += order.totalPrice;
        }
        if (orderDate >= startOfThisMonth && orderDate <= endOfThisMonth) {
          monthlyCount++;
          monthlyRevenue += order.totalPrice;
        }
      }
    });

    setDailyStats({ count: dailyCount, revenue: dailyRevenue });
    setMonthlyStats({ count: monthlyCount, revenue: monthlyRevenue });
    setDailyCancelled(dailyCancelledCount);
    setMonthlyCancelled(monthlyCancelledCount);
  }, [orders, filterStatus]);

  const prepareChartData = useCallback(() => {
    const today = new Date();
    const past7Days = Array.from({ length: 7 }, (_, i) => subDays(today, i));
    const past6Months = Array.from({ length: 6 }, (_, i) =>
      subMonths(today, i)
    );

    const filteredOrders = orders.filter((order) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "delivered") return order.isDelivered;
      if (filterStatus === "pending") return !order.isDelivered;
      return true;
    });

    const dailyOrderCountData = past7Days.map((day) => {
      const start = startOfDay(day);
      const end = endOfDay(day);
      const count = filteredOrders.filter(
        (order) =>
          new Date(order.createdAt) >= start && new Date(order.createdAt) <= end
      ).length;
      return {
        name: format(day, "dd/MM"),
        "Order Count": count,
      };
    });

    const dailyRevenueData = past7Days.map((day) => {
      const start = startOfDay(day);
      const end = endOfDay(day);
      const revenue = filteredOrders
        .filter(
          (order) =>
            new Date(order.createdAt) >= start &&
            new Date(order.createdAt) <= end
        )
        .reduce((sum, order) => sum + order.totalPrice, 0);
      return {
        name: format(day, "dd/MM"),
        Revenue: revenue,
      };
    });

    const monthlyOrderCountData = past6Months.map((month) => {
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      const count = filteredOrders.filter(
        (order) =>
          new Date(order.createdAt) >= start && new Date(order.createdAt) <= end
      ).length;
      return {
        name: format(month, "MM/yyyy"),
        "Order Count": count,
      };
    });

    const monthlyRevenueData = past6Months.map((month) => {
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      const revenue = filteredOrders
        .filter(
          (order) =>
            new Date(order.createdAt) >= start &&
            new Date(order.createdAt) <= end
        )
        .reduce((sum, order) => sum + order.totalPrice, 0);
      return {
        name: format(month, "MM/yyyy"),
        Revenue: revenue,
      };
    });

    setChartData({
      dailyOrderCount: dailyOrderCountData.reverse(),
      dailyRevenue: dailyRevenueData.reverse(),
      monthlyOrderCount: monthlyOrderCountData.reverse(),
      monthlyRevenue: monthlyRevenueData.reverse(),
    });
  }, [orders, filterStatus]);

  const calculateProductStats = useCallback(() => {
    const calculatedTotalStockSold = orders.reduce(
      (sum, order) =>
        sum + order.orderItems.reduce((itemSum, item) => itemSum + item.qty, 0),
      0
    );
    setTotalStockSold(calculatedTotalStockSold);

    let calculatedTotalProducts = 0;
    let calculatedTotalStock = 0;
    products.forEach((product) => {
      calculatedTotalProducts++;
      calculatedTotalStock += product.countInStock;
    });

    setTotalProducts(calculatedTotalProducts);
    setTotalStock(calculatedTotalStock);

    const uniqueProductIdsSold = new Set();
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        uniqueProductIdsSold.add(item.product);
      });
    });
    setNumProductsSold(uniqueProductIdsSold.size);
  }, [orders, products]);

  const calculateSelectedDateStats = useCallback(() => {
    if (selectedDate) {
      const startOfSelectedDate = startOfDay(selectedDate);

      let selectedDateCount = 0;
      let selectedDateRevenue = 0;

      const filteredOrders = orders.filter((order) => {
        if (filterStatus === "all") return true;
        if (filterStatus === "delivered") return order.isDelivered;
        if (filterStatus === "pending") return !order.isDelivered;
        return true;
      });

      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        if (isSameDay(orderDate, startOfSelectedDate)) {
          selectedDateCount++;
          selectedDateRevenue += order.totalPrice;
        }
      });

      setSelectedDateOrderCount(selectedDateCount);
      setSelectedDateRevenue(selectedDateRevenue);
    } else {
      setSelectedDateOrderCount(0);
      setSelectedDateRevenue(0);
    }
  }, [orders, filterStatus, selectedDate]);

  const calculateTotalOrderStats = useCallback(() => {
    setTotalOrders(orders.length);
    setTotalDeliveredOrders(orders.filter((order) => order.isDelivered).length);
    setTotalCancelledOrders(
      orders.filter((order) => order.isCancelled).length
    );

    if (orders.length > 0) {
      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0
      );
      const oldestOrderDate = new Date(
        orders.reduce(
          (minDate, order) =>
            new Date(order.createdAt) < minDate
              ? new Date(order.createdAt)
              : minDate,
          new Date()
        )
      );
      const daysSinceStart = Math.max(
        1,
        Math.floor(
          (new Date() - oldestOrderDate) / (1000 * 60 * 60 * 24)
        ) + 1
      );
      setAverageDailyRevenue(totalRevenue / daysSinceStart);
    } else {
      setAverageDailyRevenue(0);
    }
  }, [orders]);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  useEffect(() => {
    if (orders.length > 0) {
      calculateOrderStats();
      prepareChartData();
      calculateSelectedDateStats();
      calculateTotalOrderStats();
    }
  }, [
    orders,
    calculateOrderStats,
    prepareChartData,
    calculateSelectedDateStats,
    calculateTotalOrderStats,
  ]);

  useEffect(() => {
    if (orders.length > 0 && products.length > 0) {
      calculateProductStats();
    }
  }, [orders, products, calculateProductStats]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setSelectedView(newView);
    }
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(parseISO(event.target.value));
  };

  return (
    <Container maxWidth="xl" className={classes.container}>
      <Meta title="Dashboard | Statistics" />
      <Grid container className={classes.breadcrumbsContainer}>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            style={{ textAlign: "center" }}
          >
            Statistics
          </Typography>

          <ToggleButtonGroup
            className={classes.toggleButtonGroup}
            value={selectedView}
            exclusive
            onChange={handleViewChange}
            aria-label="statistics view selection"
          >
            <ToggleButton value="order" aria-label="order statistics">
              Order Statistics
            </ToggleButton>
            <ToggleButton value="product" aria-label="product statistics">
              Product Statistics
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message severity="error">{error}</Message>
      ) : (
        <Grid container spacing={3}>
          {/* Order Statistics View */}
          {selectedView === "order" && (
            <OrderStatistics
              dailyStats={dailyStats}
              monthlyStats={monthlyStats}
              chartData={chartData}
              filterStatus={filterStatus}
              handleFilterChange={handleFilterChange}
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
              selectedDateOrderCount={selectedDateOrderCount}
              selectedDateRevenue={selectedDateRevenue}
              totalOrders={totalOrders}
              totalDeliveredOrders={totalDeliveredOrders}
              totalCancelledOrders={totalCancelledOrders}
              averageDailyRevenue={averageDailyRevenue}
              dailyCancelled={dailyCancelled}
              monthlyCancelled={monthlyCancelled}
              orders={orders}
            />
          )}

          {/* Product Statistics View */}
          {selectedView === "product" && (
            <ProductStatistics
              totalProducts={totalProducts}
              numProductsSold={numProductsSold}
              totalStock={totalStock}
              totalStockSold={totalStockSold}
              products={products}
              orders={orders}
            />
          )}
        </Grid>
      )}
    </Container>
  );
};

export default OrderStatsScreen;