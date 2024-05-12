import axios from "axios";
import { toast } from "react-toastify";
import {
  EditOutlined,
  DeleteOutlined,
  // AttachFileOutlined,
  // GifBoxOutlined,
  ImageOutlined,
  // MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import { useNavigate, useParams } from "react-router-dom";

const MyPostWidget = ({ picturePath, isProfile = false }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate();
  const { userId } = useParams();

  const { palette } = useTheme();
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const getUserPosts = async () => {
    const response = await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/posts/${userId}/posts`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.data;
    dispatch(setPosts({ posts: data }));
    setIsImage(false);
    setImage(null);
    setPost("");
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const toastNotification = toast.loading("Posting...");
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        formData.append("picture", image);
      }

      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_SERVER_URL}/posts`,
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "application/json",
        },
        data: formData,
      });

      if (response.status === 201) {
        toast.update(toastNotification, {
          render: "Posted Successfully",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        if (isProfile) {
          getUserPosts();
        } else {
          const posts = await response.data;
          dispatch(setPosts({ posts }));
          setIsImage(false);
          setImage(null);
          setPost("");
        }
      } else throw response;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <WidgetWrapper mb="2rem">
      <FlexBetween gap="1.5rem">
        <Box
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(`/profile/${_id}`)}
        >
          <UserImage image={picturePath} />
        </Box>
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        {/* {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )} */}
        <FlexBetween gap="0.25rem">
          <MoreHorizOutlined sx={{ color: mediumMain }} />
        </FlexBetween>

        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
            "&:hover": {
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
            },
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
