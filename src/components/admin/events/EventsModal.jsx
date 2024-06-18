import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Box,
  Button,
  ButtonGroup,
  TextField,
  styled,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { get, getDatabase, push, ref, set } from "firebase/database";
import Modal from "../../UI/Modal";
import { CalendarIcon, PictureIcon } from "../../../assets/icons";
import { showToast } from "../../../utils/helpers/toast";
import { app } from "../../../configs/firebase";

const EventsModal = ({ isOpen, onClose, selectId }) => {
  const [date, setDate] = useState(null);
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleChangeImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const changeDateHandler = (date) => {
    setDate(date);
  };

  const fetchData = async () => {
    const db = getDatabase();

    const dbRef = ref(db, "studentSpace/events/" + selectId);

    await get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const targetObject = snapshot.val();

          setImage(targetObject.image);
          setTitle(targetObject.title);
          setDescription(targetObject.description);
          setDate(dayjs(targetObject.date));
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

  const onSubmit = () => {
    const formattedDate = date.format("YYYY-MM-DD");

    if (selectId) {
      const newData = {
        image: image,
        title: title,
        description: description,
        date: formattedDate,
      };

      const db = getDatabase(app);

      const newDoc = ref(db, "studentSpace/events/" + selectId);

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
    } else {
      const dateToSend = {
        image: image,
        title: title,
        description: description,
        date: formattedDate,
      };

      const db = getDatabase(app);

      const newDoc = push(ref(db, "studentSpace/events"));

      set(newDoc, dateToSend)
        .then(() => {
          onClose();
          setImage("");
          setTitle("");
          setDescription("");
          setDate(null);

          showToast({
            title: "Add News",
            message: "Successfully added:)",
            type: "success",
          });
        })
        .catch(() => {
          showToast({
            title: "Add News",
            message: "Something went wrong:(",
            type: "error",
          });
        });
    }
  };

  const dateToday = dayjs();

  const handleCancel = () => {
    onClose();

    if (selectId) {
      fetchData();
    } else {
      setTitle("");
      setDescription("");
      setImage("");
      setDate(dayjs());
    }
  };

  return (
    <Modal open={isOpen} icon={false} onClose={handleCancel}>
      <StyledContainer>
        <label htmlFor="upload-photo">
          <Box
            style={{ border: image ? "none" : "2px dashed black" }}
            className="photo-container"
          >
            <input
              type="file"
              id="upload-photo"
              accept="image/*"
              onChange={handleChangeImage}
              style={{ display: "none" }}
            />

            {image ? (
              <img className="image" src={image} alt="Selected" />
            ) : (
              <>
                <PictureIcon />
              </>
            )}
          </Box>
        </label>

        <Box className="bermet">
          <Box className="inputs-container">
            <Box>
              <label htmlFor="title">Title</label>

              <StyledInput
                id="title"
                value={title}
                variant="outlined"
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              />

              <Typography className="error-text"></Typography>
            </Box>

            <Box>
              <label htmlFor="description">Description</label>

              <StyledInput
                id="description"
                value={description}
                variant="outlined"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
              />

              <Typography className="error-text"></Typography>
            </Box>
          </Box>

          <Box>
            <label htmlFor="date">Date</label>

            <StyledDatePicker
              slots={{
                openPickerIcon: CalendarIcon,
              }}
              value={date}
              onChange={changeDateHandler}
              minDate={dateToday}
            />

            <Typography className="error-text"></Typography>
          </Box>
        </Box>

        <ButtonGroup className="buttons-container">
          <Button className="button" onClick={handleCancel} variant="contained">
            Cancel
          </Button>

          <StyledButton
            disabled={!title?.trim() || !description?.trim() || !date || !image}
            onClick={onSubmit}
            variant="contained"
          >
            {selectId ? "Update" : "Add"}
          </StyledButton>
        </ButtonGroup>
      </StyledContainer>
    </Modal>
  );
};

export default EventsModal;

const StyledContainer = styled("form")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "conter",
  width: "500px",
  gap: "30px",

  "& > label": {
    "& > .photo-container": {
      width: "100%",
      height: "200px",
      display: "flex",
      alignItems: "center",

      justifyContent: "center",
    },
  },

  "& .image": {
    objectFit: "cover",
    borderRadius: "8px",
    maxHeight: "200px",
  },

  "& > .bermet": {
    display: "flex",
    gap: "20px",

    "& > .inputs-container": {
      display: "flex",
      flexDirection: "column",
      gap: "20px",

      "& > div": {
        display: "flex",
        flexDirection: "column",
      },
    },

    "& > div": {
      display: "flex",
      flexDirection: "column",
    },
  },

  "& .error-text": {
    color: "red",
    position: "relative",
    fontSize: "12px",
  },

  "& > .buttons-container": {
    display: "flex",
    gap: "20px",
    alignSelf: "end",

    "& > .button": {
      width: "6rem",
      height: "2rem",
      fontSize: ".7rem",
      color: "black",
      fontWeight: "bold",
      backgroundColor: "white",
      borderRadius: "1rem",
      display: "flex",
      justifyContent: "space-around",
      border: "1px solid black",
      alignItems: "center",
    },

    "& > button:last-child": {
      borderRadius: "1rem",
    },
  },

  "@media (max-width: 375px)": {
    width: "250px",

    "& .image": {
      width: "100%",
    },

    "& > .bermet": {
      flexDirection: "column-reverse",

      "& > .inputs-container": {
        gap: "10px",
      },
    },
  },
}));

const StyledDatePicker = styled(DatePicker)(() => ({
  fontFamily: "Roboto",
  fontWeight: "600",
  border: "none",
  padding: "0",

  "& input": {
    fontWeight: "550",
    fontSize: "1rem",
    padding: "0",
    width: "6.5rem",
    color: "#4D4E51",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
}));

const StyledInput = styled(TextField)(() => ({
  "& .MuiInputBase-input": {
    height: "10px",
    width: "270px",

    "@media (max-width: 375px)": {
      width: "150px",
    },

    borderRadius: ".3rem",
  },

  "& .MuiOutlinedInput-input": {
    height: "10px",
  },
}));

const StyledButton = styled(Button)(() => ({
  width: "6rem",
  height: "2rem",
  fontWeight: "bold",
  color: "white",
  backgroundColor: "black",
  borderRadius: "20px",
  border: "1px solid black",
  padding: "0.625rem 1rem",
  fontSize: ".7rem",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",

  "& .Mui-disabled": {
    backgroundColor: "gray",
    borderRadius: "20px",
  },
}));
