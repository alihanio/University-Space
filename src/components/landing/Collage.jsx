import { Box, styled } from "@mui/material";
import {
  CodingImg1,
  CodingImg2,
  CodingImg3,
  CodingImg4,
  CodingImg5,
} from "../../assets/images";

const Collage = () => (
  <StyledContainer>
    <Box className="image-container">
      <Box className="image-box">
        <img className="long-img" src={CodingImg3} alt="coding" />
        <img className="square-img" src={CodingImg2} alt="coding" />
      </Box>

      <Box className="image-box">
        <img className="short-img" src={CodingImg1} alt="coding" />
        <img className="short-img" src={CodingImg4} alt="coding" />
        <img className="short-img" src={CodingImg5} alt="coding" />
      </Box>
    </Box>
  </StyledContainer>
);

export default Collage;

const StyledContainer = styled(Box)(() => ({
  marginTop: "15%",

  "& > .image-container": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    "& > .image-box": {
      width: "90%",
      display: "flex",
      justifyContent: "space-around",

      "& > .long-img": {
        width: "47.5%",
        borderRadius: "10%",
      },

      "& > .square-img": {
        width: "40%",
        borderRadius: "10%",
      },

      "& > .short-img": {
        width: "30%",
        borderRadius: "10%",
        marginTop: "5%",
      },
    },
  },
}));
