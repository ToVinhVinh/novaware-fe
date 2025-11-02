import React from "react";
import { Button } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useGetContentSections } from "../../hooks/api/useContentSection";

const HomeCarousel = () => {
  const { data: carouselsResponse, isLoading: loading, error: queryError } = useGetContentSections({ type: "carousel" });
  
  const carousels = carouselsResponse?.data?.contentSections || [];
  const error = queryError?.message || (queryError ? String(queryError) : null);

  if (loading) {
    return <div>Loading carousels...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const carousel = carousels && carousels.length > 0 ? carousels[0] : null;

  if (!carousel) {
    return <div>No carousel found.</div>;
  }

  return (
    <div className="home-carousel">
      <Carousel
        autoPlay
        interval={3000} // 5 giây
        infiniteLoop // Cho phép quay lại ảnh đầu
        showIndicators={true} // Hiển thị chấm tròn
        showArrows={true}
        swipeable={true} // Cho phép vuốt (nếu cần trên mobile)
        showThumbs={false}
        showStatus={false}
        animationHandler="fade"
      >
        {carousel.images.map((image, index) => (
          <div className="carousel__slide" key={index}>
            <img src={image} alt="" className="carousel__img" />
            <div className="carousel__banner carousel__banner--left">
              <div className="banner__subtitle">{carousel.subtitle}</div>
              <h2 className="banner__title">{carousel.title}</h2>
              <RouterLink to={carousel.button_link || "/shop"}>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  className="banner__link"
                >
                  {carousel.button_text || "Shop Now"}
                </Button>
              </RouterLink>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default HomeCarousel;
