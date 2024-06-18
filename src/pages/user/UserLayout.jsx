import { Outlet } from "react-router-dom";
import { Box, styled } from "@mui/material";
import MobileSideBar from "../../components/side-bar/MobileSideBar";

const UserLayout = () => (
  <StyledContainer>
    <MobileSideBar />

    <Outlet />
  </StyledContainer>
);

export default UserLayout;

const StyledContainer = styled(Box)(() => ({
  display: "flex",
}));
