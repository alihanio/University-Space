import { styled } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => (
  <StyledToastContainer hideProgressBar={false} icon={false} limit={3} />
);

export default Notification;

const StyledToastContainer = styled(ToastContainer)(() => ({
  width: "fit-content",
  maxWidth: " 38.25rem",
  minWidth: "20rem",

  "& .Toastify__close-button ": {
    width: "1.5rem",
    height: "1.5rem",
    position: "absolute",
    right: "0.75rem",
    top: "0.75rem",

    "&:hover > path": {
      fill: "black",
    },

    "& > path": {
      fill: "#828282",
    },
  },
}));
