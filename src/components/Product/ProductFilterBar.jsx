import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  Divider,
  Slider,
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  useMediaQuery,
} from "@material-ui/core";
import {
  addRangePrice,
  addCategories,
  addSize,
  addBrands,
  addRating,
  removeRating,
} from "../../actions/filterActions";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { useGetCategories, useGetCategoryCounts } from "../../hooks/api/useCategory";
import { useGetBrands } from "../../hooks/api/useBrand";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Rating from "@material-ui/lab/Rating";
import clsx from "clsx";

const INITIAL_RANGE_PRICE = [10, 400];

const useStyles = makeStyles((theme) => ({
  divider: {
    margin: theme.spacing(2, 0),
    [theme.breakpoints.down("sm")]: {
      margin: "4px 0",
    },
  },
  title: {
    color: theme.palette.text.primary,
    fontSize: 18,
    [theme.breakpoints.down("lg")]: {
      fontSize: 16,
    },
  },
  category: {
    ...theme.mixins.customize.flexMixin("flex-start", "flex-start", "column"),
    "& > .MuiBox-root + .MuiBox-root": {
      marginTop: theme.spacing(2),
    },
    "& > .MuiBox-root": {
      cursor: "pointer",
    },
  },
  brands: {
    "& > button": {
      paddingLeft: 0,
      paddingRight: 0,
      minWidth: 0,
      textTransform: "capitalize",
      color: theme.palette.text.primary,
    },
    "& > button:hover": {
      backgroundColor: "transparent",
    },
  },
  size: {
    flexDirection: "row",
    flexWrap: "nowrap",
    "& span": {
      fontSize: 14,
    },
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      flexWrap: "wrap",
    },
  },
  accordion: {
    "&::before": {
      display: "none",
    },
    boxShadow: "none",
    "& .MuiAccordionSummary-root": {
      padding: 0,
    },
    "& .MuiAccordionDetails-root": {
      display: "block",
      padding: 0,
    },
  },
  isSelected: {
    color: "#111 !important",
  },
}));

