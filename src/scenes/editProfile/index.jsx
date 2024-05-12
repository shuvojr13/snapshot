import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        // textAlign="center"
        margin="0 auto"
      >
        <Typography
          fontWeight="bold"
          fontSize="32px"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{ cursor: "pointer", maxWidth: "fit-content", margin: "0 auto" }}
        >
          SnapShot
        </Typography>
      </Box>
      <Typography
        textAlign="center"
        fontWeight="500"
        variant="h3"
        sx={{ my: "1.5rem" }}
      >
        Edit your profile
      </Typography>
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Form />
      </Box>
    </Box>
  );
};

export default EditProfile;
