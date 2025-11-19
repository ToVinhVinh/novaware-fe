import React, { useEffect, useState, useMemo } from "react";
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
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { FaTshirt, FaChartLine, FaVenusMars, FaInfoCircle, FaDollarSign, FaGem, FaFemale, FaShoePrints } from "react-icons/fa";
import { PiPants } from "react-icons/pi";
import { makeStyles } from "@material-ui/core/styles";
import { useGNNModelRecommendations } from "../../hooks/api/useRecommend";
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
        marginTop: 16,
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
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        minHeight: 40,
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
        marginBottom: 16,
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

const CompleteTheLookModal = ({ open, onClose, userId, productId, user }) => {
    const classes = useStyles();
    const [recommendationData, setRecommendationData] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    const getGNNRecommendations = useGNNModelRecommendations();

    // Fetch recommendations when modal opens
    useEffect(() => {
        if (!open || !userId || !productId) {
            setRecommendationData(null);
            return;
        }

        const fetchRecommendations = async () => {
            try {
                const requestData = {
                    user_id: userId,
                    current_product_id: productId,
                    top_k_personal: 6,
                    top_k_outfit: 5,
                };

                const result = await getGNNRecommendations.mutateAsync(requestData);
                setRecommendationData(result);
            } catch (error) {
                console.error("Failed to fetch recommendations:", error);
                toast.error("Failed to load outfit recommendations.");
            }
        };

        fetchRecommendations();
    }, [open, userId, productId]);

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
                price: variant?.price || item.product?.price || 0, // Get price from first variant or product
                sale: variant?.sale || item.product?.sale || 0, // Get sale from first variant or product
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

    // Process outfit recommendations
    const outfitData = useMemo(() => {
        if (!recommendationData || !recommendationData.outfit) return [];

        const outfits = [];
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
            };

            // Map all products from all categories
            categories.forEach((category) => {
                const categoryData = outfitCategories[category];
                if (!categoryData || !categoryData.product) return;

                const normalizedCategory = normalizeCategoryName(category);
                const product = categoryData.product;
                const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;

                outfit.products.push({
                    _id: product.id,
                    name: product.productDisplayName || product.name || "Product",
                    product_id: product.id,
                    category: normalizedCategory,
                    price: variant?.price || product.price || 0, // Get price from first variant or product
                    sale: variant?.sale || product.sale || 0, // Get sale from first variant or product
                    images: product.images || [],
                    score: categoryData.score,
                    reason: categoryData.reason,
                    articleType: product.articleType,
                    usage: product.usage,
                    season: product.season,
                });
            });

            // Calculate total price
            outfit.totalPrice = outfit.products.reduce((sum, p) => sum + (p.price || 0) * (1 - (p.sale || 0) / 100), 0);

            outfits.push(outfit);
        });

        return outfits;
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

    const renderProductCard = (product, showReason = false, showScore = false) => (
        <Card
            className={classes.productCard}
            onClick={() => window.open(`/product?id=${product._id || product.product_id || ''}`, "_blank")}
        >
            <img
                src={product.images && product.images.length > 0 ? product.images[0] : "https://www.lwf.org/images/emptyimg.png"}
                alt={product.name}
                className={classes.productImage}
            />
            <Box className={classes.productInfo}>
                {(product.articleType || product.usage || product.season) && (
                    <Box style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                        {product.articleType && (
                            <Chip
                                label={product.articleType}
                                variant="outlined"
                                size="medium"
                                style={{ fontSize: "0.7rem", height: 20 }}
                            />
                        )}
                        {product.usage && (
                            <Chip
                                label={product.usage}
                                variant="outlined"
                                size="medium"
                                style={{ fontSize: "0.7rem", height: 20 }}
                            />
                        )}
                        {product.season && (
                            <Chip
                                label={product.season}
                                variant="outlined"
                                size="medium"
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
                    {((product.price || 0) * (1 - ((product.sale || 0) / 100))).toFixed(2)}
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
                <Typography variant="h5" align="center" className="tracking-widest">Complete the Look</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    className={classes.closeButton}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.outfitModalContent}>
                {userId && getGNNRecommendations.isLoading && (
                    <LottieLoading />
                )}
                {userId && !getGNNRecommendations.isLoading && !getGNNRecommendations.error && (personalizedData.length > 0 || outfitData.length > 0) && (
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
                                                                {categories.map((category) => (
                                                                    <TableCell key={category} className={classes.tableCell} align="center" style={{ verticalAlign: "top" }}>
                                                                        <Box className={classes.productCardContainer}>
                                                                            {productsByCategory[category]?.length > 0 ? (
                                                                                productsByCategory[category].map((product) => renderProductCard(product))
                                                                            ) : (
                                                                                <Typography variant="body2" color="textSecondary" style={{ textAlign: "center", padding: "20px" }}>
                                                                                    No items
                                                                                </Typography>
                                                                            )}
                                                                        </Box>
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                            {/* Row 2: Metadata information spanning all columns */}
                                                            <TableRow>
                                                                <TableCell
                                                                    className={classes.tableCell}
                                                                    colSpan={categories.length}
                                                                    style={{ backgroundColor: "#fff", padding: "12px 16px", borderRight: "1px solid #e0e0e0" }}
                                                                >
                                                                    <Box className={classes.outfitMeta} style={{ flexDirection: "row", alignItems: "center", gap: 16, flexWrap: "wrap", backgroundColor: "#fff" }}>
                                                                        <Typography variant="h6" component="h3">
                                                                            {outfit.name || `Outfit ${outfitIndex + 1}`}
                                                                        </Typography>
                                                                        <Chip
                                                                            icon={<FaDollarSign />}
                                                                            label={`Total: ${(outfit.totalPrice || 0).toFixed(2)}`}
                                                                            className={`${classes.metaChip} ${classes.totalChip}`}
                                                                            size="small"
                                                                        />
                                                                        {outfit.compatibilityScore !== undefined && (
                                                                            <Chip
                                                                                icon={<FaChartLine />}
                                                                                label={`Compatibility: ${(outfit.compatibilityScore * 100).toFixed(0)}%`}
                                                                                className={`${classes.metaChip} ${classes.compatibilityChip}`}
                                                                                size="small"
                                                                            />
                                                                        )}
                                                                        {outfit.gender && (
                                                                            <Chip
                                                                                icon={<FaVenusMars />}
                                                                                label={`Gender: ${outfit.gender}`}
                                                                                className={`${classes.metaChip} ${classes.genderChip}`}
                                                                                size="small"
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </TableCell>
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
                {userId && !getGNNRecommendations.isLoading && !getGNNRecommendations.error && personalizedData.length === 0 && outfitData.length === 0 && (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <Typography variant="body1" color="textSecondary">
                            No recommendations available at the moment.
                        </Typography>
                    </Box>
                )}
                {userId && !getGNNRecommendations.isLoading && getGNNRecommendations.error && (
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

