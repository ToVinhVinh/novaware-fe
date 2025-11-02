import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { FiShoppingBag } from "react-icons/fi";
import { FaTags, FaShareAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import {
  Box,
  Button,
  IconButton,
  Chip,
  Divider,
  Typography,
  MenuItem,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Link from "@material-ui/core/Link";
import Rating from "@material-ui/lab/Rating";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import ShareButtons from "../ShareButtons.jsx";
import ShippingPolicy from "../Modal/ShippingPolicy.jsx";
import ReturnPolicy from "../Modal/ReturnPolicy.jsx";
import UpdateProfileModal from "../Modal/UpdateProfileModal.jsx";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  price: {
    fontSize: "1.6rem",
    fontWeight: 600,
    color: (props) => props.sale > 0 && "#f50057",
  },
  rootPrice: {
    fontSize: "1.3rem",
    textDecoration: "line-through",
  },
  description: {
    whiteSpace: "pre-wrap",
    fontSize: 15,
    color: theme.palette.text.secondary,
  },
  sizeFormControl: {
    margin: "20px 0 25px",
  },
  colorFormControl: {
    margin: "0px 0 25px",
  },
  sizeFormGroup: {
    flexDirection: "row",
  },
  label: {
    fontSize: 18,
    color: theme.palette.text.primary,
  },
  label1: {
    fontSize: 18,
    marginBottom: "10px",
    color: theme.palette.text.primary,
  },
  button: {
    height: 48,
    width: 160,
    marginRight: 10,
  },
  buttonheart: {
    height: 48,
    width: 50,
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    border: "1px solid #f50057",
  },
  socialGroup: {
    ...theme.mixins.customize.flexMixin("center", "center"),
  },
  socialIcon: {
    fontSize: 18,
    margin: "0 10px",
    color: "#929292",
    transition: "transform .3s",
    "&:hover": {
      transform: "translateY(-1px)",
      color: theme.palette.secondary.main,
    },
  },
  buttoncz: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 15px",
    marginRight: "3px",
    marginLeft: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    cursor: "pointer",
  },
  NextIcon: {
    marginLeft: "29px",
    fontSize: "35px",
  },
  buttonGroup: {
    marginTop: 30,
    display: "flex",
    alignItems: "center",
  },
  favoriteButton: {
    marginLeft: 10,
    padding: 10,
    border: "none",
    backgroundColor: "transparent",
  },
}));

