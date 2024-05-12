import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  // console.log(userId);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/posts`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.data;
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/posts/${userId}/posts`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.data;
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts &&
        posts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
            createdAt,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
              createdAt={createdAt}
            />
          )
        )}
    </>
  );
};

export default PostsWidget;
