import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();

  return (
    <Typography
      fontWeight="bold"
      color="primary"
      onClick={() => navigate("/home")}
      sx={{
        fontSize: { xs: "1.2rem", md: "2rem" },
        "&:hover": {
          cursor: "pointer",
        },
      }}
    >
      SnapShot
    </Typography>
  );
};
export default Logo;
