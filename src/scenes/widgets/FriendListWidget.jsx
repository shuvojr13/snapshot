import { Box, Typography, useTheme } from "@mui/material";
import axios from "axios";
import PostBar from "../../components/PostBar";
import PostBarFriend from "../../components/PostBarFriend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/index";

const FriendListWidget = ({ userId }) => {
  const [friendOfFriends, setFriendOfFriends] = useState([]);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const { friends, _id } = useSelector((state) => state.user);

  const getFriends = async () => {
    const response = await axios({
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/users/${userId}/friends`,
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.data;
    if (userId === _id) {
      dispatch(setFriends({ friends: data }));
    } else {
      setFriendOfFriends(data);
    }
  };

  useEffect(() => {
    getFriends();
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {userId === _id
          ? friends.map((friend) => (
              <PostBar
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                friendLocation={friend.occupation}
                userPicturePath={friend.picturePath}
              />
            ))
          : friendOfFriends.map((friend) => (
              <PostBarFriend
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
                friendOfFriends={friendOfFriends}
                setFriendOfFriends={setFriendOfFriends}
              />
            ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
