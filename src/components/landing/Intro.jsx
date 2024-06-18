import { useState } from "react";
import { Box, Button, Typography, styled } from "@mui/material";
import SignUp from "../register/SignUp";
import { IntroImage } from "../../assets/images";

const Intro = () => {
  const [isOpenSignUpModal, setIsOpenSignUpModal] = useState(false);

  const handleToggleSignUpModal = () => setIsOpenSignUpModal((prev) => !prev);

  return (
    <StyledContainer>
      <SignUp
        isOpenModal={isOpenSignUpModal}
        onClose={handleToggleSignUpModal}
        setIsOpenSignUpModal={setIsOpenSignUpModal}
      />

      <Box className="content">
        <Typography className="title" variant="h3">
          Student space
        </Typography>

        <Typography className="description">
          Your universal key to academic success
        </Typography>

        <StyledButton onClick={handleToggleSignUpModal}>Sign up</StyledButton>
      </Box>
    </StyledContainer>
  );
};

export default Intro;

const StyledContainer = styled(Box)(() => ({
  backgroundImage: `url(${IntroImage})`,
  width: "100%",
  height: "100vh",
  color: "white",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  backgroundSize: "cover",
  backgroundPositionY: "center",
  backgroundRepeat: "no-repeat",

  "& > .content": {
    display: "flex",
    flexDirection: "column",
    alignItems: "end",
    alignSelf: "end",
    marginRight: "5.313rem",
    marginTop: "5.625rem",

    "& > .title": {
      fontFamily: "'Arvo', sans-serif",
      fontSize: "3.75rem",
    },

    "& > .description": {
      fontFamily: "'Baloo 2', sans-serif",
      fontSize: "2.25rem",
      fontWeight: "400",
      lineHeight: "58px",
    },
  },

  "@media (max-width: 900px)": {
    "& > .content": {
      marginRight: "1.875rem",
      marginTop: "3.125remx ",

      "& > .title": {
        fontSize: "2.5rem",
      },

      "& > .description": {
        fontSize: "1.5rem",
      },
    },
  },

  "@media (max-width: 600px)": {
    alignItems: "center",

    "& > .content": {
      marginRight: "0.5rem",
      marginTop: "1.875rem",

      "& > .title": {
        fontSize: "3.75rem",
      },

      "& > .description": {
        fontSize: "1.75rem",
      },
    },
  },

  "@media (max-width: 375px)": {
    height: "80vh",
    padding: "1.25rem",
    justifyContent: "end",

    "& > .content": {
      alignItems: "start",
      alignSelf: "start",
      marginBottom: "10.625rem",

      "& > .title": {
        fontSize: "2.75rem",
      },

      "& > .description": {
        fontSize: "1rem",
      },
    },
  },
}));

const StyledButton = styled(Button)(() => ({
  "&.MuiButton-root": {
    borderRadius: "0.5rem",
    border: "1px solid white",
    width: "7.938rem",
    backgroundColor: "transparent",
    color: "white",
    textTransform: "none",
    fontFamily: "Arimo",
    fontSize: "1.25rem",
    fontWeight: "400",
    lineHeight: "1.375rem",

    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },
  },
}));
