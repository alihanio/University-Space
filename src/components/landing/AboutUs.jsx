import { Box, Typography, styled } from "@mui/material";
import { ABOUT_US_DATA } from "../../utils/constants";

const AboutUs = () => (
  <StyledContainer id="about-us">
    <Box className="heading-box">
      <Typography className="heading">
        Student Space is a versatile online platform tailored to enhance the
        academic, social, and professional journeys of students in Kyrgyzstan.
        It consists of these pages:
      </Typography>
    </Box>

    <Box className="direction-container">
      {ABOUT_US_DATA?.map(({ key, title, description }) => (
        <Box className="direction-box" key={key}>
          <Typography className="direction-heading">0{key}.</Typography>
          <Typography className="direction-title">{title}</Typography>
          <Typography className="direction-description">
            {description}
          </Typography>
        </Box>
      ))}
    </Box>
  </StyledContainer>
);

export default AboutUs;

const StyledContainer = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "15%",

  "& > .heading-box": {
    width: "80%",
    padding: "2.5rem 2.5rem 7rem 2.5rem",
    border: "1px solid gray",
    borderRadius: "0.5rem",

    "& > .heading": {
      padding: "0rem 3rem 0rem 3rem",
      fontWeight: "400",
      fontSize: "2.5rem",
      lineHeight: "3rem",
      textAlign: "center",
    },
  },

  "& > .direction-container": {
    display: "flex",
    flexWrap: "wrap",
    gap: "4rem",
    width: "80%",
    justifyContent: "space-around",
    marginTop: "-5rem",

    "& > .direction-box": {
      width: "21rem",
      backgroundColor: "white",
      borderRadius: "2rem",
      padding: "1rem 0rem 1rem 1.188rem",
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      transition: "all 0.3s ease",
      cursor: "pointer",
      border: "1px solid white",

      "&:hover": {
        border: "1px solid gray",
        boxShadow: "none",
      },

      "& > .direction-heading": {
        fontWeight: "400",
        fontSize: "2.813rem",
        color: "rgb(169, 167, 177)",
      },

      "& > .direction-title": {
        fontWeight: "400",
        fontSize: "2.625rem",
      },

      "& > .direction-description": {
        fontWeight: "400",
        fontSize: "1.563rem",
        color: "rgb(57, 62, 67)",
        marginTop: "1rem",
      },
    },
  },

  "@media (max-width: 1200px)": {
    "& > .heading-box": {
      "& > .heading": {
        fontSize: "2.1rem",
        lineHeight: "2.6rem",
      },
    },

    "& > .direction-container": {
      gap: "3rem",

      "& > .direction-box": {
        width: "20rem",

        "& > .direction-heading": {
          fontSize: "2.313rem",
        },

        "& > .direction-title": {
          fontSize: "2.125rem",
        },

        "& > .direction-description": {
          fontSize: "1.263rem",
        },
      },
    },
  },

  "@media (max-width: 910px)": {
    "& > .heading-box": {
      padding: "2.5rem 2rem 7rem 2rem",

      "& > .heading": {
        padding: "0rem 2rem 0rem 2rem",
        fontSize: "1.5rem",
        lineHeight: "2rem",
      },
    },

    "& > .direction-container": {
      gap: "2rem",

      "& > .direction-box": {
        width: "17rem",

        "& > .direction-heading": {
          fontSize: "2.013rem",
        },

        "& > .direction-title": {
          fontSize: "1.925rem",
        },

        "& > .direction-description": {
          fontSize: "1.163rem",
        },
      },
    },
  },

  "@media (max-width: 610px)": {
    "& > .heading-box": {
      padding: "2.5rem 1rem 5rem 1rem",

      "& > .heading": {
        padding: "0rem 1rem 0rem 1rem",
        fontSize: "1rem",
        lineHeight: "1.5rem",
      },
    },

    "& > .direction-container": {
      marginTop: "-3rem",
      gap: "1.5rem",

      "& > .direction-box": {
        width: "15rem",
        borderRadius: "1.5rem",

        "& > .direction-heading": {
          fontSize: "1.713rem",
        },

        "& > .direction-title": {
          fontSize: "1.625rem",
        },

        "& > .direction-description": {
          fontSize: "1rem",
        },
      },
    },
  },

  "@media (max-width: 375px)": {
    "& > .heading-box": {
      padding: "2.5rem 0rem 3rem 0rem",

      "& > .heading": {
        padding: "0rem 1rem 0rem 1rem",

        fontSize: "0.7rem",
        lineHeight: "1rem",
      },
    },

    "& > .direction-container": {
      gap: "1.2rem",
      marginTop: "-2rem",

      "& > .direction-box": {
        width: "11rem",
        borderRadius: "1rem",

        "& > .direction-heading": {
          fontSize: "1.2rem",
        },

        "& > .direction-title": {
          fontSize: "1.1rem",
        },

        "& > .direction-description": {
          fontSize: "0.7rem",
        },
      },
    },
  },
}));
