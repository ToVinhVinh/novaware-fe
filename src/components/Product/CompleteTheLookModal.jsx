import React, { useEffect, useState, useMemo, useRef } from "react";
import {
    Box,
    Button,
    Card,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab,
    Grid,
    CircularProgress,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FaTshirt, FaChartLine, FaVenusMars, FaDollarSign, FaGem, FaFemale, FaShoePrints } from "react-icons/fa";
import { PiPants } from "react-icons/pi";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import LottieLoading from "../LottieLoading.jsx";
import { toast } from "react-toastify";
import CallMadeIcon from "@material-ui/icons/CallMade";
import { getScoreChip } from "../../utils/chipUtils.jsx";

const useStyles = makeStyles((theme) => ({
    outfitModal: {
        "& .MuiDialog-paper": {
            maxWidth: "90vw",
            height: "90vh",
            borderRadius: 12,
        },
    },
    outfitModalContent: {
        padding: "0 24px 24px 24px !important",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
    },
    dialogTitle: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: "1px solid #e0e0e0",
        margin: 0,
    },
    closeButton: {
        position: "absolute",
        right: 8,
        top: 8,
        color: theme.palette.grey[500],
        "&:hover": {
            color: theme.palette.secondary.main,
            backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
    },
    outfitCard: {
        marginBottom: 24,
        borderRadius: 12,
        border: "1px solid #e0e0e0",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
    },
    outfitHeader: {
        padding: "16px 20px",
        backgroundColor: "#f5f5f5",
        borderBottom: "1px solid #e0e0e0",
    },
    outfitBody: {
        padding: "20px",
    },
    categorySection: {
        marginBottom: 20,
        "&:last-child": {
            marginBottom: 0,
        },
    },
    categoryTitle: {
        fontSize: "1.1rem",
        fontWeight: 600,
        marginBottom: 12,
        color: theme.palette.text.primary,
        display: "flex",
        alignItems: "center",
        "&::before": {
            content: '""',
            width: 4,
            height: 20,
            backgroundColor: theme.palette.secondary.main,
            marginRight: 8,
            borderRadius: 2,
        },
    },
    tableContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        minHeight: 0,
        "& > .MuiPaper-root": {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            flex: 1,
        },
        "@media (max-width: 768px)": {
            overflowX: "scroll",
        },
    },
    table: {
        minWidth: 650,
        "@media (max-width: 768px)": {
            minWidth: "100%",
        },
    },
    tableHeader: {
        backgroundColor: "#E8F4FD",
        "& .MuiTableCell-head": {
            color: "#000",
            fontWeight: 600,
            fontSize: "1rem",
            padding: "12px",
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#E8F4FD",
        },
    },
    headerIcon: {
        marginRight: 8,
        fontSize: "1.2rem",
        verticalAlign: "middle",
        color: "#0ea5e9",
    },
    headerContent: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    tableCell: {
        padding: "0px",
        borderRadius: 0,
        verticalAlign: "top",
        width: "20%",
        "&:last-child": {
            borderRight: "none",
        },
        backgroundColor: "#FAFAFA",
        position: "relative",
    },
    productCarouselContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        padding: "8px",
    },
    carouselHeader: {
        fontSize: "0.9rem",
        fontWeight: 600,
        color: theme.palette.text.secondary,
        textAlign: "center",
        minHeight: 24,
    },
    carouselNavButton: {
        width: "100%",
        minWidth: "auto",
        padding: "8px 12px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 0,
        color: theme.palette.secondary.main,
        transition: "all 0.2s ease",
        "&:hover": {
            backgroundColor: theme.palette.secondary.main,
            color: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        },
        "&:disabled": {
            opacity: 0.35,
            cursor: "not-allowed",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
        },
    },
    carouselProductWrapper: {
        width: "100%",
        minHeight: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    productCardContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    productCard: {
        width: "100%",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
        backgroundColor: "#fff",
        borderRadius: 0,
        boxShadow: "none",
        border: "1px solid #e0e0e0",
    },
    productImage: {
        width: "100%",
        height: 200,
        objectFit: "cover",
        backgroundColor: "#fff",
        transition: "opacity 0.3s ease-in-out",
    },
    imageContainer: {
        position: "relative",
        width: "100%",
        height: 200,
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    imageLoading: {
        opacity: 0,
    },
    imageLoaded: {
        opacity: 1,
    },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    imageError: {
        width: "100%",
        height: "100%",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: theme.palette.text.secondary,
    },
    productInfo: {
        padding: 12,
        borderTop: "1px solid #e0e0e0",
    },
    productName: {
        fontSize: "0.9rem",
        fontWeight: 500,
        marginBottom: 8,
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 1,
        WebkitBoxOrient: "vertical",
        minHeight: 20,
    },
    productPrice: {
        fontSize: "1rem",
        fontWeight: 600,
        color: theme.palette.secondary.main,
    },
    outfitMeta: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        backgroundColor: "#fff",
    },
    outfitMetaItem: {
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontSize: "0.85rem",
        color: theme.palette.text.secondary,
    },
    metaChip: {
        borderRadius: 16,
        padding: "6px",
        fontSize: "0.85rem",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.2s ease",
        "&:hover": {
            transform: "translateY(-1px)",
        },
        "& svg": {
            fontSize: 14,
        },
    },
    styleChip: {
        backgroundColor: "#dbeafe",
        border: "1px solid #3b82f6",
        color: "#1e40af",
        boxShadow: "0 1px 3px rgba(59, 130, 246, 0.2)",
        "&:hover": {
            backgroundColor: "#bfdbfe",
            boxShadow: "0 3px 6px rgba(59, 130, 246, 0.3)",
        },
        "& svg": {
            color: "#1e3a8a",
        },
    },
    totalChip: {
        backgroundColor: "#dcfce7",
        border: "1px solid #22c55e",
        color: "#166534",
        boxShadow: "0 1px 3px rgba(34, 197, 94, 0.2)",
        "&:hover": {
            backgroundColor: "#bbf7d0",
            boxShadow: "0 3px 6px rgba(34, 197, 94, 0.3)",
        },
        "& svg": {
            color: "#15803d",
        },
    },
    compatibilityChip: {
        backgroundColor: "#fed7aa",
        border: "1px solid #f97316",
        color: "#9a3412",
        boxShadow: "0 1px 3px rgba(249, 115, 22, 0.2)",
        "&:hover": {
            backgroundColor: "#fdba74",
            boxShadow: "0 3px 6px rgba(249, 115, 22, 0.3)",
        },
        "& svg": {
            color: "#c2410c",
        },
    },
    genderChip: {
        backgroundColor: "#f3e8ff",
        border: "1px solid #a855f7",
        color: "#6b21a8",
        boxShadow: "0 1px 3px rgba(168, 85, 247, 0.2)",
        "&:hover": {
            backgroundColor: "#e9d5ff",
            boxShadow: "0 3px 6px rgba(168, 85, 247, 0.3)",
        },
        "& svg": {
            color: "#7e22ce",
        },
    },
    descriptionChip: {
        backgroundColor: "#cffafe",
        border: "1px solid #06b6d4",
        color: "#155e75",
        boxShadow: "0 1px 3px rgba(6, 182, 212, 0.2)",
        "&:hover": {
            backgroundColor: "#a5f3fc",
            boxShadow: "0 3px 6px rgba(6, 182, 212, 0.3)",
        },
        "& svg": {
            color: "#164e63",
        },
    },
    tabsContainer: {
        borderBottom: "1px solid #e0e0e0",
    },
    tab: {
        minWidth: 120,
        textTransform: "none",
        fontSize: "1rem",
        fontWeight: 500,
    },
    tabPanel: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minHeight: 0,
    },
    personalizedGrid: {
        flex: 1,
        overflow: "auto",
        padding: "16px 0",
    },
    personalizedCard: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    reasonText: {
        fontSize: "0.85rem",
        color: theme.palette.text.secondary,
        marginTop: 8,
        fontStyle: "italic",
    },
    scoreChip: {
        backgroundColor: "#fef3c7",
        border: "1px solid #f59e0b",
        color: "#92400e",
        boxShadow: "0 1px 3px rgba(245, 158, 11, 0.2)",
        "&:hover": {
            backgroundColor: "#fde68a",
            boxShadow: "0 3px 6px rgba(245, 158, 11, 0.3)",
        },
    },
}));

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
        "innerwear": "Innerwear",
    };

    return categoryMap[lower] || normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
};

