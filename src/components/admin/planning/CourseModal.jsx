import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { get, getDatabase, push, ref, set } from "firebase/database";
import { Box, Button, TextField, styled } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import Modal from "../../UI/Modal";
import { PictureIcon } from "../../../assets/icons";
import { app } from "../../../configs/firebase";
import { showToast } from "../../../utils/helpers/toast";

const CourseModel = ({ isOpenModal, onClose, selectId }) => {
  const [description, setDescription] = useState("");
  const [instructor, setInstructor] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState(dayjs());

  const { email } = useSelector((state) => state.auth);

  const imageRef = useRef(null);

  const handleChangeTitle = (e) => setTitle(e.target.value);
  const handleChangeInstructor = (e) => setInstructor(e.target.value);
  const handleChangeDescription = (e) => setDescription(e.target.value);
  const handleChangeDate = (date) => setDate(date);

  const handleClick = () => {
    if (image) {
      setImage(null);
    } else {
      imageRef.current.click();
    }
  };

  const formatDate = (date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, "0");

    return `${month}.${day}.${year}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setImage(event.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const fetchData = async () => {
    const db = getDatabase();

    const dbRef = ref(db, "studentSpace/planning/" + selectId);

    await get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const targetObject = snapshot.val();

          setTitle(targetObject.title);
          setDescription(targetObject.description);
          setInstructor(targetObject.instructor);
          setDate(dayjs(targetObject.date));
          setImage(targetObject.imageUrl);
        }
      })
      .catch((error) => {
        console.error("Error getting news data:", error);
      });
  };

  useEffect(() => {
    if (selectId) {
      fetchData();
    }
  }, [selectId]);

  const AddPlanning = () => {
    const dateToSend = {
      title: title.trim(),
      description: description.trim(),
      imageUrl: image,
      date: formatDate(date.$d),
      instructor: instructor.trim(),
      userEmail: email,
    };

    const db = getDatabase(app);

    const newDoc = push(ref(db, "studentSpace/planning"));

    set(newDoc, dateToSend)
      .then(() => {
        onClose();

        setTitle("");
        setDate(dayjs());
        setDescription("");
        setInstructor("");
        setImage("");

        showToast({
          title: "Add Possibilities",
          message: "Successfully added:)",
          type: "success",
        });
      })
      .catch(() => {
        showToast({
          title: "Add Possibilities",
          message: "Something went wrong:(",
          type: "error",
        });
      });
  };

  const updatePlanning = () => {
    const newData = {
      title: title.trim(),
      description: description.trim(),
      imageUrl: image,
      date: formatDate(date.$d),
      instructor: instructor.trim(),
      userEmail: email,
    };

    const db = getDatabase(app);

    const newDoc = ref(db, "studentSpace/planning/" + selectId);

    set(newDoc, newData)
      .then(() => {
        onClose();

        showToast({
          title: "Update",
          message: "Successfully updated",
          type: "success",
        });
      })
      .catch(() => {
        showToast({
          title: "Update",
          message: "Something went wrong:(",
          type: "error",
        });
      });
  };

  const handleCansel = () => {
    onClose();

    if (selectId) {
      fetchData();
    } else {
      setTitle("");
      setDate(dayjs());
      setDescription("");
      setInstructor("");
      setImage("");
    }
  };

  return (
    <StyledModal open={isOpenModal} onClose={handleCansel}>
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
        <label htmlFor="instructor" className="label">
          Instructor
        </label>

        <TextField
          id="instructor"
          placeholder="Full name"
          value={instructor}
          onChange={handleChangeInstructor}
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

      <Box className="row-box">
        <Box
          onClick={handleClick}
          className="add-img-box"
          style={{ border: image ? "none" : "2px dashed black" }}
        >
          {image ? (
            <img src={image} alt="Selected" className="image" />
          ) : (
            <>
              <PictureIcon />

              <input
                ref={imageRef}
                id="photo"
                type="file"
                accept=".jpg, .png"
                className="input-file"
                onChange={handleFileChange}
                max="1"
              />
            </>
          )}
        </Box>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateField"]}>
            <DemoItem label="Date of news">
              <DesktopDatePicker
                value={date}
                defaultValue={dayjs()}
                minDate={dayjs()}
                onChange={handleChangeDate}
              />
            </DemoItem>
          </DemoContainer>
        </LocalizationProvider>
      </Box>

      <Box className="button-box">
        <Button className="cansel-btn" onClick={handleCansel}>
          Cancel
        </Button>

        <Button
          onClick={selectId ? updatePlanning : AddPlanning}
          className="save-btn"
          disabled={
            !title.trim() || !instructor.trim() || !description.trim() || !image
          }
        >
          {selectId ? "Update" : "Add"}
        </Button>
      </Box>
    </StyledModal>
  );
};

export default CourseModel;

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

      "& > .description": {
        width: "30rem",
        border: "1px solid rgb(169, 167, 177)",
        resize: "none",
        padding: "0.8rem",
        borderRadius: "0.8rem",

        "&:hover": {
          border: "1px solid black",
        },
      },
    },

    "& > .close-icon": {
      display: "none",
    },

    "& >.row-box": {
      display: "flex",
      gap: "1rem",

      "& > .add-img-box": {
        width: "18.75rem",
        height: "10.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",

        "& > .input-file": {
          display: "none",
        },

        "& > .image": {
          width: "18.75rem",
          height: "10.5rem",
          borderRadius: "0rem",
        },
      },
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
      overflowY: "scroll",
      height: "30rem",

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

      "& >.row-box": {
        "& > .add-img-box": {
          width: "16.75rem",
          height: "10.5rem",

          "& > .input-file": {
            display: "none",
          },

          "& > .image": {
            width: "16.75rem",
            height: "10.5rem",
            borderRadius: "0rem",
          },
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

      "& > .input-box": {
        width: "100%",
        display: "flex",
        gap: "0.2rem",
        flexDirection: "column",

        "& > .description": {
          width: "27rem",
          border: "1px solid rgb(169, 167, 177)",
          padding: "0.8rem",
          borderRadius: "0.8rem",

          "&:hover": {
            border: "1px solid black",
          },
        },
      },
    },

    "@media (max-width:600px)": {
      gap: "0.5rem",
      padding: "1rem 2rem",
      overflowY: "scroll",
      height: "25rem",

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

      "& >.row-box": {
        "& > .add-img-box": {
          width: "12.75rem",
          height: "8.5rem",

          "& > .input-file": {
            display: "none",
          },

          "& > .image": {
            width: "12.75rem",
            height: "8.5rem",
            borderRadius: "0rem",
          },
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

        "& > .description": {
          width: "23rem",
          border: "1px solid rgb(169, 167, 177)",
          padding: "0.8rem",
          borderRadius: "0.8rem",

          "&:hover": {
            border: "1px solid black",
          },
        },
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

      "& >.row-box": {
        "& > .add-img-box": {
          width: "8.75rem",
          height: "6.5rem",

          "& > .input-file": {
            display: "none",
          },

          "& > .image": {
            width: "8.75rem",
            height: "6.5rem",
            borderRadius: "0rem",
          },
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

        "& > .description": {
          width: "16rem",
          border: "1px solid rgb(169, 167, 177)",
          resize: "none",
          padding: "0.8rem",
          borderRadius: "0.8rem",
          fontSize: "0.6rem",

          "&:hover": {
            border: "1px solid black",
          },
        },
      },
    },
  },
}));
