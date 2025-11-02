import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useGetTopProducts } from "../../hooks/api/useProduct";
import { Grid, Typography, Button } from "@material-ui/core";
import Loader from "../../components/Loader";
import Meta from "../../components/Meta";
import HomeCarousel from "../../components/Home/HomeCarousel";
import Container from "@material-ui/core/Container";
import HomeBanner from "../../components/Home/HomeBanner";
import ProductCard from "../../components/Product/ProductCard";
import ProductTabs from "../../components/Product/ProductTabs";
import HomeService from "../../components/Home/HomeService";
import Alert from "@material-ui/lab/Alert";

const HomeScreen = () => {
  const { data: productTopRatedResponse, isLoading: loadingProductTop, error: errorProductTop } = useGetTopProducts({ pageNumber: 1, perPage: 8 });
  
  const productTop = productTopRatedResponse?.data?.products || [];

  return (
    <>
      <Meta />
      <HomeCarousel />
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          component="h2"
          align="center"
          style={{ margin: "60px 0 30px" }}
        >
          Top Products
        </Typography>
        {loadingProductTop ? (
          <Loader />
        ) : errorProductTop ? (
          <Alert severity="error">{errorProductTop.message || String(errorProductTop)}</Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {productTop && productTop.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard {...product} />
                </Grid>
              ))}
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  flexBasis: "100%",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  component={RouterLink}
                  to="/shop?sort_by=rating"
                >
                  Discover More
                </Button>
              </Grid>
            </Grid>
            <HomeBanner />
            <ProductTabs />
          </>
        )}
      </Container>
      <HomeService />
    </>
  );
};

export default HomeScreen;
