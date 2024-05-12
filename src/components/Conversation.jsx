import { Avatar, ListItemAvatar, ListItemText } from "@mui/material";
import axios from "axios";
import UserImage from "./UserImage";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const Conversation = ({ data, currentUser, online }) => {
  const [userData, setUserData] = useState(null);

  const token = useSelector((state) => state.token);

  useEffect(() => {
    // console.log(data);
    const userId = data.members.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_SERVER_URL}/users/${userId}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const data = response.data;
          // console.log(data);
          setUserData(data);
        }
        // dispatch({ type: "SAVE_USER", data: data });
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {userData && (
        <>
          {" "}
          <ListItemAvatar>
            <Avatar>
              <UserImage image={userData.picturePath} size="30px" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${userData.firstName} ${userData.lastName}`}
            secondary={online ? "Online" : "Offline"}
          />
        </>
      )}
      {/* <div>
        {online && <div className="online-dot"></div>}
        <UserImage image={image} size="55px" />
        <div className="name" style={{ fontSize: "0.8rem" }}>
          <span>{fullName}</span>
          <span style={{ color: online ? "#51e200" : "" }}>
            {online ? "Online" : "Offline"}
          </span>
        </div>
      </div> */}
    </>
  );
};

export default Conversation;