const ProductFilterBar = ({ sizeSelected, filter }) => {
  // Khởi tạo state và các hook
  const classes = useStyles();
  const dispatch = useDispatch();
  const onMobile = useMediaQuery("(max-width:740px)");

  const [expanded, setExpanded] = useState([
    "priceRange",
    "categories",
    "size",
    "brands",
    "rating",
  ]);
  const [price, setPrice] = useState(INITIAL_RANGE_PRICE);
  const [size, setSize] = useState("");
  const [rating, setRating] = useState(0);

  // Hooks for API data
  const { data: categoriesResponse, isLoading: loadingCategories, error: errorCategories } = useGetCategories();
  const { data: categoryCountsResponse, isLoading: loadingCategoryCounts, error: errorCategoryCounts } = useGetCategoryCounts();
  const { data: brandsResponse, isLoading: loadingBrands, error: errorBrands } = useGetBrands();

  const categoriesData = categoriesResponse?.data?.categories || [];
  const categoryCounts = categoryCountsResponse?.data?.categoryCounts || [];
  const brands = brandsResponse?.data?.brands || [];

  useEffect(() => {
    if (price !== INITIAL_RANGE_PRICE) {
      const timer = setTimeout(
        () =>
          dispatch(
            addRangePrice({
              priceMin: price[0],
              priceMax: price[1],
            })
          ),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [dispatch, price]);

  useEffect(() => {
    if (!sizeSelected) {
      setSize("");
    }
  }, [sizeSelected]);

  useEffect(() => {
    if (onMobile) {
      setExpanded([]);
    }
  }, [onMobile]);

  // Handlers
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(
      isExpanded ? [...expanded, panel] : expanded.filter((x) => x !== panel)
    );
  };

  const handleRatingChange = (newRating) => {
    if (newRating === rating) {
      setRating(0);
      dispatch(removeRating());
    } else {
      setRating(newRating);
      dispatch(addRating(newRating));
    }
  };

  const handlePriceChange = (e, newValue) => {
    setPrice(newValue);
  };

  const handleSizeChange = (newSize) => {
    setSize(newSize);
    addSizeHandler(newSize);
  };

  const addCategoriesHandler = (category) => {
    dispatch(addCategories(category));
  };

  const addSizeHandler = (size) => {
    dispatch(addSize(size));
  };

  const addBrandsHandler = (brand) => {
    dispatch(addBrands(brand));
  };

  return (
    <>
      <Accordion
        className={classes.accordion}
        expanded={expanded.indexOf("priceRange") >= 0}
        onChange={handleAccordionChange("priceRange")}
        defaultExpanded={true}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Filter By Pricing
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={price}
            onChange={handlePriceChange}
            max={500}
            min={1}
            color="secondary"
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
          />
          <Box
            display="flex"
            justifyContent="space-between"
            color="text.secondary"
          >
            <span>Filter</span>
            <span>{`Pricing $${price[0]} - $${price[1]}`}</span>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider className={classes.divider} />
      <Accordion
        className={classes.accordion}
        expanded={expanded.indexOf("categories") >= 0}
        onChange={handleAccordionChange("categories")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Categories
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.category} color="text.secondary">
            {loadingCategories || loadingCategoryCounts ? (
              <Typography variant="body2">Loading categories...</Typography>
            ) : errorCategories || errorCategoryCounts ? (
              <Typography variant="body2" color="error">
                {errorCategories || errorCategoryCounts}
              </Typography>
            ) : (
              categoriesData.map((category) => {
                const categoryCount =
                  categoryCounts.find((c) => c.name === category.name)?.count ||
                  0;

                return (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                    key={category._id}
                    className={clsx(
                      filter.categories.indexOf(category.name) >= 0 &&
                        classes.isSelected
                    )}
                    onClick={() => addCategoriesHandler(category.name)}
                  >
                    <span>{category.name}</span>
                    <span>({categoryCount})</span>
                  </Box>
                );
              })
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider className={classes.divider} />
      <Accordion
        className={classes.accordion}
        expanded={expanded.indexOf("brands") >= 0}
        onChange={handleAccordionChange("brands")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Brands
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.brands} color="text.secondary">
            {loadingBrands ? (
              <Typography variant="body2">Loading brands...</Typography>
            ) : errorBrands ? (
              <Typography variant="body2" color="error">
                {errorBrands}
              </Typography>
            ) : (
              brands.map((brand, index) => (
                <Button
                  disableElevation
                  disableFocusRipple
                  disableRipple
                  key={brand._id}
                  className={clsx(
                    filter.brands.indexOf(brand.name) >= 0 && classes.isSelected
                  )}
                  onClick={() => addBrandsHandler(brand.name)}
                >
                  {brand.name}
                  {index !== brands.length - 1 && (
                    <span style={{ margin: "0 8px" }}>/</span>
                  )}
                </Button>
              ))
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className={classes.accordion}
        expanded={expanded.indexOf("size") >= 0}
        onChange={handleAccordionChange("size")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Size
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth component="fieldset">
            <RadioGroup
              className={classes.size}
              value={size}
              onChange={(e) => handleSizeChange(e.target.value)}
            >
              {["s", "m", "l", "xl"].map((value) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={value.toUpperCase()}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Divider className={classes.divider} />
      <Accordion
        className={classes.accordion}
        expanded={expanded.indexOf("rating") >= 0}
        onChange={handleAccordionChange("rating")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Rating
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth component="fieldset">
            <RadioGroup
              value={String(rating)}
              onChange={(e) => handleRatingChange(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <FormControlLabel
                  key={value}
                  value={String(value)}
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center">
                      <Rating
                        name="rating-filter"
                        value={value}
                        readOnly
                        style={{ marginRight: 8 }}
                      />
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Divider className={classes.divider} />
    </>
  );
};

export default ProductFilterBar;
