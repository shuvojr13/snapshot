import axios from "axios";
import { Send } from "@mui/icons-material";
import { InputBase, useTheme, Button } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import UserImage from "../../components/UserImage";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";

const MyCommmentWidget = ({ postId }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const { palette } = useTheme();
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("text", comment);

      const response = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_SERVER_URL}/posts/${postId}/comment`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: formData,
      });
      if (response.status === 201) {
        const updatedPost = await response.data;
        dispatch(setPost({ post: updatedPost }));
        setComment("");
      } else {
        throw response;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <WidgetWrapper>
      <form onSubmit={handleSubmit}>
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} size="40px" />
          <InputBase
            placeholder="Comment here..."
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: ".5rem 1rem",
            }}
          />
          <Button
            type="submit"
            disabled={!comment}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            <Send />
          </Button>
        </FlexBetween>
      </form>
    </WidgetWrapper>
  );
};

export default MyCommmentWidget;
