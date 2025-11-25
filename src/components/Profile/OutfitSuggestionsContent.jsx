import React, { useState, useEffect, useMemo } from "react";
import {
  Paper,
  Typography,
  makeStyles,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Button,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGNNModelRecommendations } from "../../hooks/api/useRecommend";
import { useGetUserById, useGetFavorites } from "../../hooks/api/useUser";
import Message from "../Message";
import Loader from "../Loader";
import StarIcon from "@material-ui/icons/Star";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { formatPriceDollar } from "../../utils/formatPrice";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 20,
    minHeight: 500,
    border: `1px solid ${theme.palette.divider}`,
  },
  outfitCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${theme.palette.divider}`,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: theme.shadows[4],
      transform: "translateY(-4px)",
    },
  },
  outfitHeader: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  outfitName: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  outfitInfo: {
    display: "flex",
    gap: theme.spacing(1),
    flexWrap: "wrap",
  },
  productsGrid: {
    padding: theme.spacing(2),
    flexGrow: 1,
  },
  productCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    overflow: "hidden",
    transition: "all 0.2s ease",
    "&:hover": {
      boxShadow: theme.shadows[2],
    },
  },
  productImage: {
    width: "100%",
    height: 200,
    objectFit: "cover",
    backgroundColor: theme.palette.grey[100],
  },
  productInfo: {
    padding: theme.spacing(1.5),
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  productName: {
    fontSize: "0.875rem",
    fontWeight: 500,
    marginBottom: theme.spacing(0.5),
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
  },
  productPrice: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
    marginTop: "auto",
  },
  outfitFooter: {
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalPrice: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: theme.palette.secondary.main,
  },
  compatibilityScore: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
  },
  viewButton: {
    textTransform: "none",
  },
  emptyMessage: {
    textAlign: "center",
    padding: theme.spacing(4),
  },
}));

// Helper function to normalize category names
const normalizeCategoryName = (categoryName) => {
  if (!categoryName) return "Other";
  const normalized = categoryName.trim();
  const lower = normalized.toLowerCase();

  const categoryMap = {
    "top": "Tops",
    "tops": "Tops",
    "shirt": "Tops",
    "shirts": "Tops",
    "t-shirt": "Tops",
    "t-shirts": "Tops",
    "apparel_topwear": "Tops",
    "topwear": "Tops",
    "dress": "Dresses",
    "dresses": "Dresses",
    "bottom": "Bottoms",
    "bottoms": "Bottoms",
    "pants": "Bottoms",
    "trousers": "Bottoms",
    "apparel_bottomwear": "Bottoms",
    "bottomwear": "Bottoms",
    "shoe": "Shoes",
    "shoes": "Shoes",
    "footwear": "Shoes",
    "accessory": "Accessories",
    "accessories": "Accessories",
  };

  return categoryMap[lower] || normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
};

const OutfitSuggestionsContent = () => {
  const classes = useStyles();
  const history = useHistory();
  const userInfo = useSelector((state) => state.userLogin?.userInfo);
  const currentUserId = userInfo?._id || "";

  const { data: userResponse } = useGetUserById(currentUserId);
  const user = userResponse?.data?.user;

  const { data: favoritesResponse } = useGetFavorites(currentUserId);
  const favorites = favoritesResponse?.data?.favorites || [];

  const getGNNRecommendations = useGNNModelRecommendations();
  const [recommendationData, setRecommendationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recommendations when we have userId and a product ID
  useEffect(() => {
    if (!currentUserId) {
      setRecommendationData(null);
      return;
    }

    // Get first favorite product ID, or use a default if no favorites
    const productId = favorites.length > 0 ? favorites[0]._id : null;

    if (!productId) {
      setError("Please add products to your favorites to get outfit recommendations.");
      setRecommendationData(null);
      return;
    }

    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const requestData = {
          user_id: currentUserId,
          current_product_id: productId,
          top_k_personal: 5,
          top_k_outfit: 5,
        };

        const result = await getGNNRecommendations.mutateAsync(requestData);
        setRecommendationData(result);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError(err?.message || "Failed to load outfit recommendations.");
        setRecommendationData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, favorites.length]);

  // Process outfit recommendations
  const outfits = useMemo(() => {
    if (!recommendationData || !recommendationData.outfit) return [];

    const processedOutfits = [];
    const outfitKeys = Object.keys(recommendationData.outfit);

    outfitKeys.forEach((outfitKey) => {
      const outfitCategories = recommendationData.outfit[outfitKey];
      const categories = Object.keys(outfitCategories);
      if (categories.length === 0) return;

      const outfit = {
        name: outfitKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        products: [],
        totalPrice: 0,
        compatibilityScore: recommendationData.outfit_complete_score || 0,
        gender: user?.gender || "Unisex",
        style: "Casual", // Default style, can be enhanced
        description: `Complete outfit recommendation based on your preferences`,
      };

      // Map all products from all categories
      categories.forEach((category) => {
        const categoryData = outfitCategories[category];
        if (!categoryData || !categoryData.product) return;

        const normalizedCategory = normalizeCategoryName(category);
        const product = categoryData.product;
        const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;

        outfit.products.push({
          _id: product.id || product._id,
          name: product.productDisplayName || product.name || "Product",
          price: variant?.price || product.price || 0,
          sale: variant?.sale || product.sale || 0,
          image: product.images?.[0] || product.image || "",
          images: product.images || [],
        });
      });

      // Calculate total price (including sale discount)
      outfit.totalPrice = outfit.products.reduce((sum, p) => sum + (p.price || 0) * (1 - (p.sale || 0) / 100), 0);

      if (outfit.products.length > 0) {
        processedOutfits.push(outfit);
      }
    });

    return processedOutfits;
  }, [recommendationData, user?.gender]);

  const handleViewProduct = (productId) => {
    history.push(`/product?id=${productId}`);
  };

  if (isLoading) {
    return (
      <Paper className={classes.paper} elevation={0}>
        <Typography variant="h5" style={{ marginBottom: 24 }} className="tracking-widest">
          Outfit Suggestions
        </Typography>
        <Loader />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper className={classes.paper} elevation={0}>
        <Typography variant="h5" style={{ marginBottom: 24 }} className="tracking-widest">
          Outfit Suggestions
        </Typography>
        <Message>{error}</Message>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper} elevation={0}>
      <Typography variant="h5" style={{ marginBottom: 24 }} className="tracking-widest">
        Outfit Suggestions
      </Typography>

      {outfits.length === 0 ? (
        <Box className={classes.emptyMessage}>
          <Message severity="info">
            No outfit suggestions available at the moment. Please check back later.
          </Message>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {outfits.map((outfit, index) => (
            <Grid item xs={12} key={index}>
              <Card className={classes.outfitCard} elevation={0}>
                <Box className={classes.outfitHeader}>
                  <Typography variant="h6" className={classes.outfitName}>
                    {outfit.name}
                  </Typography>
                  <Box className={classes.outfitInfo}>
                    <Chip
                      label={outfit.style}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={outfit.gender}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                  {outfit.description && (
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: 8 }}>
                      {outfit.description}
                    </Typography>
                  )}
                </Box>

                <Box className={classes.productsGrid}>
                  <Grid container spacing={2}>
                    {outfit.products.map((product) => (
                      <Grid item xs={6} sm={4} md={3} key={product._id}>
                        <Card className={classes.productCard} elevation={0}>
                          <CardMedia
                            component="img"
                            className={classes.productImage}
                            image={product.image || product.images?.[0] || ""}
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = "/logo-icon-NovaWare.png";
                            }}
                          />
                          <CardContent className={classes.productInfo}>
                            <Typography variant="body2" className={classes.productName}>
                              {product.name}
                            </Typography>
                            <Typography variant="body2" className={classes.productPrice}>
                              {formatPriceDollar(product.price)}
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<VisibilityIcon />}
                              className={classes.viewButton}
                              onClick={() => handleViewProduct(product._id)}
                              style={{ marginTop: 8 }}
                            >
                              View
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box className={classes.outfitFooter}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Total Price:
                    </Typography>
                    <Typography variant="h6" className={classes.totalPrice}>
                      {formatPriceDollar(outfit.totalPrice)}
                    </Typography>
                  </Box>
                  <Box className={classes.compatibilityScore}>
                    <StarIcon style={{ color: "#ffc107" }} />
                    <Typography variant="body2" style={{ fontWeight: 500 }}>
                      Compatibility: {(outfit.compatibilityScore * 100).toFixed(0)}%
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

export default OutfitSuggestionsContent;
