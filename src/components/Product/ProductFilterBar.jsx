import React, { useState, useEffect } from "react";
import {
  Typography,
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
  Chip,
} from "@material-ui/core";
import {
  addRangePrice,
  addCategories,
  addSize,
  addRating,
  removeRating,
  setGenderFilter,
  clearGenderFilter,
} from "../../actions/filterActions";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { useGetCategories } from "../../hooks/api/useCategory";
import { useHistory, useLocation } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Rating from "@material-ui/lab/Rating";
import clsx from "clsx";
import queryString from "query-string";

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
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    "& > .MuiChip-root": {
      cursor: "pointer",
    },
  },
  chipActive: {
    backgroundColor: "#DB2777 !important",
    color: "#ffffff !important",
    "&:hover": {
      backgroundColor: "#DB2777 !important",
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
    "& .MuiAccordionSummary-content.Mui-expanded": {
      marginTop: 12,
      marginBottom: 12,
    },
    "& .MuiAccordionDetails-root": {
      display: "block",
      padding: 0,
    },
  },
}));

const GENDER_OPTIONS = ["Men", "Women", "Boys", "Girls", "Unisex"];

const ProductFilterBar = ({ sizeSelected, filter }) => {
  // Khởi tạo state và các hook
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const onMobile = useMediaQuery("(max-width:740px)");

  const [expanded, setExpanded] = useState([
    "priceRange",
    "categories",
    "gender",
    "size",
    "rating",
  ]);
  const [price, setPrice] = useState(INITIAL_RANGE_PRICE);
  const [size, setSize] = useState("");
  const [rating, setRating] = useState(0);
  const [gender, setGender] = useState(filter?.gender || "");

  // Hooks for API data
  const { data: categoriesResponse, isLoading: loadingCategories, error: errorCategories } = useGetCategories();

  const articleTypes = categoriesResponse?.data?.articleTypes || [];
  const query = queryString.parse(location.search);
  const currentArticleType = query.articleType;

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

  useEffect(() => {
    if (!filter?.gender) {
      setGender("");
    } else {
      setGender(filter.gender);
    }
  }, [filter?.gender]);

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

  const handleGenderChange = (selectedGender) => {
    if (selectedGender === gender) {
      setGender("");
      dispatch(clearGenderFilter());
    } else {
      setGender(selectedGender);
      dispatch(setGenderFilter(selectedGender));
    }
  };

  const handleArticleTypeClick = (articleType) => {
    const queryParams = { ...query, articleType };
    if (currentArticleType === articleType) {
      // If clicking the same articleType, remove it
      delete queryParams.articleType;
    }
    const queryStr = queryString.stringify(queryParams);
    history.push(`/shop${queryStr ? `?${queryStr}` : ""}`);
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
            {loadingCategories ? (
              <Typography variant="body2">Loading categories...</Typography>
            ) : errorCategories ? (
              <Typography variant="body2" color="error">
                {errorCategories?.message || String(errorCategories)}
              </Typography>
            ) : articleTypes.length === 0 ? (
              <Typography variant="body2">No article types available</Typography>
            ) : (
              articleTypes.map((articleType) => (
                <Chip
                  key={articleType}
                  label={articleType}
                  variant={currentArticleType === articleType ? "default" : "outlined"}
                  size="medium"
                  onClick={() => handleArticleTypeClick(articleType)}
                  className={clsx(
                    currentArticleType === articleType && classes.chipActive
                  )}
                />
              ))
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion
        className={classes.accordion}
        expanded={expanded.indexOf("gender") >= 0}
        onChange={handleAccordionChange("gender")}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Gender
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={classes.category} color="text.secondary">
            {GENDER_OPTIONS.map((option) => (
              <Chip
                key={option}
                label={option}
                variant={gender === option ? "default" : "outlined"}
                size="medium"
                onClick={() => handleGenderChange(option)}
                className={clsx(gender === option && classes.chipActive)}
              />
            ))}
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
