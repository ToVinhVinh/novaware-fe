import { Box, Grid, Paper, Typography } from "@material-ui/core";
import React from "react";
import { useGetRelatedProducts } from "../../hooks/api/useProduct";
import ProductCard from "./ProductCard";
import Loader from "../Loader";
import Message from "../Message";

const ProductRelated = ({ category = "", excludeId }) => {
  const { data: productRelatedResponse, isLoading: loading, error: queryError } = useGetRelatedProducts(
    category && excludeId ? { category, excludeId } : undefined
  );
  
  const products = productRelatedResponse?.data?.products || [];
  const error = queryError?.message || (queryError ? String(queryError) : null);
  return (
    <>
      <Box my={3}>
        <Typography variant="h4" align="center">
          Related Products
        </Typography>
      </Box>
      <Paper
        style={{ padding: "32px 20px", margin: "24px 0 50px" }}
        elevation={0}
      >
        <Grid container spacing={4}>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message>{error}</Message>
          ) : (
            <>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard {...product} />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Paper>
    </>
  );
};

export default ProductRelated;
