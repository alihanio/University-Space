import { Box, CircularProgress, styled } from "@mui/material";

const Loading = () => (
  <StyledContainer>
    <CircularProgress color="inherit" />;
  </StyledContainer>
);
export default Loading;

const StyledContainer = styled(Box)(() => ({
  width: "100%",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
