import React from "react";
import axios from "axios";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state";
import FlexBetween from "./FlexBetween";
import { toast } from "react-toastify";
import UserImage from "./UserImage";

const PostBarFriend = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  postId,
  friendOfFriends,
  setFriendOfFriends,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id, friends } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    try {
      const response = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_SERVER_URL}/users/${_id}/${friendId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        if (isFriend) {
          toast.error("Unfriend Done!", {
            autoClose: 1000,
            hideProgressBar: true,
          });
        } else {
          toast.success("Added as a friend!", {
            autoClose: 1000,
            hideProgressBar: true,
          });
        }
        const data = await response.data;
        setFriendOfFriends(friendOfFriends.filter((d) => d !== _id));
        dispatch(setFriends({ friends: data }));
      } else {
        throw response;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            // navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <FlexBetween gap={2}>
        {_id !== friendId && (
          <IconButton
            onClick={() => patchFriend()}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            {isFriend ? (
              <PersonRemoveOutlined sx={{ color: primaryDark }} />
            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
          </IconButton>
        )}
      </FlexBetween>
    </FlexBetween>
  );
};

export default PostBarFriend;
