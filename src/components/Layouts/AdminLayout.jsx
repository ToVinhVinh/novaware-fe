import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { logout } from '../../actions/userActions';
import { Link as RouterLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Toolbar,
  AppBar,
  CssBaseline,
  Button,
  Typography,
} from "@material-ui/core";
import ViewCarouselIcon from '@material-ui/icons/ViewCarousel';
import clsx from 'clsx';
import logo from "../../assets/images/logo.png";

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {
  Group as GroupIcon,
  Store as StoreIcon,
  Category as CategoryIcon,
  ShoppingBasket as ShoppingBasketIcon,
  Assessment as AssessmentIcon,
  LocalShipping as LocalShippingIcon,
  Chat as ChatIcon,
} from "@material-ui/icons";

const drawerWidth = 240;
const closedDrawerWidth = 55;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    boxShadow: '0px 2px 8px -1px rgb(0 0 0 / 10%)',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarShiftClose: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  logoWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: '0 auto',
  },
  logo: {
    maxWidth: 140,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 120,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: closedDrawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    paddingTop: theme.spacing(13),
    marginTop: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  contentShiftClose: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    fontWeight: 600,
    padding: theme.spacing(2),
    borderBottom: `2px solid ${theme.palette.secondary.main}`,
    textAlign: 'center',
  },
  link: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  listItem: {
    minWidth: '73px',
    paddingLeft: '14px',
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  listItemIcon: {
    color: theme.palette.secondary.main,
  },
  listItemText: {
    whiteSpace: 'nowrap',
  },
  dashboardTitle: {
    paddingLeft: '16px',
    fontWeight: 600,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerPaperClose: {
    width: closedDrawerWidth,
  },
}));

const AdminLayout = ({ children }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const drawerItems = [
    { text: "Manage Users", icon: <GroupIcon />, link: "/admin/userlist" },
    { text: "Manage Brands", icon: <StoreIcon />, link: "/admin/brandlist" },
    {
      text: "Manage Categories",
      icon: <CategoryIcon />,
      link: "/admin/categorylist",
    },
    {
      text: "Manage Products",
      icon: <ShoppingBasketIcon />,
      link: "/admin/productlist",
    },
    { text: "Manage Orders", icon: <LocalShippingIcon />, link: "/admin/orderlist" },
    { text: "Statistics", icon: <AssessmentIcon />, link: "/admin/orderstats" },
    { text: "Chat", icon: <ChatIcon />, link: "/admin/chat" },
    { text: "Edit banner, slider", icon: <ViewCarouselIcon />, link: "/admin/home-content" },
  ];

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* App Bar */}
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
          [classes.appBarShiftClose]: !open,
        })}
      >
        <Toolbar className={classes.toolbar}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
          </div>
          {/* Logo Wrapper */}
          <div className={classes.logoWrapper}>
            <RouterLink to="/">
              <img src={logo} alt="#" className={classes.logo} />
            </RouterLink>
          </div>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="temporary" 
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
            [classes.drawerPaper]: open,
            [classes.drawerPaperClose]: !open,
          }),
        }}
        open={open} 
        onClose={handleDrawerClose} 
      >
        <div className={classes.drawerHeader}>
          <Typography variant="h6" noWrap className={classes.dashboardTitle}>
            Dashboard
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />

        {/* Drawer Items */}
        <List>
          {drawerItems.map((item, index) => (
            <Link to={item.link} key={index} className={classes.link}>
              <ListItem button className={classes.listItem}>
                <ListItemIcon className={classes.listItemIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} className={classes.listItemText} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
          [classes.contentShiftClose]: !open,
        })}
      >
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

