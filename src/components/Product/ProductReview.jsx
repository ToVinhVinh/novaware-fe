import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Link,
  Button,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useCreateReview } from "../../hooks/api/useProduct";
import Message from "../Message";
import Loader from "../Loader";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1.5),
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    borderRadius: "50%",
  },
  reviewHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  comment: {
    marginTop: theme.spacing(1),
    whiteSpace: "pre-line",
    fontSize: "15px",
    fontWeight: "bolder",
    color: theme.palette.text.primary,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
  },
  rating: {
    fontSize: "1.2rem",
  },
  textField: {
    borderRadius: theme.spacing(1),
  },
  submitButton: {
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1, 3),
    width: "100px",
  },
}));

const ProductReview = ({ reviews, productId }) => {
  const classes = useStyles();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const createReviewMutation = useCreateReview();
  const { isLoading: loadingProductReview, isSuccess: successProductReview, error: errorProductReview } = createReviewMutation;

  const handleCommentChange = (e) => {
    setComment(e.target.value);
    if (comment.trim()) {
      setMessage("");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        await createReviewMutation.mutateAsync({
          id: productId,
          body: { rating, comment }
        });
        setRating(0);
        setComment("");
      } catch (error) {
        console.error("Failed to create review:", error);
      }
    } else {
      setMessage("Please write a comment!");
    }
  };

  return (
    <>
      <Box my={3}>
        <Typography variant="h4" align="center">
          Customer Reviews
        </Typography>
      </Box>
      {reviews.map((review) => (
        <Card className={classes.card} key={review._id} elevation={1}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar
                  className={classes.avatar}
                  alt="avatar"
                  src={`https://ui-avatars.com/api/?background=random&color=fff&name=${review.name}`}
                />
              </Grid>
              <Grid item xs>
                <div className={classes.reviewHeader}>
                  <Typography variant="h6" style={{ marginRight: "8px" }}>
                    {review.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {review.createdAt.substring(0, 10)}
                  </Typography>
                </div>
                <Rating
                  name="rating"
                  value={review.rating}
                  precision={0.5}
                  readOnly
                  className={classes.rating}
                />
                <Typography
                  variant="body1"
                  className={classes.comment}
                  color="textPrimary"
                >
                  {review.comment}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
      <Card className={classes.card} elevation={1}>
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              {loadingProductReview && <Loader />}
              {errorProductReview && <Message>{errorProductReview.message || String(errorProductReview)}</Message>}
              {userInfo ? (
                <form onSubmit={handleSubmitReview} className={classes.form}>
                  <Typography variant="h5">Write a review</Typography>
                  <Rating
                    name="rating-value"
                    value={rating}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                    className={classes.rating}
                  />
                  <TextField
                    variant="outlined"
                    label="Comment"
                    multiline
                    fullWidth
                    value={comment}
                    error={!!message}
                    helperText={message}
                    onChange={handleCommentChange}
                    className={classes.textField}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    className={classes.submitButton}
                  >
                    Submit
                  </Button>
                </form>
              ) : (
                <Message severity="info">
                  Please{" "}
                  <Link
                    component={RouterLink}
                    to={`/login?redirect=/product/${productId}`}
                  >
                    login
                  </Link>{" "}
                  to write a review
                </Message>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductReview;
