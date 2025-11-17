import axios from "axios";
import React, { useState, useEffect } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useGetProduct, useUpdateProduct } from "../../hooks/api/useProduct";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Paper,
  TextField,
  Container,
  Button,
  Box,
  Grid,
  InputLabel,
  IconButton,
} from "@material-ui/core";
import Meta from "../../components/Meta";

const useStyles = makeStyles((theme) => ({
  form: {
    "& > *": {
      marginBottom: 16,
    },
    "& .MuiInput-underline:before": {
      borderColor: "rgba(224, 224, 224, 1)",
    },
  },
  container: {
    marginBottom: 64,
    boxShadow: "0 10px 31px 0 rgba(0,0,0,0.05)",
  },
  imagePreview: {
    position: "relative",
    marginTop: 8,
    marginRight: 16,
    "& > img": {
      width: 120,
      height: 160,
      objectFit: "cover",
      borderRadius: 6,
    },
    "& .MuiIconButton-root": {
      position: "absolute",
      top: 5,
      right: 5,
    },
  },
  errorText: {
    color: theme.palette.error.main,
  },
}));

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;
  const classes = useStyles();

  // States
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [images, setImages] = useState([]);
  const [imageLinksInput, setImageLinksInput] = useState("");
  const [productDisplayName, setProductDisplayName] = useState("");
  const [gender, setGender] = useState("");
  const [masterCategory, setMasterCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [articleType, setArticleType] = useState("");
  const [baseColour, setBaseColour] = useState("");
  const [season, setSeason] = useState("");
  const [year, setYear] = useState("");
  const [usage, setUsage] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [sale, setSale] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [didMount, setDidMount] = useState(false);

  const { data: productResponse, isLoading: loading, error } = useGetProduct(productId);
  const product = productResponse?.data?.product;
  const updateProductMutation = useUpdateProduct();
  const { isLoading: loadingUpdate, error: errorUpdate, isSuccess: successUpdate } = updateProductMutation;

  useEffect(() => {
    setDidMount(true);
    return () => {
      if (didMount) {
        previewImages.forEach((image) => {
          if (typeof image === "string" && image.startsWith("blob:")) {
            URL.revokeObjectURL(image);
          }
        });
      }
    };
  }, [previewImages, didMount]);

  const handleImagesUpload = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files);
    setImages(filesArray);
    const imagesUrl = filesArray.map((image) => URL.createObjectURL(image));
    setPreviewImages(imagesUrl);
    setImageLinksInput("");
    setFormErrors({ ...formErrors, images: false });
  };

  const handleRemovePreviewImages = (removeImage) => {
    const newPreviewImages = previewImages.filter(
      (image) => image !== removeImage
    );
    setPreviewImages(newPreviewImages);
    if (typeof removeImage === "string" && removeImage.startsWith("blob:")) {
      URL.revokeObjectURL(removeImage);
    }
    const remainingRemoteImages = newPreviewImages.filter(
      (image) => typeof image === "string" && !image.startsWith("blob:")
    );
    if (images.length === 0) {
      setImageLinksInput(remainingRemoteImages.join("\n"));
    }
  };

  const handleApplyImageLinks = () => {
    const parsedLinks = imageLinksInput
      .split(/\r?\n|,/)
      .map((link) => link.trim())
      .filter((link) => link.length > 0);

    if (parsedLinks.length === 0) {
      setFormErrors({ ...formErrors, images: true });
      return;
    }

    setPreviewImages(parsedLinks);
    setImages([]);
    setFormErrors({ ...formErrors, images: false });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!productDisplayName) errors.productDisplayName = true;
    if (!gender) errors.gender = true;
    if (!masterCategory) errors.masterCategory = true;
    if (!subCategory) errors.subCategory = true;
    if (!articleType) errors.articleType = true;
    if (!baseColour) errors.baseColour = true;
    if (!season) errors.season = true;
    if (!usage) errors.usage = true;
    if (year && Number(year) < 0) errors.year = true;
    if (ratingValue < 0 || ratingValue > 5) errors.ratingValue = true;
    if (sale < 0) errors.sale = true;
    if (previewImages.length === 0) errors.images = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    let uploadedImages = [];
    if (images.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
      setUploading(true);
      try {
        const { data: response } = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        uploadedImages = response.data.map((item) => item.url);
      } catch (error) {
        setUploading(false);
        toast.error("Error uploading images!");
        return;
      }
    }

    const normalizedYear = year ? Number(year) : undefined;
    const productData = {
      _id: productId,
      name: productDisplayName,
      productDisplayName,
      gender,
      masterCategory,
      subCategory,
      articleType,
      baseColour,
      season,
      year: normalizedYear,
      usage,
      rating: Number(ratingValue) || 0,
      sale: Number(sale) || 0,
      images: uploadedImages.length > 0 ? uploadedImages : previewImages,
    };

    try {
      await updateProductMutation.mutateAsync({
        id: productId,
        body: productData,
      });
      toast.success("Product updated successfully!");
      history.push("/admin/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Update product failed!");
    } finally {
      setUploading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (successUpdate) {
      toast.success("Product updated successfully!");
      history.push("/admin/products");
    }
  }, [successUpdate, history]);

  useEffect(() => {
    if (product && String(product._id) === productId) {
      setProductDisplayName(product.productDisplayName || product.name || "");
      setGender(product.gender || "");
      setMasterCategory(product.masterCategory || "");
      setSubCategory(product.subCategory || "");
      setArticleType(product.articleType || "");
      setBaseColour(product.baseColour || "");
      setSeason(product.season || "");
      setYear(product.year ? String(product.year) : "");
      setUsage(product.usage || "");
      setRatingValue(
        typeof product.rating === "number" ? product.rating : Number(product.rating) || 0,
      );
      setSale(typeof product.sale === "number" ? product.sale : Number(product.sale) || 0);
      const productImages = Array.isArray(product.images) ? product.images : [];
      setPreviewImages(productImages);
      setImageLinksInput(productImages.join("\n"));
    }
  }, [productId, product]);

  // Render
  return (
    <Container style={{ marginBottom: 140, maxWidth: "100%" }}>
      <Meta title="Edit Product" />
      <Grid
        container
        component={Paper}
        elevation={0}
        spacing={8}
        className={classes.container}
      >
        {loading ? (
          <Loader />
        ) : error ? (
          <Message>{error}</Message>
        ) : (
          <>
            <Grid item xs={12} lg={9}>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                style={{ textAlign: "center" }}
              >
                Edit Product
              </Typography>
              {loadingUpdate && <Loader />}
              {errorUpdate && <Message>{errorUpdate}</Message>}
              <form onSubmit={submitHandler} className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      label="Product Display Name"
                      name="productDisplayName"
                      value={productDisplayName}
                      onChange={(e) => {
                        setProductDisplayName(e.target.value);
                        setFormErrors({ ...formErrors, productDisplayName: false });
                      }}
                      fullWidth
                      error={formErrors.productDisplayName}
                      helperText={formErrors.productDisplayName && "Required"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      label="Gender"
                      name="gender"
                      value={gender}
                      onChange={(e) => {
                        setGender(e.target.value);
                        setFormErrors({ ...formErrors, gender: false });
                      }}
                      fullWidth
                      error={formErrors.gender}
                      helperText={formErrors.gender && "Required"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      label="Master Category"
                      name="masterCategory"
                      value={masterCategory}
                      onChange={(e) => {
                        setMasterCategory(e.target.value);
                        setFormErrors({ ...formErrors, masterCategory: false });
                      }}
                      fullWidth
                      error={formErrors.masterCategory}
                      helperText={formErrors.masterCategory && "Required"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      label="Sub Category"
                      name="subCategory"
                      value={subCategory}
                      onChange={(e) => {
                        setSubCategory(e.target.value);
                        setFormErrors({ ...formErrors, subCategory: false });
                      }}
                      fullWidth
                      error={formErrors.subCategory}
                      helperText={formErrors.subCategory && "Required"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      label="Article Type"
                      name="articleType"
                      value={articleType}
                      onChange={(e) => {
                        setArticleType(e.target.value);
                        setFormErrors({ ...formErrors, articleType: false });
                      }}
                      fullWidth
                      error={formErrors.articleType}
                      helperText={formErrors.articleType && "Required"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      label="Base Colour"
                      name="baseColour"
                      value={baseColour}
                      onChange={(e) => {
                        setBaseColour(e.target.value);
                        setFormErrors({ ...formErrors, baseColour: false });
                      }}
                      fullWidth
                      error={formErrors.baseColour}
                      helperText={formErrors.baseColour && "Required"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      label="Season"
                      name="season"
                      value={season}
                      onChange={(e) => {
                        setSeason(e.target.value);
                        setFormErrors({ ...formErrors, season: false });
                      }}
                      fullWidth
                      error={formErrors.season}
                      helperText={formErrors.season && "Required"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      label="Year"
                      name="year"
                      type="number"
                      inputProps={{ min: 0 }}
                      value={year}
                      onChange={(e) => {
                        setYear(e.target.value);
                        setFormErrors({ ...formErrors, year: false });
                      }}
                      fullWidth
                      error={formErrors.year}
                      helperText={formErrors.year && "Year must be positive"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      required
                      label="Usage"
                      name="usage"
                      value={usage}
                      onChange={(e) => {
                        setUsage(e.target.value);
                        setFormErrors({ ...formErrors, usage: false });
                      }}
                      fullWidth
                      error={formErrors.usage}
                      helperText={formErrors.usage && "Required"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      label="Rating"
                      name="rating"
                      type="number"
                      inputProps={{ min: 0, max: 5, step: 0.1 }}
                      value={ratingValue}
                      onChange={(e) => {
                        setRatingValue(e.target.value);
                        setFormErrors({ ...formErrors, ratingValue: false });
                      }}
                      fullWidth
                      error={formErrors.ratingValue}
                      helperText={formErrors.ratingValue ? "Rating must be between 0 and 5" : "0 - 5"}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      size="small"
                      label="Sale (%)"
                      name="sale"
                      type="number"
                      inputProps={{ min: 0, step: 0.01 }}
                      value={sale}
                      onChange={(e) => {
                        setSale(e.target.value);
                        setFormErrors({ ...formErrors, sale: false });
                      }}
                      fullWidth
                      error={formErrors.sale}
                      helperText={formErrors.sale && "Must be at least 0"}
                    />
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <InputLabel style={{ marginBottom: 8 }}>Upload images</InputLabel>
                  <input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    onChange={handleImagesUpload}
                    type="file"
                    hidden
                  />
                  <label htmlFor="contained-button-file">
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<MdCloudUpload />}
                      component="span"
                    >
                      Upload
                    </Button>
                  </label>
                  <Box my={2} display="flex" flexWrap="wrap">
                    {previewImages.map((image, index) => (
                      <div className={classes.imagePreview} key={`${image}-${index}`}>
                        <img src={image} alt="" />
                        <IconButton size="small" onClick={() => handleRemovePreviewImages(image)}>
                          <MdClose />
                        </IconButton>
                      </div>
                    ))}
                  </Box>
                  {formErrors.images && (
                    <p className={classes.errorText}>Please provide at least one image</p>
                  )}
                </Box>

                <Box mt={2}>
                  <TextField
                    variant="outlined"
                    size="small"
                    label="Image URLs (one per line or comma separated)"
                    multiline
                    minRows={3}
                    fullWidth
                    value={imageLinksInput}
                    onChange={(e) => setImageLinksInput(e.target.value)}
                  />
                  <Box mt={1} display="flex" justifyContent="flex-end">
                    <Button variant="outlined" color="primary" onClick={handleApplyImageLinks}>
                      Apply Links
                    </Button>
                  </Box>
                </Box>

                <Button type="submit" variant="contained" color="secondary">
                  Submit
                </Button>
              </form>
              {uploading && <Loader />}
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default ProductEditScreen;
