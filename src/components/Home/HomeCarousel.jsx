import React from "react";
import { Button } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../assets/scss/components/HomeCarousel.scss";

// Import banner images
import banner1 from "../../assets/images/banner1.png";
import banner2 from "../../assets/images/banner2.png";
import banner3 from "../../assets/images/banner3.png";
import banner4 from "../../assets/images/banner4.png";

const banners = [
  {
    id: 1,
    image: banner1,
    title: "New Collection",
    description: "Discover our latest fashion trends and styles",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    position: "left", // left, right, center, center-top
  },
  {
    id: 2,
    image: banner2,
    title: "Summer Sale",
    description: "Up to 50% off on selected items",
    buttonText: "Explore",
    buttonLink: "/shop",
    position: "center",
  },
  {
    id: 3,
    image: banner3,
    title: "Premium Quality",
    description: "Experience luxury with our premium collection",
    buttonText: "Learn More",
    buttonLink: "/shop",
    position: "right",
  },
  {
    id: 4,
    image: banner4,
    title: "Limited Edition",
    description: "Exclusive designs available for a limited time",
    buttonText: "View Collection",
    buttonLink: "/shop",
    position: "center-top",
  },
];

const HomeCarousel = () => {
  const getPositionClasses = (position) => {
    switch (position) {
      case "left":
        return "left-0 top-1/2 -translate-y-1/2 pl-10 md:pl-20 text-left items-start";
      case "right":
        return "right-0 top-1/2 -translate-y-1/2 pr-10 md:pr-20 text-right items-end";
      case "center":
        return "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center items-center";
      case "center-top":
        return "left-1/2 top-20 md:top-32 -translate-x-1/2 text-center items-center";
      default:
        return "left-0 top-1/2 -translate-y-1/2 pl-10 md:pl-20 text-left items-start";
    }
  };

  return (
    <div className="relative w-full h-screen">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet-custom",
          bulletActiveClass: "swiper-pagination-bullet-custom-active",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay - black/10 */}
              <div className="absolute inset-0 bg-black/10" />
              
              {/* Content */}
              <div
                className={`absolute flex flex-col ${getPositionClasses(
                  banner.position
                )} z-10 w-full md:w-auto px-4 md:px-0`}
              >
                <h2 className="font-sans font-black text-4xl md:text-6xl lg:text-7xl text-white mb-4 md:mb-6 drop-shadow-lg">
                  {banner.title}
                </h2>
                <p className="text-white text-sm md:text-lg lg:text-xl mb-6 md:mb-8 max-w-md drop-shadow-md">
                  {banner.description}
                </p>
                <RouterLink to={banner.buttonLink}>
                  <Button
                    variant="outlined"
                    size="large"
                    className="!border-white !text-white hover:!bg-white hover:!text-black !transition-all !duration-300 !font-semibold !px-6 !py-2"
                  >
                    {banner.buttonText}
                  </Button>
                </RouterLink>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeCarousel;
