import React, { useEffect } from "react";
import { Link as LinkRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@material-ui/core";
import { closeFavoriteDrawer } from "../../actions/favoriteActions";
import { useGetFavorites, useRemoveFavorite } from "../../hooks/api/useUser";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteIcon from "@material-ui/icons/Delete";
import emptyGif from "../../assets/images/Empty.gif";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    height: "100%",
    padding: 20,
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.down("xs")]: {
      width: 300,
    },
  },
  title: {
    ...theme.mixins.customize.flexMixin("space-between", "center"),
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(15),
  },
  listProduct: {
    overflowY: "auto",
    maxHeight: "60%",
    marginTop: 10,
    marginBottom: 10,
    "&::-webkit-scrollbar": {
      width: 8,
    },
    "&::-webkit-scrollbar-thumb": {
      background: theme.palette.secondary.main,
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(245, 0, 87, 0.04)",
    },
    "& .MuiListItem-container:last-child > .MuiListItem-divider": {
      borderBottom: "none",
    },
  },
  priceTotal: {
    ...theme.mixins.customize.flexMixin("space-between", "center"),
    padding: "10px 0",
  },
  button: {
    margin: "10px 0",
    "& + $button": {
      marginTop: 2,
    },
  },
  empty: {
    ...theme.mixins.customize.centerFlex("column wrap"),
    marginTop: 30,
  },
}));

const FavoritePreview = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const favoriteDrawer = useSelector((state) => state.favoriteDrawer || { open: false });
  const isOpenDrawer = favoriteDrawer.open || false;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const { data: favoritesResponse } = useGetFavorites(userInfo?._id || "");
  const favoriteItems = favoritesResponse?.data?.favoriteItems || [];

  const removeFavoriteMutation = useRemoveFavorite();

  const removeFromFavoritesHandler = async (productId) => {
    if (userInfo?._id) {
      try {
        await removeFavoriteMutation.mutateAsync({
          userId: userInfo._id,
          productId: productId
        });
      } catch (error) {
        console.error("Failed to remove favorite:", error);
      }
    }
  };

  const onDrawerClose = () => {
    dispatch(closeFavoriteDrawer());
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={isOpenDrawer}
      onClose={onDrawerClose}
      onOpen={() => {}} // No action needed to open
    >
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h5" component="h2" gutterBottom>
            Favorites ({favoriteItems ? favoriteItems.length : 0})
          </Typography>
          <IconButton color="secondary" onClick={onDrawerClose}>
            <ClearIcon />
          </IconButton>
        </div>
        <Divider variant="fullWidth" />
        {favoriteItems && favoriteItems.length > 0 ? (
          <>
            <List className={classes.listProduct}>
              {favoriteItems.map((item) => (
                <ListItem divider disableGutters key={item._id}>
                  <ListItemAvatar>
                    <Avatar
                      variant="square"
                      src={item.images && item.images[0]}
                      alt="product image"
                      className={classes.large}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`$${item.price} | ${item.category}`} // Customize as needed
                    style={{ marginLeft: 10 }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => removeFromFavoritesHandler(item._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Divider variant="fullWidth" />
            {/* You can add more details or buttons here if needed */}
          </>
        ) : (
          <div className={classes.empty}>
            <Typography variant="subtitle1" color="secondary">
              Your favorites list is empty.{" "}
              <Link
                to="/"
                component={LinkRouter}
                color="primary"
                onClick={onDrawerClose}
              >
                Start shopping!
              </Link>
            </Typography>
            <img src={emptyGif} alt="empty" />
          </div>
        )}
      </div>
    </SwipeableDrawer>
  );
};

export default FavoritePreview;
