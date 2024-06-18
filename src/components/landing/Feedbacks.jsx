import Slider from "react-slick";
import { Box, Typography, styled } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SlickNextIcon, SlickPrevIcon } from "../../assets/icons";
import { FEEDBACKS } from "../../utils/constants";

const PrevArrow = ({ onClick, className }) => (
  <SlickPrevIcon onClick={onClick} className={className} />
);

const NextArrow = ({ onClick, className }) => (
  <SlickNextIcon onClick={onClick} className={className} />
);

const SETTINGS = {
  dots: true,
  infinite: true,
  lazyLoad: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: 0,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

const Feedbacks = () => (
  <StyledContainer>
    <Typography className="title" variant="h2">
      Our beloved graduates will confirm everything
    </Typography>

    <Box className="slider-box">
      <StyledSlider {...SETTINGS}>
        {FEEDBACKS.map(
          ({
            id,
            background,
            fullNameColor,
            textColor,
            fullName,
            text,
            image,
          }) => (
            <StyledSlide
              key={id}
              background={background}
              titlecolor={fullNameColor.toString()}
            >
              <Box className="image-box">
                <img src={image} alt="globus" />
              </Box>

              <Box className="texts-box">
                <Typography className="fullName" variant="h1">
                  {fullName}
                </Typography>

                <Typography className="description" color={textColor}>
                  {text}
                </Typography>
              </Box>
            </StyledSlide>
          )
        )}
        
      </StyledSlider>
    </Box>
  </StyledContainer>
);

export default Feedbacks;

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  margin: "auto",
  padding: "2rem",
  marginTop: "5%",

  "& > .title": {
    color: theme.palette.primary.dullBlue,
    fontFamily: "Gilroy",
    fontSize: "2.5rem",
    fontWeight: "700",
    textAlign: "center",

    [theme.breakpoints.down("md")]: {
      fontSize: "2rem",
      width: "40rem",
      marginLeft: "7rem",
    },

    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem",
      width: "20rem",
      marginLeft: "7rem",
    },

    "@media (max-width: 375px)": {
      fontSize: "1.5rem",
      width: "20rem",
      marginLeft: "0rem",
    },
  },

  "& > .slider-box": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "3rem",

    "& > .slick-slider": {
      "@media (max-width: 375px)": {
        maxWidth: "375px",
      },
    },
  },
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  "& .slick-track": {
    display: "flex",
    gap: "7rem",
    padding: "0 0 35px 0",

    "@media (max-width: 375px)": {
      gap: "2.3rem",
    },
  },

  "& .slick-slide:not(.slick-center)": {
    transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
    transform: "scale(0.8)",
    opacity: "0.8",
  },

  "& .slick-slide.slick-center": {
    transform: "scale(1) ease-in-out",
    opacity: "1",
  },

  "& .slick-list": {
    width: "72rem",
    borderRadius: "1rem",

    [theme.breakpoints.down("lg")]: {
      width: "62.625rem",
    },

    "@media (max-width: 375px)": {
      maxWidth: "375px",
    },
  },

  "& .slick-arrow": {
    cursor: "pointer",
    zIndex: 11,
    position: "relative",
    top: "200px",
  },

  "& .slick-next": {
    position: "relative",
    left: "41rem",
    top: "2.76rem",
    width: "3.75rem",
    height: "3.75rem",

    "& path": {
      transition: "0.3s linear",
      fill: "black",
    },

    [theme.breakpoints.down("lg")]: {
      left: "35rem",
    },

    "@media (max-width: 375px)": {
      left: "18.5rem",
    },
  },

  "& .slick-prev": {
    position: "relative",
    left: "25rem",
    top: "36.200rem",
    width: "3.75rem",
    height: "3.75rem",

    "& path": {
      transition: "0.3s linear",
      fill: "black",
    },

    [theme.breakpoints.down("lg")]: {
      left: "21.8rem",
    },

    [theme.breakpoints.down("md")]: {
      top: "28.8rem",
      left: "21.8rem",
    },

    [theme.breakpoints.down("sm")]: {
      top: "23.850rem",
      left: "21.8rem",
    },

    "@media (max-width: 375px)": {
      left: "1rem",
    },
  },

  "& .slick-next:hover, .slick-prev:hover": {
    transition: "0.3s linear",
    content: "none",

    "& circle": {
      transition: "0.3s linear",
      fill: "black",
    },

    "& path": {
      transition: "0.3s linear",
      fill: "white",
    },
  },

  "& .slick-dots": {
    bottom: "0rem",
    right: "1rem",
    display: "flex !important",
    justifyContent: "center",
    alignItems: "flex-end",

    "& li": {
      width: "7px",
      transition: "all 500ms",

      "& > button": {
        height: "20px",
        background: "#d7c7e8",
        borderRadius: "5px",
        width: "100%",
        transition: "all 1s",

        "&:before": {
          color: "transparent",
          content: "''",
        },
      },
    },

    "& .slick-active": {
      height: "50px",

      "& > button": {
        background: "black",
        height: "100%",
      },
    },
  },
}));