// Lazy-loaded image component with loading state
const LazyProductImage = ({ src, alt, className, classes }) => {
    const [imageState, setImageState] = useState("loading"); // loading, loaded, error
    const imgRef = useRef(null);

    useEffect(() => {
        if (!src) {
            setImageState("error");
            return;
        }

        const img = new Image();
        img.onload = () => {
            setImageState("loaded");
        };
        img.onerror = () => {
            setImageState("error");
        };
        img.src = src;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src]);

    if (imageState === "error") {
        return (
            <Box className={classes.imageError}>
                <Typography variant="caption" style={{ fontSize: "0.75rem" }}>
                    Image not available
                </Typography>
            </Box>
        );
    }

    return (
        <Box className={classes.imageContainer}>
            {imageState === "loading" && (
                <Box className={classes.imagePlaceholder}>
                    <CircularProgress size={24} thickness={4} />
                </Box>
            )}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={`${className} ${imageState === "loaded" ? classes.imageLoaded : classes.imageLoading}`}
                loading="lazy"
                decoding="async"
            />
        </Box>
    );
};

const CompleteTheLookModal = ({ open, onClose, userId, productId, user, recommendationData, isLoading, error }) => {
    const classes = useStyles();
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState(0);
    const [carouselIndices, setCarouselIndices] = useState({});

    // Process personalized recommendations
    const personalizedData = useMemo(() => {
        if (!recommendationData || !recommendationData.personalized) return [];
        return recommendationData.personalized.map((item) => {
            const variant = item.product?.variants && item.product.variants.length > 0 ? item.product.variants[0] : null;
            return {
                _id: item.product?.id,
                product_id: item.product?.id,
                name: item.product?.productDisplayName || item.product?.name || "Product",
                images: item.product?.images || [],
                price: variant?.price || item.product?.price || 0,
                sale: variant?.sale || item.product?.sale || 0,
                rating: item.product?.rating || 0,
                score: item.score,
                reason: item.reason,
                gender: item.product?.gender,
                baseColour: item.product?.baseColour,
                articleType: item.product?.articleType,
                usage: item.product?.usage,
                season: item.product?.season,
            };
        });
    }, [recommendationData]);

    const outfitData = useMemo(() => {
        if (!recommendationData || !recommendationData.outfit) return [];

        const products = [];

        Object.entries(recommendationData.outfit).forEach(([categoryKey, categoryProducts]) => {
            if (!Array.isArray(categoryProducts) || categoryProducts.length === 0) return;

            const normalizedCategory = normalizeCategoryName(categoryKey);

            categoryProducts.forEach((item) => {
                if (!item.product) return;

                const product = item.product;
                const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;

                products.push({
                    _id: product.id,
                    name: product.productDisplayName || product.name || "Product",
                    product_id: product.id,
                    category: normalizedCategory,
                    price: variant?.price || product.price || 0,
                    sale: variant?.sale || product.sale || 0,
                    images: product.images || [],
                    score: item.score,
                    reason: item.reason,
                    articleType: product.articleType,
                    usage: product.usage,
                    season: product.season,
                });
            });
        });

        if (products.length === 0) return [];

        // Calculate total price
        const totalPrice = products.reduce((sum, p) => sum + (p.price || 0) * (1 - (p.sale || 0) / 100), 0);

        const outfit = {
            name: "Complete the Look",
            products,
            totalPrice,
            compatibilityScore: recommendationData.outfit_complete_score || 0,
            gender: user?.gender || "Unisex",
        };

        return [outfit];
    }, [recommendationData, user?.gender]);

    const getCategoryIcon = (categoryName) => {
        const key = categoryName.trim().toLowerCase();
        switch (key) {
            case "tops":
                return <FaTshirt className={classes.headerIcon} />;
            case "dresses":
                return <FaFemale className={classes.headerIcon} />;
            case "bottoms":
                return <PiPants className={classes.headerIcon} />;
            case "shoes":
                return <FaShoePrints className={classes.headerIcon} />;
            case "accessories":
                return <FaGem className={classes.headerIcon} />;
            case "innerwear":
                return <FaTshirt className={classes.headerIcon} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (!open) return;
        if (!userId) {
            toast.info("Please sign in to see outfit recommendations.");
            onClose();
            return;
        }
        if (!user?.gender) {
            toast.info("Please update your profile with gender information to see outfit recommendations.");
        }
    }, [open, userId, user?.gender, onClose]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const renderProductCard = (product, showReason = false, showScore = false) => {
        const imageSrc = product.images && product.images.length > 0
            ? product.images[0]
            : "https://www.lwf.org/images/emptyimg.png";

        return (
            <Card
                className={classes.productCard}
                onClick={() => window.open(`/product?id=${product._id || product.product_id || ''}`, "_blank")}
            >
                <LazyProductImage
                    src={imageSrc}
                    alt={product.name}
                    className={classes.productImage}
                    classes={classes}
                />
                <Box className={classes.productInfo}>
                    {(product.articleType || product.usage || product.season) && (
                        <Box style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                            {product.articleType && (
                                <Chip
                                    label={product.articleType}
                                    variant="default"
                                    size="medium"
                                    style={{
                                        fontSize: "0.7rem",
                                        height: 20,
                                        backgroundColor: theme.palette.secondary.main,
                                        color: "#fff"
                                    }}
                                />
                            )}
                            {product.usage && (
                                <Chip
                                    label={product.usage}
                                    variant="outlined"
                                    color="primary"
                                    size="medium"
                                    style={{ fontSize: "0.7rem", height: 20 }}
                                />
                            )}
                            {product.season && (
                                <Chip
                                    label={product.season}
                                    variant="outlined"
                                    size="medium"
                                    color="primary"
                                    style={{ fontSize: "0.7rem", height: 20 }}
                                />
                            )}
                        </Box>
                    )}
                    <Typography className={classes.productName} variant="body2">
                        {product.name}
                    </Typography>
                    {showReason && product.reason && (
                        <Typography className={classes.reasonText} variant="caption">
                            {product.reason}
                        </Typography>
                    )}
                    <Typography className={classes.productPrice}>
                        ${((product.price || 0) * (1 - ((product.sale || 0) / 100))).toFixed(2)}
                        {product.sale && product.sale > 0 && (
                            <Typography
                                component="span"
                                style={{
                                    fontSize: "0.8rem",
                                    textDecoration: "line-through",
                                    color: "#999",
                                    marginLeft: 8,
                                }}
                            >
                                {((product.price || 0)).toFixed(2)}
                            </Typography>
                        )}
                    </Typography>
                    {showScore && product.score !== undefined && (
                        <Box style={{ marginTop: 8 }}>
                            {getScoreChip(product.score)}
                        </Box>
                    )}
                    <Button
                        variant="outlined"
                        color="primary"
                        size="medium"
                        style={{ width: "100%", marginTop: 8 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(`/product?id=${product._id || product.product_id || ''}`, "_blank");
                        }}
                        endIcon={<CallMadeIcon />}
                    >
                        View details
                    </Button>
                </Box>
            </Card>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            className={classes.outfitModal}
            style={{ zIndex: 9999 }}
            BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        >
            <DialogTitle className={classes.dialogTitle}>
                <Typography variant="h5" component="div" align="center" className="tracking-widest">Complete the Look</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    className={classes.closeButton}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.outfitModalContent}>
                {userId && isLoading && (
                    <LottieLoading />
                )}
                {userId && !isLoading && !error && (personalizedData.length > 0 || outfitData.length > 0) && (
                    <>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            className={classes.tabsContainer}
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label="Personalized" className={classes.tab} />
                            <Tab label="Outfit" className={classes.tab} />
                        </Tabs>

                        {/* Personalized Tab */}
                        {activeTab === 0 && (
                            <Box className={classes.tabPanel}>
                                <Grid container spacing={3} className={classes.personalizedGrid}>
                                    {personalizedData.length > 0 ? (
                                        personalizedData.map((product) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id || product.product_id}>
                                                {renderProductCard(product, true, true)}
                                            </Grid>
                                        ))
                                    ) : (
                                        <Grid item xs={12}>
                                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                                                <Typography variant="body1" color="textSecondary">
                                                    No personalized recommendations available at the moment.
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        )}

                        {/* Outfit Tab */}
                        {activeTab === 1 && (
                            <Box className={classes.tabPanel}>
                                <TableContainer component={Paper} className={classes.tableContainer}>
                                    <Table className={classes.table} aria-label="outfit table" stickyHeader>
                                        <TableHead className={classes.tableHeader}>
                                            <TableRow>
                                                {["Tops", "Dresses", "Bottoms", "Shoes", "Accessories"].map((category) => (
                                                    <TableCell key={category} align="center">
                                                        <Box className={classes.headerContent}>
                                                            {getCategoryIcon(category)}
                                                            <Typography variant="body1" component="span">
                                                                {category}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {outfitData.length > 0 ? (
                                                outfitData.map((outfit, outfitIndex) => {
                                                    const categories = ["Tops", "Dresses", "Bottoms", "Shoes", "Accessories"];
                                                    const productsByCategory = {
                                                        Tops: [],
                                                        Dresses: [],
                                                        Bottoms: [],
                                                        Shoes: [],
                                                        Accessories: [],
                                                        Other: [],
                                                    };

                                                    outfit.products?.forEach((p) => {
                                                        const category = p.category || "Other";
                                                        if (productsByCategory[category]) {
                                                            productsByCategory[category].push(p);
                                                        } else {
                                                            productsByCategory.Other.push(p);
                                                        }
                                                    });

                                                    return (
                                                        <React.Fragment key={outfitIndex}>
                                                            {/* Row 1: Product cards */}
                                                            <TableRow>
                                                                {categories.map((category) => {
                                                                    const carouselKey = `${category}-${outfitIndex}`;
                                                                    const currentIndex = carouselIndices[carouselKey] || 0;
                                                                    const products = productsByCategory[category] || [];
                                                                    const currentProduct = products[currentIndex];

                                                                    const handlePrev = () => {
                                                                        if (currentIndex > 0) {
                                                                            setCarouselIndices(prev => ({
                                                                                ...prev,
                                                                                [carouselKey]: currentIndex - 1
                                                                            }));
                                                                        }
                                                                    };

                                                                    const handleNext = () => {
                                                                        if (currentIndex < products.length - 1) {
                                                                            setCarouselIndices(prev => ({
                                                                                ...prev,
                                                                                [carouselKey]: currentIndex + 1
                                                                            }));
                                                                        }
                                                                    };

                                                                    return (
                                                                        <TableCell key={category} className={classes.tableCell} align="center" style={{ verticalAlign: "top" }}>
                                                                            {products.length > 0 ? (
                                                                                <Box className={classes.productCarouselContainer}>
                                                                                    <div className="grid grid-cols-2 w-full">
                                                                                        <Button
                                                                                            className={classes.carouselNavButton}
                                                                                            onClick={handleNext}
                                                                                            disabled={currentIndex === products.length - 1}
                                                                                            endIcon={<ExpandLessIcon />}
                                                                                        >
                                                                                            Next
                                                                                        </Button>
                                                                                        <Button
                                                                                            className={classes.carouselNavButton}
                                                                                            onClick={handlePrev}
                                                                                            disabled={currentIndex === 0}
                                                                                            startIcon={<ExpandMoreIcon />}
                                                                                        >
                                                                                            Prev
                                                                                        </Button>
                                                                                    </div>
                                                                                    <Box className={classes.carouselProductWrapper}>
                                                                                        {currentProduct && renderProductCard(currentProduct)}
                                                                                    </Box>

                                                                                </Box>
                                                                            ) : (
                                                                                <Typography variant="body2" color="textSecondary" style={{ textAlign: "center", padding: "20px" }}>
                                                                                    No items
                                                                                </Typography>
                                                                            )}
                                                                        </TableCell>
                                                                    );
                                                                })}
                                                            </TableRow>
                                                        </React.Fragment>
                                                    );
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center" style={{ padding: "40px" }}>
                                                        <Typography variant="body1" color="textSecondary">
                                                            No outfit recommendations available at the moment.
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </>
                )}
                {userId && !isLoading && !error && personalizedData.length === 0 && outfitData.length === 0 && (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <Typography variant="body1" color="textSecondary">
                            No recommendations available at the moment.
                        </Typography>
                    </Box>
                )}
                {userId && !isLoading && error && (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <Typography variant="body1" color="error">
                            Failed to load recommendations. Please try again later.
                        </Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CompleteTheLookModal;

