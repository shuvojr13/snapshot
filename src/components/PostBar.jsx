import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TimeAgo from "react-timeago";
import { setFriends, setPosts } from "../state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { toast } from "react-toastify";

const PostBar = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  postId,
  friendLocation,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id, friends } = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  const deletePost = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    // console.log(_id, postId);
    const toastNotification = toast.loading("Deleting Post...");
    try {
      const response = await axios({
        method: "delete",
        url: `${process.env.REACT_APP_SERVER_URL}/posts/${postId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: formData,
      });

      if (response.status === 200) {
        toast.update(toastNotification, {
          render: "Deleted Successfully",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        const updatedPosts = posts.filter((post) => post._id !== postId);
        dispatch(setPosts({ posts: updatedPosts }));
      } else {
        throw response;
      }
    } catch (err) {
      toast.update(toastNotification, {
        render: err.response.data.message,
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
      console.log(err);
    }
  };

  const patchFriend = async () => {
    try {
      const res1 = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_SERVER_URL}/users/${_id}/${friendId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_SERVER_URL}/chat/${_id}/${friendId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res1.status === 200) {
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
        const data = await res1.data;
        dispatch(setFriends({ friends: data }));
      } else {
        throw res1;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <Box
          sx={{ cursor: "pointer" }}
          onClick={() => {
            navigate(`/profile/${friendId}`);
          }}
        >
          <UserImage image={userPicturePath} size="55px" />
        </Box>
        <Box>
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
            onClick={() => {
              navigate(`/profile/${friendId}`);
              // navigate(0);
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle ? (
              // `${new Date(subtitle).toLocaleTimeString()} | ${new Date(
              //     subtitle
              //   ).toLocaleDateString()}`
              // format(subtitle)
              <TimeAgo date={subtitle} />
            ) : (
              friendLocation
            )}
          </Typography>
        </Box>
      </FlexBetween>
      <FlexBetween gap={2}>
        {_id === friendId && (
          <Tooltip title="Delete Post">
            <IconButton
              onClick={() => deletePost()}
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        {_id !== friendId && (
          <Tooltip title={isFriend ? "Unfriend" : "Add Friend"}>
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
          </Tooltip>
        )}
      </FlexBetween>
    </FlexBetween>
  );
};

export default PostBar;
