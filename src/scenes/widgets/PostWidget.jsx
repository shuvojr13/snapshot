import {
  ChatBubbleOutlineOutlined,
  Delete,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  // Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import TimeAgo from "react-timeago";
import axios from "axios";
import FlexBetween from "../../components/FlexBetween";
import MyCommmentWidget from "./MyCommentWidget";
import PostBar from "../../components/PostBar";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state/index";
import { useNavigate } from "react-router-dom";
import UserImage from "../../components/UserImage";
// import { date } from "yup";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  picturePath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [isLiked, setIsLiked] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  useEffect(() => {
    if (likes.includes(_id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateLike = async () => {
    try {
      const response = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_SERVER_URL}/posts/${postId}/like`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { userId: _id },
      });
      if (response.status === 200) {
        const updatedPost = await response.data;
        dispatch(setPost({ post: updatedPost }));
        setIsLiked((prev) => !prev);
      } else {
        throw response;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_SERVER_URL}/posts/${postId}/comment/${commentId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { userId: _id },
      });
      if (response.status === 200) {
        const updatedPost = await response.data;
        dispatch(setPost({ post: updatedPost }));
      } else {
        throw response;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <WidgetWrapper mb="2rem">
        <PostBar
          friendId={postUserId}
          name={name}
          subtitle={createdAt}
          userPicturePath={userPicturePath}
          postId={postId}
        />
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
        {picturePath && (
          <img
            width="100%"
            height="auto"
            alt="post"
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
            src={picturePath}
          />
        )}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={handleUpdateLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likes.length}</Typography>
            </FlexBetween>

            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>

          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
        {isComments && (
          <Box mt="0.5rem">
            <MyCommmentWidget postId={postId} />
            {comments.map((comment) => (
              <Box key={comment._id} px="1.5rem">
                <Divider />
                <FlexBetween>
                  <FlexBetween
                    mt=".5rem"
                    gap=".5rem"
                    onClick={() => {
                      navigate(`/profile/${comment.userId}`);
                      // navigate(0);
                    }}
                  >
                    <UserImage image={comment.userPicturePath} size="30px" />
                    <Box>
                      <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                          "&:hover": {
                            color: palette.primary.dark,
                            cursor: "pointer",
                          },
                        }}
                      >
                        {`${comment.firstName} ${comment.lastName} `}
                      </Typography>
                      <Typography fontSize=".7rem">
                        {/* {`${new Date(
                        comment.createdAt
                      ).toLocaleTimeString()} | ${new Date(
                        comment.createdAt
                      ).toLocaleDateString()}`} */}
                        <TimeAgo date={comment.createdAt} />
                      </Typography>
                    </Box>
                  </FlexBetween>

                  <Box>
                    {_id === comment.userId && (
                      <Tooltip title="Delete Comment">
                        <IconButton
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      // <Button size="small" variant="contained">
                      //   delete
                      // </Button>
                    )}
                  </Box>
                </FlexBetween>

                <Typography sx={{ color: main, m: "0.5rem 0", pl: "2rem" }}>
                  {comment.text}
                </Typography>
              </Box>
            ))}
            <Divider />
          </Box>
        )}
      </WidgetWrapper>
    </Box>
  );
};

export default PostWidget;
