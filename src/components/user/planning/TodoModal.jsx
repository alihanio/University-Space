import { useState } from "react";
import { Box, Button, TextField, styled } from "@mui/material";
import Modal from "../../UI/Modal";

const TodoModel = ({ isOpenModal, onClose, onTaskAdd }) => {
  const [title, setTitle] = useState("");

  const handleChangeTitle = (e) => setTitle(e.target.value);

  const handleSubmit = () => {
    const newTask = title.trim();
    if (newTask) {
      const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const updatedTasks = [...storedTasks, newTask];
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));

      onTaskAdd(newTask);

      setTitle("");
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle("");
    onClose();
  };

  return (
    <StyledModal open={isOpenModal} onClose={handleCancel}>
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

      <Box className="button-box">
        <Button className="cansel-btn" onClick={handleCancel}>
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          className="save-btn"
          disabled={!title.trim()}
        >
          Add
        </Button>
      </Box>
    </StyledModal>
  );
};

export default TodoModel;

const StyledModal = styled(Modal)(() => ({
  "& > .content": {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "2rem 3rem",

    "& > .input-box": {
      width: "100%",
      display: "flex",
      gap: "0.2rem",
      flexDirection: "column",
    },

    "& > .close-icon": {
      display: "none",
    },

    "& .MuiStack-root>.MuiTextField-root": {
      minWidth: "9rem",
      maxWidth: "10rem",
    },

    "& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
      {
        borderColor: "black",
        borderWidth: "2px",
      },

    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: "0.8rem",
    },

    "& .MuiInputBase-input.MuiOutlinedInput-input": {
      padding: "1rem 0.7rem",
      fontSize: "0.9rem",
    },

    "& > .button-box": {
      display: "flex",
      justifyContent: "flex-end",
      gap: "1rem",

      "& > .save-btn": {
        marginTop: "2%",
        width: "6rem",
        height: "2.375rem",
        display: "flex",
        color: "white",
        backgroundColor: "black",
        fontSize: "1rem",
        borderRadius: "0.5rem",
        textTransform: "none",
      },

      "& > .cansel-btn": {
        marginTop: "2%",
        width: "6rem",
        height: "2.375rem",
        display: "flex",
        color: "black",
        border: "1px solid black",
        backgroundColor: "white",
        fontSize: "1rem",
        borderRadius: "0.5rem",
        textTransform: "none",
      },

      "& > .MuiButton-root.Mui-disabled ": {
        backgroundColor: "grey",
        color: "white",
      },
    },

    "@media (max-width:900px)": {
      gap: "0.8rem",
      padding: "1.8rem 2.8rem",

      "& > .button-box": {
        "& > .save-btn": {
          width: "5rem",
          fontSize: "0.9rem",
        },

        "& > .cansel-btn": {
          marginTop: "2%",
          width: "5rem",
          fontSize: "0.9rem",
        },
      },

      "& .MuiStack-root>.MuiTextField-root": {
        minWidth: "9rem",
        maxWidth: "10rem",
      },

      "& .MuiInputBase-input.MuiOutlinedInput-input": {
        padding: "1rem 0.7rem",
        fontSize: "0.9rem",
      },
    },

    "@media (max-width:600px)": {
      gap: "0.5rem",
      padding: "1rem 2rem",

      "& > .button-box": {
        "& > .save-btn": {
          width: "5rem",
          fontSize: "0.8rem",
        },

        "& > .cansel-btn": {
          marginTop: "2%",
          width: "5rem",
          fontSize: "0.8rem",
        },
      },

      "& .MuiStack-root>.MuiTextField-root": {
        minWidth: "9rem",
        maxWidth: "10rem",
      },

      "& .MuiInputBase-input.MuiOutlinedInput-input": {
        padding: "0.7rem 0.5rem",
        fontSize: "0.8rem",
      },

      "& > .input-box": {
        width: "100%",
        display: "flex",
        gap: "0.2rem",
        flexDirection: "column",
      },
    },

    "@media (max-width:375px)": {
      gap: "0.5rem",
      padding: "0.5rem 1.5rem",

      "& > .button-box": {
        "& > .save-btn": {
          width: "3rem",
          height: "2rem",
          fontSize: "0.5rem",
        },

        "& > .cansel-btn": {
          marginTop: "2%",
          width: "3rem",
          height: "2rem",
          fontSize: "0.5rem",
        },
      },

      "& .MuiStack-root>.MuiTextField-root": {
        minWidth: "6rem",
        maxWidth: "7rem",
      },

      "& .MuiInputBase-input.MuiOutlinedInput-input": {
        padding: "0.7rem 0.5rem",
        fontSize: "0.6rem",
      },

      "& > .input-box": {
        width: "100%",
        display: "flex",
        gap: "0.2rem",
        flexDirection: "column",
      },
    },
  },
}));
