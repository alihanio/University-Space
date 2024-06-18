import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Box, Drawer, styled } from "@mui/material";
import SideBar from "./SideBar";

const MobileSideBar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen((prev) => !prev);

  return (
    <StyledContainer>
      <Box className="desktop">
        <SideBar />
      </Box>

      <>
        <RxHamburgerMenu onClick={toggleDrawer} className="burger" />

        <Drawer open={open} onClose={toggleDrawer}>
          <SideBar />
        </Drawer>
      </>
    </StyledContainer>
  );
};

export default MobileSideBar;

const StyledContainer = styled(Box)(() => ({
  "& .burger": {
    display: "none",
  },

  "@media (max-width: 375px)": {
    "& > .desktop": {
      display: "none",
    },

    "& > .burger": {
      margin: "1.25rem",
      display: "block",
    },
  },
}));
