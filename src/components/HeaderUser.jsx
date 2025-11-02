import React, { useCallback } from "react";
import UserIcon from "../assets/icons/user.svg?react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { logout } from "../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { FiLogIn } from "react-icons/fi";
import { openAdminChatDrawer } from "../actions/chatActions";
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

export default function HeaderUser({
  setLoginModalOpen,
  setRegisterModalOpen,
  setForgotPasswordModalOpen,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { userInfo } = useSelector((state) => state.userLogin);
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const theme = useTheme();
  const iconColor = theme.palette.text.primary;
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleChat = useCallback(() => {
    dispatch(openAdminChatDrawer());
  }, [dispatch]);

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const handleLoginClick = () => {
    setLoginModalOpen(true);
    setOpen(false);
  };

  const handleRegisterClick = () => {
    setRegisterModalOpen(true);
    setOpen(false);
  };

  const handleForgotPassword = () => {
    setForgotPasswordModalOpen(true);
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <div>
        {userInfo ? (
          <>
            <IconButton ref={anchorRef} onClick={handleToggle}>
              <UserIcon style={{ fill: iconColor }} height={22} />
            </IconButton>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem component={RouterLink} to="/profile" divider>
                          {userInfo.name ? userInfo.name : "Profile"}
                        </MenuItem>
                        <MenuItem onClick={handleChat}>Chat</MenuItem>                      
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        ) : (
          <>
            <IconButton ref={anchorRef} onClick={handleToggle}>
              <FiLogIn height={22} color="#444" />
            </IconButton>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem onClick={handleLoginClick}>Login</MenuItem>
                        <MenuItem onClick={handleRegisterClick}>
                          Register
                        </MenuItem>
                        <MenuItem onClick={handleForgotPassword}>
                          Forgot Password
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        )}
      </div>
    </div>
  );
}