const ProductInfo = React.memo(
  ({
    product,
    recommendedSize,
    user,
    handleUpdateModalOpen,
    addToCartHandler,
    shippingModalOpen,
    returnModalOpen,
    handleShippingClick,
    handleReturnClick,
    handleShippingModalClose,
    handleReturnModalClose,
    updateModalOpen,
    handleUpdateModalClose,
    isFavorite,
    handleAddToFavorites,
    handleRemoveFromFavorites,
  }) => {
    const { handleSubmit, control } = useForm();
    const classes = useStyles(product);

    const sizeOptions = useMemo(() => ["S", "M", "L", "XL"], []);
    const colorOptions = useMemo(
      () =>
        product.colors
          ? product.colors.map((color) => ({
              name: color.name,
              hexCode: color.hexCode,
            }))
          : [],
      [product.colors]
    );

    return (
      <>
        <Typography variant="h4" component="h1" gutterBottom>
          {product.name}
        </Typography>
        <Box display="flex" alignItems="center" mb={1}>
          <Rating
            name="read-only"
            value={product.rating}
            precision={0.5}
            readOnly
          />
          <Typography component="span" style={{ marginLeft: 5 }}>
            {`(${product.numReviews} reviews) | `}
          </Typography>
          <Typography
            component="span"
            style={{ marginLeft: 5 }}
            color={product.countInStock > 0 ? "secondary" : "black"}
          >
            {`Status: ${
              product.countInStock > 0 ? "In Stock" : "Out of Stock"
            }`}
          </Typography>
        </Box>

        {/* Price */}
        <Typography
          variant="h6"
          color="textPrimary"
          component="div"
          className={classes.price}
          gutterBottom
        >
          {product.sale ? (
            <Typography
              variant="subtitle2"
              color="textSecondary"
              component="span"
              className={classes.rootPrice}
            >
              ${Number(product.price).toFixed(2)}
            </Typography>
          ) : null}
          {"  "}${Number(product.price * (1 - product.sale / 100)).toFixed(2)}
        </Typography>

        <Typography
          variant="body1"
          component="p"
          className={classes.description}
        >
          {product.description}
        </Typography>

        {/* Form */}
        <form onSubmit={handleSubmit(addToCartHandler)}>
          {/* Size Selection */}
          <FormControl
            fullWidth
            component="fieldset"
            classes={{ root: classes.sizeFormControl }}
          >
            <Box display="flex" alignItems="center">
              <FormLabel
                component="legend"
                color="secondary"
                className={classes.label1}
                style={{ marginRight: "16px", marginBottom: "14px" }}
              >
                Size:
              </FormLabel>
              <Controller
                name="size"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <>
                    <RadioGroup {...field} row>
                      {sizeOptions.map((size) => {
                        const sizeLower = size.toLowerCase();
                        const isSizeAvailable = product.size[sizeLower] > 0;
                        return (
                          <FormControlLabel
                            style={{ marginBottom: "15px" }}
                            key={size}
                            value={size}
                            control={<Radio style={{ display: "none" }} />}
                            label={
                              <Box
                                className={clsx(
                                  classes.buttoncz,
                                  field.value === size && "active",
                                  !isSizeAvailable && classes.disabled
                                )}
                                style={{
                                  backgroundColor:
                                    field.value === size && isSizeAvailable
                                      ? "#f0f0f0"
                                      : "transparent",
                                  opacity: isSizeAvailable ? 1 : 0.5,
                                  pointerEvents: isSizeAvailable
                                    ? "auto"
                                    : "none",
                                }}
                              >
                                <Typography
                                  style={{
                                    color: isSizeAvailable ? "black" : "gray",
                                  }}
                                >
                                  {size}
                                </Typography>
                              </Box>
                            }
                            disabled={!isSizeAvailable}
                          />
                        );
                      })}
                    </RadioGroup>
                    {error && (
                      <FormHelperText error>{error.message}</FormHelperText>
                    )}
                  </>
                )}
                rules={{ required: "Please select size!" }}
              />
            </Box>
            <Typography variant="body1" className={classes.description}>
              {recommendedSize ? (
                `Size recommended for you: ${recommendedSize}`
              ) : (
                // eslint-disable-next-line
                <Link
                  component="button"
                  onClick={(event) => {
                    event.preventDefault();
                    handleUpdateModalOpen();
                  }}
                >
                  Update your status to get recommended size
                </Link>
              )}
            </Typography>
            <UpdateProfileModal
              open={updateModalOpen}
              onClose={handleUpdateModalClose}
              user={user}
            />
          </FormControl>

          {/* Color Selection */}
          <FormControl
            fullWidth
            component="fieldset"
            className={classes.colorFormControl}
          >
            <Box display="flex" alignItems="center">
              <FormLabel
                component="legend"
                className={classes.label1}
                style={{ marginRight: "16px", marginBottom: "-2px" }}
              >
                Color:
              </FormLabel>
              <Controller
                name="color"
                control={control}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <>
                    <RadioGroup {...field} row>
                      {colorOptions.map((color, index) => (
                        <FormControlLabel
                          key={index}
                          value={color.hexCode || color.name}
                          control={<Radio style={{ display: "none" }} />}
                          label={
                            <Box
                              display="flex"
                              className={clsx(
                                classes.buttoncz,
                                field.value === (color.hexCode || color.name) &&
                                  "active"
                              )}
                              alignItems="center"
                              style={{
                                backgroundColor:
                                  field.value === (color.hexCode || color.name)
                                    ? "#f0f0f0"
                                    : "transparent",
                              }}
                            >
                              <Box
                                style={{
                                  width: 25,
                                  height: 25,
                                  backgroundColor: color.hexCode || color.name,
                                  borderRadius: "50%",
                                  marginRight: 10,
                                }}
                              />
                              <Typography style={{ flex: 1 }}>
                                {color.name}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </RadioGroup>
                    {error && (
                      <FormHelperText error>{error.message}</FormHelperText>
                    )}
                  </>
                )}
                rules={{ required: "Please select a color!" }}
              />
            </Box>
          </FormControl>

          {/* Quantity */}
          <FormControl className={classes.colorFormControl} variant="outlined">
            <Box display="flex" alignItems="center">
              <FormLabel
                component="legend"
                color="secondary"
                className={classes.label1}
                style={{ marginRight: "16px", marginBottom: "-2px" }}
              >
                Quantity:
              </FormLabel>
              <Controller
                name="qty"
                control={control}
                defaultValue={1}
                render={({ field }) => (
                  <TextField
                    select
                    label="Select quantity"
                    variant="outlined"
                    error={!product.countInStock}
                    helperText={!product.countInStock && "Out of stock"}
                    style={{ minWidth: "110px" }}
                    {...field}
                  >
                    {Array(product.countInStock)
                      .fill()
                      .map((_, index) => (
                        <MenuItem value={index + 1} key={index + 1}>
                          {index + 1}
                        </MenuItem>
                      ))}
                  </TextField>
                )}
              />
            </Box>
            {/* Button Group */}
            <Box className={classes.buttonGroup}>
              {/* Add to Cart Button */}
              <Button
                variant="contained"
                color="secondary"
                startIcon={<FiShoppingBag />}
                className={classes.button}
                disabled={product.countInStock === 0}
                type="submit"
              >
                Add to Cart
              </Button>
              {/* Favorite Button */}
              <IconButton
                color="secondary"
                className={classes.buttonheart}
                onClick={
                  isFavorite ? handleRemoveFromFavorites : handleAddToFavorites
                }
              >
                {isFavorite ? (
                  <FaHeart style={{ fontSize: "28px" }} />
                ) : (
                  <FaRegHeart style={{ fontSize: "28px" }} />
                )}
              </IconButton>
            </Box>
          </FormControl>
        </form>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          mt={2}
        >
          <Box
            display="flex"
            alignItems="center"
            onClick={handleShippingClick}
            style={{ cursor: "pointer" }}
            mb={2}
          >
            <Typography variant="h6" component="div">
              Shipping Policy
              <Typography variant="body2" color="textSecondary">
                Free shipping on orders over 1.000 $
              </Typography>
            </Typography>
            <ChevronRightIcon className={classes.NextIcon} />
          </Box>

          <Box
            display="flex"
            alignItems="center"
            onClick={handleReturnClick}
            style={{ cursor: "pointer" }}
          >
            <Typography variant="h6" component="div">
              Return Policy
              <Typography variant="body2" color="textSecondary">
                Free returns within 7 days
              </Typography>
            </Typography>
            <ChevronRightIcon className={classes.NextIcon} />
          </Box>
        </Box>
        <ShippingPolicy
          open={shippingModalOpen}
          onClose={handleShippingModalClose}
        />
        <ReturnPolicy open={returnModalOpen} onClose={handleReturnModalClose} />

        {/* Tags */}
        <Divider style={{ marginTop: 30 }} />
        <Box display="flex" alignItems="center" my={2}>
          <Box mr={1} color="text.secondary" display="flex" alignItems="center">
            <FaTags />
          </Box>
          <Typography className={classes.label}>Tags:</Typography>
          <Box ml={2}>
            <Chip
              size="small"
              label={product.category}
              style={{ marginRight: 8 }}
            />
            <Chip size="small" label={product.brand} />
          </Box>
        </Box>
        <Divider />

        {/* Share Section */}
        <Box display="flex" alignItems="center" my={2}>
          <Box mr={1} color="text.secondary" display="flex" alignItems="center">
            <FaShareAlt />
          </Box>
          <Typography className={classes.label}>Share:</Typography>
          <Box ml={1}>
            <div className={classes.socialGroup}>
              <ShareButtons
                url={`https://cybershop-v1.herokuapp.com/product/${product._id}`}
              />
            </div>
          </Box>
        </Box>
      </>
    );
  }
);

export default ProductInfo;
