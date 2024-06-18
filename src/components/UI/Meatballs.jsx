import { useState } from "react";
import { Box, IconButton, Menu, MenuItem, styled } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Meatballs = ({ options, id }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const clickHandler = (e, onClick) => {
    e.stopPropagation();

    onClick(id);
    handleClose();
  };

  return (
    <Box>
      <StyledIconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </StyledIconButton>

      <StyledMenu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: 48 * 4.5,
              width: "12ch",
            },
          },
        }}
      >

        {options?.map(({ title, onClick }) => (
          <MenuItem key={title} onClick={(e) => clickHandler(e, onClick)}>
            {title}
          </MenuItem>
        ))}
        
      </StyledMenu>
    </Box>
  );
};

export default Meatballs;

const StyledIconButton = styled(IconButton)(() => ({
  widths: "fit-content",
  padding: "10px",
  position: "absolute",
  right: 0,

  "& .MuiIconButton-root": {
    padding: "0",
  },

  "@media (max-width: 725px)": {
    bottom: 0,

    "& > .MuiSvgIcon-root": {
      width: "1rem",
      height: "1rem",
    },
  },
}));

const StyledMenu = styled(Menu)(() => ({
  zIndex: "1000",
}));
