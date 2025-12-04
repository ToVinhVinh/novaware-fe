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
import { FaTshirt, FaChartLine, FaVenusMars, FaDollarSign, FaGem, FaFemale, FaShoePrints } from "react-icons/fa";
import { PiPants } from "react-icons/pi";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import LottieLoading from "../LottieLoading.jsx";
import { toast } from "react-toastify";
import CallMadeIcon from "@material-ui/icons/CallMade";
import { getScoreChip } from "../../utils/chipUtils.jsx";

const ICON_COLOR = "#ec4899";

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
        backgroundColor: "#fce7f3",
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
        backgroundColor: "#FAFAFA",
        "& .MuiTableCell-head": {
            color: "#000",
            fontWeight: 600,
            fontSize: "1rem",
            padding: "12px",
            position: "sticky",
            top: 0,
            zIndex: 10,
            backgroundColor: "#FAFAFA",
        },
    },
    headerIcon: {
        marginRight: 8,
        fontSize: "1.2rem",
        verticalAlign: "middle",
        color: ICON_COLOR,
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
        position: "relative",
    },
    tableRow: {
        backgroundColor: "#fce7f3",
        "& .MuiTableCell-root": {
            borderBottom: "none",
        },
    },
    productCarouselContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "4px",
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
        "&:hover": {
            borderColor: "#F50057",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
    },
    productImage: {
        width: "100%",
        height: 200,
        objectFit: "cover",
        backgroundColor: "#fff",
        transition: "opacity 0.3s ease-in-out",
        select: "none",
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
        select: "none",
    },
    imageLoading: {
        opacity: 0,
        select: "none",
    },
    imageLoaded: {
        opacity: 1,
        select: "none",
    },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        select: "none",
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
        maxWidth: 66,
        "&:hover": {
            transform: "translateY(-1px)",
        },
        "& svg": {
            fontSize: 14,
            color: ICON_COLOR,
        },
        "& .MuiChip-label": {
            maxWidth: 66,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
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
            color: ICON_COLOR,
        },
        maxWidth: 66,
        "& .MuiChip-label": {
            maxWidth: 66,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
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
            color: ICON_COLOR,
        },
        maxWidth: 66,
        "& .MuiChip-label": {
            maxWidth: 66,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
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
            color: ICON_COLOR,
        },
        maxWidth: 66,
        "& .MuiChip-label": {
            maxWidth: 66,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
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
            color: ICON_COLOR,
        },
        maxWidth: 66,
        "& .MuiChip-label": {
            maxWidth: 66,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
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
            color: ICON_COLOR,
        },
        maxWidth: 66,
        "& .MuiChip-label": {
            maxWidth: 66,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
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
        "&.Mui-selected": {
            color: "#ec4899 !important",
            borderBottom: "2px solid #ec4899",
        },
    },
    tabIndicator: {
        backgroundColor: "#ec4899",
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
    personalizedGridInner: {
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        gap: 0,
    },
    gridItem: {
        padding: "4px",
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

// Parse images which can be either an array or a JSON string like '["url"]'
const parseImages = (images) => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === "string") {
        try {
            const parsed = JSON.parse(images);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }
    return [];
};

const getCategoryFromProductMeta = (product) => {
    if (!product) return "Other";

    const master = (product.masterCategory || "").toLowerCase();
    const sub = (product.subCategory || "").toLowerCase();
    const article = (product.articleType || "").toLowerCase();

    if (sub === "topwear") {
        if (article === "dress" || article === "dresses") {
            return "Dresses";
        }
        return "Tops";
    }

    if (sub === "bottomwear" || ["jeans", "shorts", "trousers", "pants"].includes(article)) {
        return "Bottoms";
    }

    if (master === "footwear" || sub === "shoes" || article.includes("shoe") || article.includes("flip flops")) {
        return "Shoes";
    }

    if (master === "accessories" || sub === "accessories" || sub === "watches" || article === "watches") {
        return "Accessories";
    }

    return normalizeCategoryName(article || sub || master || "Other");
};

const LazyProductImage = ({ src, alt, className, classes }) => {
    const [imageState, setImageState] = useState("loading");
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
    const iconStyle = useMemo(() => ({ color: ICON_COLOR }), []);
    const personalizedData = useMemo(() => {
        if (!recommendationData || !Array.isArray(recommendationData.personalized_products)) return [];

        return recommendationData.personalized_products.map((item) => {
            const product = item.product || {};
            const images = parseImages(product.images);

            const firstVariantPrice = product.variants && product.variants.length > 0
                ? product.variants[0].price || 0
                : product.price || 0;

            return {
                _id: item.product_id,
                product_id: item.product_id,
                name: product.productDisplayName || item.name || "Product",
                images,
                price: firstVariantPrice,
                sale: product.sale || 0,
                rating: product.rating || 0,
                score: item.priority_score,
                priorityScore: item.priority_score,
                gender: product.gender,
                baseColour: product.baseColour,
                articleType: product.articleType,
                usage: product.usage,
                season: product.season,
            };
        });
    }, [recommendationData]);

    const outfitData = useMemo(() => {
        if (!recommendationData || !Array.isArray(recommendationData.outfits)) return [];

        return recommendationData.outfits.map((outfit) => {
            const products = [];

            (outfit.products || []).forEach((item) => {
                const product = item.product;
                if (!product) return;

                const category = getCategoryFromProductMeta(product);
                const images = parseImages(product.images);

                const firstVariantPrice = product.variants && product.variants.length > 0
                    ? product.variants[0].price || 0
                    : product.price || 0;

                products.push({
                    _id: item.product_id,
                    name: product.productDisplayName || product.name || "Product",
                    product_id: item.product_id,
                    category,
                    // Use the price from the first variant as base price
                    price: firstVariantPrice,
                    sale: product.sale || 0,
                    images,
                    articleType: product.articleType,
                    usage: product.usage,
                    season: product.season,
                });
            });

            // Calculate total price using first variant price and sale%
            const totalPrice = products.reduce((sum, p) => {
                const basePrice = p.price || 0;
                const salePercent = p.sale || 0;
                const salePrice = basePrice * salePercent / 100;
                return sum + salePrice;
            }, 0);

            return {
                name: `Outfit ${outfit.outfit_number}`,
                products,
                totalPrice,
                compatibilityScore: outfit.score || 0,
                gender: recommendationData.metadata?.user_gender || user?.gender || "Unisex",
            };
        });
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
                                        color: "#fff",
                                        maxWidth: 66,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                />
                            )}
                            {product.usage && (
                                <Chip
                                    label={product.usage}
                                    variant="outlined"
                                    color="primary"
                                    size="medium"
                                    style={{
                                        fontSize: "0.7rem",
                                        height: 20,
                                        maxWidth: 66,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                />
                            )}
                            {product.season && (
                                <Chip
                                    label={product.season}
                                    variant="outlined"
                                    size="medium"
                                    color="primary"
                                    style={{
                                        fontSize: "0.7rem",
                                        height: 20,
                                        maxWidth: 66,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                />
                            )}
                        </Box>
                    )}
                    <Typography className={classes.productName} variant="body2">
                        {product.name}
                    </Typography>
                    {/* "highlights" / reason removed from UI */}
                    <Typography className={classes.productPrice}>
                        {(() => {
                            const basePrice = product.price || 0;
                            const salePercent = product.sale || 0;
                            const salePrice = salePercent ? basePrice * salePercent / 100 : basePrice;
                            return `$${salePrice.toFixed(2)}`;
                        })()}
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
                    <CloseIcon style={iconStyle} />
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
                            classes={{ indicator: classes.tabIndicator }}
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label="Personalized" className={classes.tab} />
                            <Tab label="Outfit" className={classes.tab} />
                        </Tabs>

                        {/* Personalized Tab */}
                        {activeTab === 0 && (
                            <Box className={classes.tabPanel}>
                                <Box className={classes.personalizedGrid}>
                                    {personalizedData.length > 0 ? (
                                        <Box className={classes.personalizedGridInner}>
                                            {personalizedData.map((product) => (
                                                <Box key={product._id || product.product_id} className={classes.gridItem}>
                                                    {renderProductCard(product, true, true)}
                                                </Box>
                                            ))}
                                        </Box>
                                    ) : (
                                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                                            <Typography variant="body1" color="textSecondary">
                                                No personalized recommendations available at the moment.
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {/* Outfit Tab */}
                        {activeTab === 1 && (
                            <Box className={classes.tabPanel}>
                                <TableContainer component={Paper} className={classes.tableContainer}>
                                    <Table className={classes.table} aria-label="outfit table" stickyHeader>
                                        <TableHead className={classes.tableHeader}>
                                            <TableRow className={classes.tableRow}>
                                                {["Tops", "Dresses", "Bottoms", "Shoes", "Accessories"].map((category) => (
                                                    <TableCell key={category} align="center">
                                                        <Box className={classes.headerContent}>
                                                            {getCategoryIcon(category)}
                                                            <Typography variant="body1" component="span" style={{ color: ICON_COLOR, fontWeight: 600 }}>
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
                                                            <TableRow className={classes.tableRow}>
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
                                                <TableRow className={classes.tableRow}>
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

