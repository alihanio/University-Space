import { Box, Button, Typography, styled } from "@mui/material";
import { useNavigate } from "react-router";
import { NotFoundImage } from "../assets/images";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);
  return (
    <StyledContainer>
      <Box>
        <img className="not-found-img" src={NotFoundImage} alt="404" />
      </Box>
      <Typography className="heading">404 Page Not Found</Typography>
      <Typography className="description">
        The page you are looking for doesnt exist or an other error occurred, go
        back to home page.
      </Typography>
      <Button className="go-back" variant="outlined" onClick={handleGoBack}>
        Go back
      </Button>
    </StyledContainer>
  );
};

export default NotFound;

const StyledContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  "& .not-found-img": {
    width: "40rem",
    height: "40rem",
    marginTop: "-2rem",
  },

  "& .heading": {
    fontSize: "1.5rem",
    marginTop: "-4rem",
    marginBottom: "0.5rem",
  },

  "& .description": {
    fontSize: "1.1rem",
    marginBottom: "0.5rem",
  },

  "& .go-back": {
    "&.MuiButtonBase-root": {
      color: "black",
      padding: "0.5rem 1rem",
      border: `0.09375rem solid black}`,
      borderRadius: "0.5rem",

      "&:hover": {
        border: `0.0625rem solid black`,
        borderRadius: "0.5rem",
      },

      "&:active": {
        backgroundColor: "black",
        color: "white",
        borderRadius: "0.5rem",
      },
    },
  },
}));
