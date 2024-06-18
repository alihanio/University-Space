import { useEffect, useState } from "react";
import { Box, Button, styled, Typography } from "@mui/material";
import SignIn from "../components/register/SignIn";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpenSignInModal, setIsOpenSignInModal] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      const scrollTop = window.scrollY;

      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  const scrollToTopHandler = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const scrollToTopToAboutUs = () => {
    window.scrollTo({
      top: 900,
      behavior: "smooth",
    });
  };

  const scrollToTopToReviews = () => {
    window.scrollTo({
      top: 3000,
      behavior: "smooth",
    });
  };

  const scrollToTopToQuestions = () => {
    window.scrollTo({
      top: 3850,
      behavior: "smooth",
    });
  };

  const handleToggleSignInModal = () => setIsOpenSignInModal((prev) => !prev);

  return (
    <StyledContainer isscrolled={isScrolled.toString()}>
      <SignIn
        isOpenModal={isOpenSignInModal}
        onClose={handleToggleSignInModal}
      />

      <Typography onClick={scrollToTopHandler} className="title">
        Student Space
      </Typography>

      <Box className="container">
        <nav>
          <Typography onClick={scrollToTopToAboutUs}>About us</Typography>
          <Typography onClick={scrollToTopToReviews}>Reviews</Typography>
          <Typography onClick={scrollToTopToQuestions}>Questions</Typography>
        </nav>

        <StyledButton
          isscrolled={isScrolled.toString()}
          onClick={handleToggleSignInModal}
        >
          Log in
        </StyledButton>
      </Box>
    </StyledContainer>
  );
};

export default Header;

const StyledContainer = styled("header")(({ isscrolled }) => ({
  padding: "1.75rem 4.938rem 0.875rem",
  background: isscrolled === "true" ? "white" : "black",
  boxShadow: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white",
  position: "sticky",
  top: 0,
  zIndex: 1000,
  transition: "background-color 0.3s ease, color 0.3s ease",

  "& > .title": {
    fontSize: "1.5rem",
    lineHeight: "2.25rem",
    fontWeight: "400",
    color: isscrolled === "true" ? "black" : "white",
    transition: "color 0.3s ease",
    cursor: "pointer",
  },

  "& > .container": {
    display: "flex",
    gap: "6.25rem",
    alignItems: "center",

    "& > nav": {
      display: "flex",
      gap: "4.875rem",

      "& > p": {
        cursor: "pointer",
        fontSize: "1.25rem",
        color: isscrolled === "true" ? "black" : "white",
        transition: "color 0.3s ease",
      },
    },
  },

  "@media (max-width: 900px)": {
    padding: "1.25rem",

    "& > .title": {
      fontSize: "1.25rem",
    },

    "& > .container": {
      gap: "2.5rem",

      "& > nav": {
        gap: "2.5rem",

        "& > p": {
          fontSize: "1rem",
        },
      },
    },
  },

  "@media (max-width: 600px)": {
    padding: "0.625rem",

    "& > .title": {
      fontSize: "1rem",
    },

    "& > .container": {
      gap: "5.313rem",

      "& > nav": {
        gap: "0.625rem",

        "& > p": {
          fontSize: "0.875rem",
        },
      },
    },
  },

  "@media (max-width: 375px)": {
    padding: "0.7rem",

    "& > .title": {
      fontSize: "1.5rem",
    },

    "& > .container": {
      gap: "5.313rem",

      "& > nav": {
        display: "none",
      },
    },
  },
}));

const StyledButton = styled(Button)(({ isscrolled }) => ({
  borderRadius: "0.5rem",
  color: isscrolled === "false" ? "black" : "white",
  background: isscrolled === "false" ? "white" : "black",
  fontWeight: "400",
  fontSize: "1.25rem",
  textAlign: "center",
  textTransform: "none",
  fontFamily: "Arimo",
  lineHeight: "1.438rem",
  width: "7.063rem",
  height: "2.375rem",
  padding: "0.813rem 1.5rem ",
  transition: "color 0.3s ease, background-color 0.3s ease",

  "&:hover": {
    color: isscrolled === "false" ? "black" : "white",
    background: isscrolled === "false" ? "white" : "black",
  },

  "@media (max-width: 375px)": {
    width: "5.813rem",
    padding: "0.5rem",
    height: "1.875rem",
  },
}));