const StyledSlide = styled(Box)(({ titlecolor, background, theme }) => ({
  width: " 64.25rem",
  height: "27.5rem",
  display: "flex !important",
  flexDirection: "row",
  alignItems: "center",
  cursor: "pointer",
  gap: "8px",
  borderRadius: "4.375rem 4.375rem 4.375rem 0rem",
  backgroundColor: background,
  padding: "2.88rem 2.75rem",
  boxShadow: "11px 16px 20px 0px rgba(0, 0, 0, 0.30)",

  [theme.breakpoints.down("lg")]: {
    width: "30rem",
  },

  [theme.breakpoints.down("md")]: {
    width: "45rem !important",
    height: "20rem",
    marginLeft: "6rem",
  },

  [theme.breakpoints.down("sm")]: {
    width: "30rem !important",
    height: "15rem",
    marginLeft: "12rem",
  },

  "@media (max-width: 375px)": {
    padding: "2.88rem 1.8rem",
    width: "20rem !important",
    height: "15rem",
    marginLeft: "0rem",
  },

  "& .texts-box": {
    display: "flex",
    flexDirection: "column",
    gap: "1.61rem",
    maxWidth: "505px",

    [theme.breakpoints.down("lg")]: {
      width: "10rem !important",
    },

    "@media (max-width: 1200px)": {
      gap: "1rem",
    },

    "& > .fullName": {
      width: "31.75431rem",
      color: titlecolor,
      fontFamily: "Gilroy",
      fontSize: "2.375rem",
      fontWeight: "700",

      [theme.breakpoints.down("lg")]: {
        fontSize: "2.200rem",
        width: "30rem",
      },

      [theme.breakpoints.down("md")]: {
        fontSize: "1.8rem",
        width: "20rem",
      },

      [theme.breakpoints.down("sm")]: {
        fontSize: "1.3rem",
        width: "20rem",
      },

      "@media (max-width: 375px)": {
        fontSize: "1rem",
        width: "13rem",
      },
    },

    "& > .description": {
      width: "36.1875rem",
      fontSize: "1.5rem",
      fontFamily: "Poppins",
      fontWeight: "400",
      marginBottom: "6rem",
      marginLeft: "29px",

      [theme.breakpoints.down("lg")]: {
        fontSize: "1.4rem",
        width: "25rem",
      },

      [theme.breakpoints.down("md")]: {
        fontSize: "1rem",
        width: "20rem",
        marginBottom: "3rem",
      },

      [theme.breakpoints.down("sm")]: {
        fontSize: "0.7rem",
        width: "14rem",
      },

      "@media (max-width: 375px)": {
        fontSize: "0.6rem",
        width: "10rem",
        marginLeft: "10px",
      },
    },
  },

  "& > .image-box": {
    display: "flex",
    justifyContent: "flex-end",
    maxWidth: "505px",

    [theme.breakpoints.down("md")]: {
      width: "13rem !important",
      height: "13rem !important",
    },

    [theme.breakpoints.down("sm")]: {
      width: "9rem !important",
      height: "9rem !important",
    },

    "@media (max-width: 375px)": {
      width: "6rem !important",
      height: "6rem !important",
    },

    "& > img": {
      width: "331px",
      height: "334px",

      [theme.breakpoints.down("md")]: {
        width: "13rem !important",
        height: "13rem !important",
      },

      [theme.breakpoints.down("sm")]: {
        width: "9rem !important",
        height: "9rem !important",
      },

      "@media (max-width: 375px)": {
        width: "6rem !important",
        height: "6rem !important",
      },
    },
  },
}));
