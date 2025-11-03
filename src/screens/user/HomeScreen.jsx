import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useGetTopProducts } from "../../hooks/api/useProduct";
import { Button } from "@material-ui/core";
import Loader from "../../components/Loader";
import Meta from "../../components/Meta";
import HomeCarousel from "../../components/Home/HomeCarousel";
import HomeBanner from "../../components/Home/HomeBanner";
import ProductCard from "../../components/Product/ProductCard";
import ProductTabs from "../../components/Product/ProductTabs";
import HomeService from "../../components/Home/HomeService";

const HomeScreen = () => {
  const { data: productTopRatedResponse, isLoading: loadingProductTop, error: errorProductTop } = useGetTopProducts({ pageNumber: 1, perPage: 5 });
  
  const productTop = productTopRatedResponse?.data?.products || [];

  return (
    <>
      <Meta />
      <HomeCarousel />
      <div className="mx-auto px-16">
        <h2 className="my-16 mb-8 text-center text-4xl font-normal leading-[1.235]">
          Top Products
        </h2>
        {loadingProductTop ? (
          <Loader />
        ) : errorProductTop ? (
          <div className="p-4 mb-4 bg-red-50 text-red-700 rounded border border-red-300">
            {errorProductTop.message || String(errorProductTop)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">
              {productTop && productTop.map((product) => (
                <div key={product._id}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
            <div className="flex justify-center my-8">
              <Button
                variant="contained"
                color="secondary"
                component={RouterLink}
                to="/shop?sort_by=rating"
              >
                Discover More
              </Button>
            </div>
            <HomeBanner />
            <ProductTabs />
          </>
        )}
      </div>
      <HomeService />
    </>
  );
};

export default HomeScreen;
