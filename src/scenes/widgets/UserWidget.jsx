import {
  ManageAccountsOutlined,
  // EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  Facebook,
  Twitter,
  LinkedIn,
  SchoolOutlined,
  Language,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const getUser = async () => {
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_SERVER_URL}/users/${userId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        const data = await response.data;
        setUser(data);
      } else {
        throw response;
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    friends,
    school,
    website,
    facebook,
    twitter,
    linkedIn,
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem">
        <FlexBetween
          gap="1rem"
          onClick={() => navigate(`/profile/${userId}`)}
          sx={{ cursor: "pointer" }}
        >
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <Box>
          {_id === userId && (
            <Tooltip title="Edit Profile">
              <IconButton onClick={() => navigate(`/editProfile/${_id}`)}>
                <ManageAccountsOutlined />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>
            {location ? location : "Edit profile to add"}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>
            {occupation ? occupation : "Edit profile to add"}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <SchoolOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>
            {school ? school : "Edit profile to add"}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap="1rem">
          <Language fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>
            {website ? website : "Edit profile to add"}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Third ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <Twitter fontSize="large" sx={{ color: medium }} />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={medium}>
                {twitter ? twitter : "Edit profile to add"}
              </Typography>
            </Box>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <Facebook fontSize="large" sx={{ color: medium }} />
            <Box>
              <Typography color={main} fontWeight="500">
                Facebook
              </Typography>
              <Typography color={medium}>
                {facebook ? facebook : "Edit profile to add"}
              </Typography>
            </Box>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <LinkedIn fontSize="large" sx={{ color: medium }} />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              <Typography color={medium}>
                {linkedIn ? linkedIn : "Edit profile to add"}
              </Typography>
            </Box>
          </FlexBetween>
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
