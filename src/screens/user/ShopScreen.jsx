import React, { useState, useEffect, useRef } from "react";
import {
  removeSearchTerm,
  removeRangePrice,
  removeCategory,
  removeSize,
  removeBrand,
  filterClearAll,
  removeRating,
} from "../../actions/filterActions";
import { useFilterProducts } from "../../hooks/api/useProduct";
import {
  Container,
  Link,
  Box,
  Grid,
  Breadcrumbs,
  FormControl,
  Select,
  MenuItem,
  FormLabel,
  Chip,
  useMediaQuery,
} from "@material-ui/core";
import { PaginationItem, Pagination } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { RiLayoutGridFill, RiLayoutFill } from "react-icons/ri";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Meta from "../../components/Meta";
import ProductCard from "../../components/Product/ProductCard";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import clsx from "clsx";
import queryString from "query-string";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import ProductFilterBar from "../../components/Product/ProductFilterBar";

const useStyles = makeStyles((theme) => ({
  breadcrumbsContainer: {
    ...theme.mixins.customize.breadcrumbs,
    paddingBottom: 0,
    marginBottom: 20,
    "& .MuiBreadcrumbs-ol": {
      justifyContent: "flex-start",
    },
  },
  container: {
    marginBottom: 64,
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    "& label": {
      color: theme.palette.text.secondary,
      paddingRight: 12,
    },
    "& .MuiOutlinedInput-input": {
      paddingTop: 6,
      paddingBottom: 6,
      color: theme.palette.text.secondary,
      fontSize: 15,
    },
    "& .MuiInputBase-formControl": {
      borderRadius: 4,
      marginRight: theme.spacing(6),
    },
  },
  layoutIcon: {
    ...theme.mixins.customize.centerFlex("column"),
    padding: 4,
    cursor: "pointer",
    "& + $layoutIcon": {
      marginLeft: 8,
    },
  },
  activeLayout: {
    backgroundColor: theme.palette.background.paper,
    color: "white",
  },
  topFilter: {
    ...theme.mixins.customize.flexMixin(
      "space-between",
      "center",
      "row",
      "wrap"
    ),
    boxShadow:
      "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
    padding: 22,
    marginBottom: theme.spacing(5),
    backgroundColor: theme.palette.background.paper, // Màu nền từ theme
    color: theme.palette.text.primary, // Văn bản từ theme
    // '& .MuiChip-root + .MuiChip-root': {
    //   marginLeft: 12,
    // },
    "& .MuiChip-root": {
      margin: 4,
    },
  },
  pagination: {
    flexBasis: "100%",
    marginTop: 16,
    marginBottom: 16,
    "& .MuiPagination-ul": {
      justifyContent: "flex-end",
    },
  },
}));

