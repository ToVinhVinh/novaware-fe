import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import AddShoppingCartOutlinedIcon from "@material-ui/icons/AddShoppingCartOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import { RiShoppingBag3Fill } from "react-icons/ri";
import Tooltip from "@material-ui/core/Tooltip";
import ProductModalView from "./ProductModalView";
import { addToCart, setOpenCartDrawer } from "../../actions/cartActions";
import { useDispatch } from "react-redux";

const ProductCard = (props) => {
  const {
    _id,
    id,
    slug,
    productId: incomingProductId,
    name,
    productDisplayName,
    images,
    price,
    sale,
    variants,
    rating,
    baseColour,
    articleType
  } = props;

  const productId = _id ?? id ?? incomingProductId ?? slug ?? "";
  const displayName = productDisplayName || name || "Product";
  const [openModal, setOpenModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const variant = variants && variants.length > 0 ? variants[0] : null;

  const basePrice = variant?.price || price || 50; // fallback price
  const finalPrice = basePrice * (1 - (sale || 0) / 100);

  const handleAddToCart = (e, idToAdd) => {
    e.stopPropagation();
    e.preventDefault();
    if (!idToAdd) {
      return;
    }
    dispatch(setOpenCartDrawer(true));
    dispatch(addToCart(idToAdd, 1, variant?.size || "M", variant?.color || ""));
  };
  const handleOpenQuickView = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenModal(true);
  };


  return (
    <>
      <motion.div
        className="group shadow-md h-full bg-white border border-pink-500 rounded-xl overflow-hidden transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <RouterLink
          to={productId ? `/product?id=${productId}` : '#'}
          className="flex h-full flex-col"
          onClick={(e) => {
            if (!productId) {
              e.preventDefault();
            }
          }}
        >
          {/* Image Container with proper aspect ratio */}
          <div className="relative w-full pb-[100%] -mb-10 overflow-hidden bg-gray-50 transition-all duration-300 ease-in-out z-0">
            {sale > 0 && (
              <div className="absolute top-3 left-3 z-20 bg-pink-600 px-2 py-1 text-xs font-semibold uppercase text-white">
                -{Math.round(sale)}%
              </div>
            )}

            <div className="absolute top-3 left-16 z-20 bg-pink-600 px-2 py-1 text-xs font-semibold uppercase text-white">
              {articleType}
            </div>

            {/* Placeholder or Images */}
            {images && images.length > 0 ? (
              <>
                {/* Back Image */}
                {images[1] && (
                  <motion.img
                    className="absolute inset-0 h-full w-full object-contain hover:scale-110 transition-all duration-300 ease-in-out"
                    src={images[1]}
                    alt={`${displayName} - back view`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />
                )}

                {/* Front Image with fade on hover */}
                <motion.img
                  className="absolute inset-0 h-full w-full object-contain bg-white hover:scale-110 transition-all duration-300 ease-in-out"
                  src={images[0]}
                  alt={displayName}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isHovered && images[1] ? 0 : 1 }}
                  transition={{ duration: 0.4 }}
                />
              </>
            ) : (
              /* Placeholder when no images */
              <motion.img
                className="absolute inset-0 h-full w-full object-contain bg-white hover:scale-110 transition-all duration-300 ease-in-out"
                src="https://www.lwf.org/images/emptyimg.png"
                alt="No Image Available"
                initial={{ opacity: 1 }}
                animate={{ opacity: isHovered && images[1] ? 0 : 1 }}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-1 flex-col p-3 bg-primary-gradient rounded-t-xl relative z-10">
            <Tooltip title={displayName || ""} arrow>
              <h3 className="line-clamp-2 text-base font-light leading-6 text-white">
                {displayName}
              </h3>
            </Tooltip>

            {/* Rating display */}
            {rating && (
              <div className="flex items-center gap-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span style={{ fontSize: "24px" }} key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-white/80">({rating})</span>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  ${finalPrice.toFixed(2)}
                </span>
                {sale > 0 && (
                  <span className="text-base italic text-white/70 line-through">
                    ${basePrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="w-full md:hidden">
                <button
                  onClick={(e) => handleAddToCart(e, productId)}
                  className="mt-2 w-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 active:scale-95"
                >
                  <span className="flex items-center justify-center gap-2">
                    <RiShoppingBag3Fill />
                    Add to Cart
                  </span>
                </button>
              </div>
            </div>
            {/* Desktop Action Buttons */}
            <div
              className="grid grid-cols-2 gap-2 mt-2"
            >
              <button
                onClick={handleOpenQuickView}
                className="h-10 flex items-center gap-2 justify-center border border-white text-white hover:bg-pink-600"
              >
                <VisibilityOutlinedIcon fontSize="small" className="text-white" />
                View
              </button>
              <button
                onClick={(e) => handleAddToCart(e, productId)}
                className="h-10 flex items-center gap-2 justify-center border border-white text-white hover:bg-pink-600"
              >
                <AddShoppingCartOutlinedIcon fontSize="small" className="text-white" />
                Add
              </button>
            </div>
          </div>
        </RouterLink>
      </motion.div>
      <ProductModalView
        {...props}
        _id={productId || _id}
        productId={productId || _id}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};

export default ProductCard;
