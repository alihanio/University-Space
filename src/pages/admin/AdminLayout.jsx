import { Outlet } from "react-router-dom";
import { Box, styled } from "@mui/material";
import MobileSideBar from "../../components/side-bar/MobileSideBar";

const AdminLayout = () => (
  <StyledContainer>
    <MobileSideBar />

    <Outlet />
  </StyledContainer>
);

export default AdminLayout;

const StyledContainer = styled(Box)(() => ({
  display: "flex",
}));
