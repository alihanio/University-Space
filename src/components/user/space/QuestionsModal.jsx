import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { get, getDatabase, push, ref, set } from "firebase/database";
import { Box, Button, styled, TextField, Typography } from "@mui/material";
import Modal from "../../UI/Modal";
import { GreyImage } from "../../../assets/images";
import { app } from "../../../configs/firebase";

const QuestionsModal = ({
  isOpenModal,
  onClose,
  activeTab,
  onGetQuestion,
  selectedId,
}) => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState();

  const { email } = useSelector((state) => state.auth);

  const fetchData = async () => {
    const db = getDatabase();

    const dbRef = ref(
      db,
      `studentSpace/spaces/${activeTab}/question/` + selectedId
    );

    await get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const targetObject = snapshot.val();

          setTitle(targetObject.title);
          setDescription(targetObject.description);
        }
      })
      .catch((error) => {
        console.error("Error getting news data:", error);
      });
  };

  useEffect(() => {
    if (selectedId) {
      fetchData();
    }
  }, [selectedId]);

  useEffect(() => {
    const getUsersData = async () => {
      const db = getDatabase(app);

      const dbRef = ref(db, "studentSpace/users");

      await get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const myData = snapshot.val();

            const temporaryArray = Object.keys(myData)
              .map((myFireId) => ({
                ...myData[myFireId],
                userId: myFireId,
              }))
              .filter((user) => user.email === email);
            setUsers(temporaryArray[0]);
          }
        })
        .catch((error) => {
          console.error("Error getting user data:", error);
        });
    };

    getUsersData();
  }, [email]);

  const handleChangeTitle = (e) => setTitle(e.target.value);
  const handleChangeDescription = (e) => setDescription(e.target.value);

  const handleSubmit = () => {
    const data = {
      title: title?.trim(),
      description: description?.trim(),
      questionLikes: 0,
      users,
    };

    const db = getDatabase(app);

    const newDoc = push(ref(db, `studentSpace/spaces/${activeTab}/question`));

    set(newDoc, data)
      .then(() => {
        onGetQuestion(activeTab);
      })
      .catch(() => {});
    onClose();

    setTitle("");
    setDescription("");
  };

  const handleUpdate = () => {
    const data = {
      title,
      description,
      questionLikes: 0,
      users,
    };

    if (title.trim() !== "" && description.trim() !== "") {
      const db = getDatabase(app);

      const newDoc = ref(
        db,
        `studentSpace/spaces/${activeTab}/question/` + selectedId
      );

      set(newDoc, data)
        .then(() => {
          onClose();
          setTitle("");
          setDescription("");
          onGetQuestion(activeTab);
        })
        .catch(() => {});
    }
  };

  const handleCansel = () => {
    onClose();

    if (selectedId) {
      fetchData();
    } else {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <StyledContainer open={isOpenModal} onClose={handleCansel}>
      <img src={GreyImage} alt="img" />

      <Box className="title-container">
        <Typography variant="h4">NEW QUESTION</Typography>
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

        <Box className="input-box">
          <label htmlFor="description" className="label">
            Description
          </label>

          <textarea
            id="description"
            rows={4}
            placeholder="Description..."
            className="description"
            value={description}
            onChange={handleChangeDescription}
          />
        </Box>
      </Box>

      <Box className="button-container">
        <Button variant="outlined" onClick={handleCansel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={selectedId ? handleUpdate : handleSubmit}
          disabled={!title?.trim() || !description?.trim()}
        >
          {selectedId ? "Update" : "Add"}
        </Button>
      </Box>
    </StyledContainer>
  );
};

export default QuestionsModal;

const StyledContainer = styled(Modal)(() => ({
  "& > .content": {
    maxWidth: "45rem",
    width: "100%",
    height: "auto",
    padding: "0 0 1rem 0",

    "& > .close-icon": {
      display: "none",
    },

    "@media (max-width:900px)": {
      width: "65%",
    },

    "& > img": {
      borderRadius: "0.5rem 0.5rem 0 0",
      width: "100%",
      height: "30%",
    },

    "& > .title-container": {
      display: "flex",
      justifyContent: "center",
      margin: "-3rem 0 0 0",

      "& > .MuiTypography-root": {
        "@media (max-width:376px)": {
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

          "@media (max-width:900px)": {
            margin: "0 0 0 5rem",
          },

          "@media (max-width:600px)": {
            margin: "0 0 0 3.5rem",
          },

          "@media (max-width:376px)": {
            margin: "0 0 0 2.5rem",
          },
        },

        "& > .description": {
          width: "70%",
          border: "1px solid rgb(169, 167, 177)",
          resize: "none",
          padding: "0.8rem",
          borderRadius: "0.8rem",
          margin: "auto",

          "&:hover": {
            border: "1px solid black",
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

    // "@media (max-width:900px)": {
    //   width: "75%",
    //   height: "65%",

    //   "& > .content": {
    //     gap: "1rem",
    //     margin: "0",
    //   },
    // },

    // "@media (max-width:600px)": {
    //   width: "75%",
    //   height: "65%",

    //   "& > .content": {
    //     gap: "1rem",
    //     margin: "0",

    //     "& > .input-box": {
    //       width: "100%",
    //       gap: "0.1rem",

    //       "& > .MuiFormControl-root": {
    //         width: "100%",
    //       },

    //       "& > .label": {
    //         margin: "0 0 0 1rem",
    //       },

    //       "& > .description": {
    //         width: "100%",
    //       },
    //     },
    //   },
    // },

    // "@media (max-width:375px)": {
    //   width: "75%",
    //   height: "65%",

    //   "& > .title-container": {
    //     margin: "-2.5rem 0 0 0",

    //     "& > .MuiTypography-root": {
    //       fontSize: "1.5rem",
    //     },
    //   },
    // },
  },
}));
