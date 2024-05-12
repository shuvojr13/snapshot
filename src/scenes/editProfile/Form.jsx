import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../../state/index";
import axios from "axios";
import FlexBetween from "../../components/FlexBetween";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";

const editProfileSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  location: yup.string(),
  occupation: yup.string(),
  school: yup.string(),
  twitter: yup.string(),
  facebook: yup.string(),
  linkedIn: yup.string(),
  website: yup.string(),
});

const Form = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const handleFormSubmit = async (values, onSubmitProps) => {
    const toastNotification = toast.loading("Updating...");
    try {
      const formData = new FormData();

      for (let value in values) {
        formData.append(value, values[value]);
      }
      // for (const pair of formData.entries()) {
      //   console.log(`${pair[0]}, ${pair[1]}`);
      // }

      const response = await axios({
        method: "patch",
        url: `${process.env.REACT_APP_SERVER_URL}/users/${user._id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: formData,
      });
      if (response.status === 200) {
        toast.update(toastNotification, {
          render: "Updated Successfully",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        const updatedData = await response.data;
        dispatch(setLogin({ user: updatedData, token: token }));
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

  return (
    <Formik
      // onSubmit={(values) => console.log(values)}
      onSubmit={handleFormSubmit}
      initialValues={{
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        occupation: user.occupation,
        school: user.school,
        facebook: user.facebook,
        twitter: user.twitter,
        linkedIn: user.linkedIn,
        website: user.website,
      }}
      validationSchema={editProfileSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <Box
              gridColumn="span 4"
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius="5px"
              p="1rem"
            >
              <Typography gutterBottom>Change Profile Picture</Typography>
              <Dropzone
                acceptedFiles=".jpg,.jpeg,.png"
                multiple={false}
                onDrop={(acceptedFiles) =>
                  setFieldValue("picture", acceptedFiles[0])
                }
              >
                {({ getRootProps, getInputProps }) => (
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!values.picture ? (
                      <p>Click to choose picture</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{values.picture.name}</Typography>
                        <EditOutlinedIcon />
                      </FlexBetween>
                    )}
                  </Box>
                )}
              </Dropzone>
            </Box>

            <TextField
              label="First Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.firstName}
              name="firstName"
              error={Boolean(touched.firstName) && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Last Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.lastName}
              name="lastName"
              error={Boolean(touched.lastName) && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Location"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.location}
              name="location"
              error={Boolean(touched.location) && Boolean(errors.location)}
              helperText={touched.location && errors.location}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Occupation"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.occupation}
              name="occupation"
              error={Boolean(touched.occupation) && Boolean(errors.occupation)}
              helperText={touched.occupation && errors.occupation}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Last Eductional Institute"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.school}
              name="school"
              error={Boolean(touched.school) && Boolean(errors.school)}
              helperText={touched.school && errors.school}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Facebook Profile"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.facebook}
              name="facebook"
              error={Boolean(touched.facebook) && Boolean(errors.facebook)}
              helperText={touched.facebook && errors.facebook}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Twitter Profile"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.twitter}
              name="twitter"
              error={Boolean(touched.twitter) && Boolean(errors.twitter)}
              helperText={touched.twitter && errors.twitter}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="LinkedIn Profile"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.linkedIn}
              name="linkedIn"
              error={Boolean(touched.linkedIn) && Boolean(errors.linkedIn)}
              helperText={touched.linkedIn && errors.linkedIn}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Website"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.website}
              name="website"
              error={Boolean(touched.website) && Boolean(errors.website)}
              helperText={touched.website && errors.website}
              sx={{ gridColumn: "span 2" }}
            />

            {/* BUTTONS */}
            <Box
              width="100%"
              sx={{
                gridColumn: "span 4",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                type="submit"
                sx={{
                  maxWidth: "max-content",
                  m: "0 auto",
                  p: "1rem 2rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
              >
                Update
              </Button>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