const ShopScreen = ({ location, history }) => {
  // State
  const dispatch = useDispatch();
  const classes = useStyles();
  const onExtraSmallMobile = useMediaQuery("(max-width:460px)");
  const ref = useRef();
  const [activeLayout, setActiveLayout] = useState("moreCol");
  const query = queryString.parse(location.search);
  let { sort_by = "default", page: pageNumber = 1 } = query;

  // Selectors
  const filter = useSelector((state) => state.filter);
  const { searchTerm, categories, brands, size, priceMax, priceMin, rating } =
    filter;

  // Build filter query
  const filterQuery = {
    keyword: searchTerm || undefined,
    categories: categories?.length ? categories.join(",") : undefined,
    brands: brands?.length ? brands.join(",") : undefined,
    size: size || undefined,
    priceMin: priceMin || undefined,
    priceMax: priceMax || undefined,
    rating: rating || undefined,
    sort_by: sort_by || "default",
    pageNumber: pageNumber || 1,
    perPage: 12,
  };

  const { data: productsResponse, isLoading: loading, error: queryError } = useFilterProducts(filterQuery);
  const products = productsResponse?.data?.products || [];
  const page = productsResponse?.data?.page || 1;
  const pages = productsResponse?.data?.pages || 1;
  const error = queryError?.message || (queryError ? String(queryError) : null);

  // Effect
  useEffect(() => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }, [pageNumber]);

  useEffect(() => {
    if (onExtraSmallMobile) {
      setActiveLayout("fewCol");
    }
  }, [onExtraSmallMobile]);

  const handleChangeLayout = (type) => {
    setActiveLayout(type);
  };

  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Shop" />
      <Grid container className={classes.breadcrumbsContainer} ref={ref}>
        <Grid item xs={12}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            style={{ marginBottom: 24 }}
          >
            <Link color="inherit" component={RouterLink} to="/">
              Home
            </Link>
            <Link color="textPrimary" component={RouterLink} to="/shop">
              Shop
            </Link>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Grid container spacing={4} className={classes.container}>
        <Grid item xs={12} md={3}>
          <ProductFilterBar
            products={products}
            sizeSelected={size}
            filter={filter}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Box className={classes.topFilter}>
            <div>
              <FormControl variant="outlined" className={classes.selectBox}>
                <FormLabel>Sort by</FormLabel>
                <Select
                  value={sort_by}
                  onChange={(e) =>
                    history.push(`/shop?sort_by=${e.target.value}`)
                  }
                >
                  <MenuItem value="default">Default Sorting</MenuItem>
                  <MenuItem value="latest">Lastest</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                  <MenuItem value="sale">Sale</MenuItem>
                  <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                  <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div style={{ display: "flex" }}>
              <span
                className={clsx(
                  classes.layoutIcon,
                  activeLayout === "fewCol" && classes.activeLayout
                )}
                onClick={() => handleChangeLayout("fewCol")}
              >
                <RiLayoutFill fontSize={16} />
              </span>
              <span
                className={clsx(
                  classes.layoutIcon,
                  activeLayout === "moreCol" && classes.activeLayout
                )}
                onClick={() => handleChangeLayout("moreCol")}
              >
                <RiLayoutGridFill fontSize={16} />
              </span>
            </div>
            <Box mt={2} style={{ flexBasis: "100%" }}>
              {searchTerm && (
                <Chip
                  variant="outlined"
                  size="small"
                  label={`Keyword: ${searchTerm}`}
                  onDelete={() => dispatch(removeSearchTerm())}
                />
              )}
              {priceMin && (
                <Chip
                  variant="outlined"
                  size="small"
                  label={`Above: $${priceMin}`}
                  onDelete={() => dispatch(removeRangePrice("min"))}
                />
              )}
              {priceMax && (
                <Chip
                  variant="outlined"
                  size="small"
                  label={`Below: $${priceMax}`}
                  onDelete={() => dispatch(removeRangePrice("max"))}
                />
              )}
              {categories.map((category) => (
                <Chip
                  variant="outlined"
                  size="small"
                  key={category}
                  label={category}
                  onDelete={() => dispatch(removeCategory(category))}
                />
              ))}
              {size && (
                <Chip
                  variant="outlined"
                  size="small"
                  label={`Size: ${size.toUpperCase()}`}
                  onDelete={() => dispatch(removeSize())}
                />
              )}
              {brands.map((brand) => (
                <Chip
                  variant="outlined"
                  size="small"
                  key={brand}
                  label={brand}
                  onDelete={() => dispatch(removeBrand(brand))}
                />
              ))}
              {rating > 0 && ( 
                <Chip
                  variant="outlined"
                  size="small"
                  label={`Rating: ${rating} Star`} 
                  onDelete={() => dispatch(removeRating())} 
                />
              )}
            </Box>
          </Box>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message>{error}</Message>
          ) : (
            <Grid container spacing={2}>
              {products.length !== 0 ? (
                products.map((product) => (
                  <Grid
                    item
                    xs={activeLayout === "fewCol" ? 12 : 6}
                    sm={activeLayout === "fewCol" ? 6 : 4}
                    lg={activeLayout === "fewCol" ? 4 : 3}
                    key={product._id}
                  >
                    <ProductCard {...product} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Message severity="info" mt={0}>
                    No product found.{" "}
                    <Link
                      component={RouterLink}
                      to={`shop?sort_by=${sort_by}&page=1`}
                    >
                      Back
                    </Link>
                    {` or `}
                    <Link onClick={() => dispatch(filterClearAll())}>
                      Clear all filter
                    </Link>
                  </Message>
                </Grid>
              )}
              {pages > 1 && (
                <Pagination
                  className={classes.pagination}
                  page={page}
                  count={pages}
                  renderItem={(item) => (
                    <PaginationItem
                      component={RouterLink}
                      to={`/shop${
                        item.page === 0
                          ? ""
                          : `?sort_by=${sort_by}&page=${item.page}`
                      }`}
                      {...item}
                    />
                  )}
                />
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShopScreen;
