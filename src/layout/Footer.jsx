import { Typography, styled, IconButton, Box, Tooltip } from "@mui/material";
import Questions from "../components/landing/Questions";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "../assets/icons";

const Footer = () => {
  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  return (
    <StyledContainer>
      <Box className="box">
        <Questions />

        <StyledFooter>
          <Typography className="logo" onClick={scrollToTop}>
            Student Space
          </Typography>

          <Box>
            <Tooltip title="@StudentSpace">
              <IconButton href="###">
                <YouTubeIcon className="youtube icon" />
              </IconButton>
            </Tooltip>

            <Tooltip title="facebook">
              <IconButton href="###">
                <FacebookIcon className="icon" />
              </IconButton>
            </Tooltip>

            <Tooltip title="@StudentSpace">
              <IconButton href="###">
                <InstagramIcon className="icon" />
              </IconButton>
            </Tooltip>

          </Box>
        </StyledFooter>

      </Box>
    </StyledContainer>
  );
};

export default Footer;

const StyledContainer = styled(Box)(() => ({
  background: "#262626",
  marginTop: "15%",

  "& > .box": {
    maxWidth: "1600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    padding: "120px 0 12px 0",
  },
}));

const StyledFooter = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "#FFF",
  fontSize: "1rem",
  textAlign: "center",
  width: "96%",
  paddingBottom: "2%",

  "& > .logo": {
    fontSize: "1.5rem",
    fontWeight: "400",
    cursor: "pointer",
  },

  "& > div > a > .youtube": {
    width: "2rem",
    height: "2rem",
    borderRadius: "2rem",
    margin: "0.10rem 0 0 0 ",
  },


  "@media (max-width: 910px)": {
    "& > .logo": {
      fontSize: "1.25rem",
    },

    "& > div > a > .icon": {
      width: "1.75rem",
      height: "1.75rem",
    },
  },

  "@media (max-width: 610px)": {
    "& > .logo": {
      fontSize: "1rem",
    },

    "& > div > a > .icon": {
      width: "1.50rem",
      height: "1.50rem",
    },
  },

  "@media (max-width: 375px)": {
    "& > .logo": {
      fontSize: "0.9rem",
    },

    "& > div > a > .icon": {
      width: "1.25rem",
      height: "1.25rem",
    },
  },
}));
