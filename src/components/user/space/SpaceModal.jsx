import { useState } from "react";
import { Box, Button, styled, TextField, Typography } from "@mui/material";
import Modal from "../../UI/Modal";
import { GreyImage } from "../../../assets/images";
import { getDatabase, push, ref, set } from "firebase/database";
import { app } from "../../../configs/firebase";
import { useSelector } from "react-redux";

const SpaceModal = ({ isOpenModal, onClose, onGetSpacesData }) => {
  const [title, setTitle] = useState("");

  const { email } = useSelector((state) => state.auth);

  const handleChangeTitle = (e) => setTitle(e.target.value);

  const handleSubmit = () => {
    const data = {
      title,
      userEmail: email,
      question: [],
    };

    const db = getDatabase(app);

    const newDoc = push(ref(db, "studentSpace/spaces"));

    set(newDoc, data)
      .then(() => {})
      .catch(() => {});

    onClose();

    setTitle("");
    onGetSpacesData();
  };

  return (
    <StyledContainer open={isOpenModal} onClose={onClose}>
      <img src={GreyImage} alt="img" />

      <Box className="title-container">
        <Typography variant="h4">NEW SPACE</Typography>
      </Box>

      <Box className="content">
        <Box className="input-box">
          <label htmlFor="title" className="label">
            Title
          </label>

          <TextField
            id="title"
            placeholder="Title..."
            value={title}
            onChange={handleChangeTitle}
          />
        </Box>
      </Box>

      <Box className="button-container">
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!title}>
          Add
        </Button>
      </Box>
    </StyledContainer>
  );
};

export default SpaceModal;

const StyledContainer = styled(Modal)(() => ({
  "& > .content": {
    maxWidth: "45rem",
    width: "100%",
    height: "auto",
    padding: "0 0 1rem 0",

    "& > .close-icon": {
      display: "none",
    },

    "@media (max-width:750px)": {
      width: "80%",
    },

    "@media (max-width:600px)": {
      width: "80%",
    },

    "@media (max-width:375px)": {
      width: "80%",
    },

    "& > img": {
      borderRadius: "0.5rem 0.5rem 0 0",
      width: "100%",
      height: "40%",

      "@media (max-width:900px)": {
        height: "30%",
      },
    },

    "& > .title-container": {
      display: "flex",
      justifyContent: "center",
      margin: "-3rem 0 0 0",

      "& > .MuiTypography-root": {
        "@media (max-width:600px)": {
          fontSize: "1.7rem",
        },

        "@media (max-width:375px)": {
          fontSize: "1.5rem",
        },
      },
    },

    "& > .content": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: "2rem",
      padding: "1rem",
      margin: "1rem 0",

      "& > .input-box": {
        width: "100%",
        display: "flex",
        gap: "0.2rem",
        flexDirection: "column",

        "& > .MuiFormControl-root": {
          width: "70%",
          margin: "auto",

          "& > .MuiInputBase-root": {
            borderRadius: "0.8rem",
          },
        },

        "& > .label": {
          margin: "0 0 0 7rem",

          "@media (max-width:750px)": {
            margin: "0 0 0 6rem",
          },

          "@media (max-width:600px)": {
            margin: "0 0 0 5rem",
          },

          "@media (max-width:375px)": {
            margin: "0 0 0 3rem",
          },
        },
      },
    },

    "& > .button-container": {
      display: "flex",
      justifyContent: "flex-end",
      gap: "1rem",
      margin: "0 1.5rem",

      "& > .MuiButton-contained": {
        backgroundColor: "black",
        borderRadius: "0.5rem",
      },

      "& > .MuiButton-outlined": {
        borderColor: "black",
        color: "black",
        borderRadius: "0.5rem",
      },

      "& > .MuiButton-root.Mui-disabled ": {
        backgroundColor: "grey",
        color: "white",
      },
    },
  },
}));
