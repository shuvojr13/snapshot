import { DarkMode, LightMode, Message, Search } from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  Avatar,
  Button,
  CircularProgress,
  // useMediaQuery,
  Dialog,
  DialogTitle,
  // Box,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
  // Select,
  // MenuItem,
  // FormControl,
  useTheme,
} from "@mui/material";
import axios from "axios";
import FlexBetween from "../../components/FlexBetween";
import Logo from "../../components/Logo";
import UserImage from "../../components/UserImage";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { setLogout, setMode } from "";
import { setLogout, setMode } from "../../state/index";

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  // const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  // const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  // const fullName = `${user.firstName} ${user.lastName}`;

  const handleSearch = async (e) => {
    if (e.code === "Enter") {
      // console.log(searchText);
      setLoading(true);
      try {
        const response = await axios({
          method: "post",
          url: `${process.env.REACT_APP_SERVER_URL}/users/search`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { searchText: searchText },
        });

        if (response.status === 200) {
          setLoading(false);
          // console.log(response.data);
          setSearchResult(response.data);
          // handleClickOpen();
        } else {
          throw response;
        }
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchResult([]);
  };

  const handleLogOut = () => {
    dispatch(setLogout());
    toast.success("Logged Out successfully", {
      autoClose: 1500,
      hideProgressBar: true,
    });
  };

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1rem">
        <Logo />
        <Tooltip title="Search People">
          <IconButton
            onClick={handleClickOpen}
            sx={{
              bgcolor: primaryLight,
            }}
          >
            <Search
              color="primary"
              sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }}
            />
          </IconButton>
        </Tooltip>
      </FlexBetween>

      {/* Searching Dialog */}
      <Dialog onClose={handleClose} open={open}>
        <FlexBetween
          backgroundColor={neutralLight}
          borderRadius="9px"
          gap="3rem"
          padding="0.1rem 1.5rem"
          m="1rem 2rem 0 2rem"
        >
          <InputBase
            placeholder="SearchPeople..."
            onChange={(e) => setSearchText(e.target.value)}
            onKeyUpCapture={handleSearch}
            onClick={handleClickOpen}
          />
          <IconButton onKeyUpCapture={handleSearch}>
            <Search color="primary" />
          </IconButton>
        </FlexBetween>
        <DialogTitle sx={{ textAlign: "center" }}>Search Results</DialogTitle>
        {loading && <CircularProgress />}
        <List sx={{ pt: 0 }}>
          {searchResult.map((item) => (
            <ListItem
              key={item._id}
              onClick={() => {
                navigate(`/profile/${item._id}`);
                // navigate(0);
                handleClose();
              }}
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar sx={{}}>
                    <UserImage image={item.picturePath} size="50px" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${item.firstName}  ${item.lastName}`} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>

      {/* nav menu */}
      <FlexBetween gap="0.5rem">
        <IconButton onClick={() => dispatch(setMode())}>
          {theme.palette.mode === "dark" ? (
            <DarkMode sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
          ) : (
            <LightMode
              sx={{ color: dark, fontSize: { xs: "1.2rem", md: "1.5rem" } }}
            />
          )}
        </IconButton>
        <IconButton onClick={() => navigate("/chat")}>
          <Message sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
        </IconButton>
        {/* <Notifications sx={{ fontSize: "25px" }} /> */}
        {/* <Help sx={{ fontSize: "25px" }} /> */}
        <Button
          variant="contained"
          // color="error"
          // size="small"
          // sx={{ bgcolor: "errro.main" }}
          onClick={handleLogOut}
          sx={{ fontSize: { xs: ".5rem", md: ".8rem" }, ml: ".5rem" }}
        >
          Logout
          {/* <LogoutOutlined /> */}
        </Button>
      </FlexBetween>
    </FlexBetween>
  );
};

export default Navbar;
