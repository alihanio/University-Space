import React, { useEffect, useState } from "react";
import { get, getDatabase, push, ref, set } from "firebase/database";
import { Box, TextField, Typography, styled } from "@mui/material";
import Modal from "../../UI/Modal";
import { CloudsImage } from "../../../assets/images";
import { showToast } from "../../../utils/helpers/toast";
import { app } from "../../../configs/firebase";

const PossibilitiesModal = ({ isOpenModal, onClose, selectId, filter }) => {
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");

  const fetchData = async () => {
    const db = getDatabase();

    const dbRef = ref(db, "studentSpace/possibilities/" + selectId);

    await get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const targetObject = snapshot.val();

          setTitle(targetObject.title);
          setDescription(targetObject.description);
          setPrice(targetObject.price);
          setExperience(targetObject.experience);
          setLocation(targetObject.location);
          setType(targetObject.type);
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

  const handleTitleChange = (event) => setTitle(event.target.value);

  const handlePriceChange = (event) => {
    const inputValue = parseFloat(event.target.value);

    const newPrice = isNaN(inputValue) ? "" : Math.max(0, inputValue);
    setPrice(newPrice);
  };

  const handleExperienceChange = (event) => setExperience(event.target.value);
  const handleLocationChange = (event) => setLocation(event.target.value);
  const handleDescriptionChange = (event) => setDescription(event.target.value);

  const AddPossibilities = () => {
    const dateToSend = {
      title: title,
      description: description,
      price: price,
      location: location,
      experience: experience,
      type: filter,
    };

    const db = getDatabase(app);

    const newDoc = push(ref(db, "studentSpace/possibilities"));

    set(newDoc, dateToSend)
      .then(() => {
        onClose();
        setTitle("");
        setDescription("");
        setPrice("");
        setLocation("");
        setExperience("");

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

  const updatePossibilities = () => {
    const newData = {
      title: title,
      description: description,
      price: price,
      location: location,
      experience: experience,
      type: type,
    };

    const db = getDatabase(app);

    const newDoc = ref(db, "studentSpace/possibilities/" + selectId);

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
      setDescription("");
      setPrice("");
      setLocation("");
      setExperience("");
    }
  };

  return (
    <StyledModal open={isOpenModal} onClose={handleCansel} icon={false}>
      <Box className="title-container">
        <Typography variant="h1" className="title">
          NEW POSSIBILITIES
        </Typography>
      </Box>

      <Box className="inputs-container">
        <TextField
          type="text"
          className="inputs"
          label="Title:"
          variant="outlined"
          color="grey"
          value={title}
          onChange={handleTitleChange}
        />
        <TextField
          type="number"
          className="inputs"
          label="Price:"
          variant="outlined"
          color="grey"
          value={price}
          onChange={handlePriceChange}
        />
        <TextField
          type="text"
          className="inputs"
          label="Experience:"
          variant="outlined"
          color="grey"
          value={experience}
          onChange={handleExperienceChange}
        />
        <TextField
          type="text"
          className="inputs"
          label="Location:"
          variant="outlined"
          color="grey"
          value={location}
          onChange={handleLocationChange}
        />
      </Box>

      <Box className="last-part">
        <TextField
          type="text"
          className="description"
          label="Description:"
          color="grey"
          id="outlined-multiline-static"
          multiline
          rows={4}
          value={description}
          onChange={handleDescriptionChange}
        />

        <Box className="buttons-container">
          <button className="buttons" onClick={handleCansel}>
            Cancel
          </button>
          <button
            disabled={
              !title?.trim() ||
              !description?.trim() ||
              !price ||
              !experience?.trim() ||
              !location?.trim()
            }
            className="buttons add"
            onClick={selectId ? updatePossibilities : AddPossibilities}
          >
            {selectId ? "Update" : "Add"}
          </button>
        </Box>
      </Box>
    </StyledModal>
  );
};

export default PossibilitiesModal;

const StyledModal = styled(Modal)(() => ({
  "& > .content": {
    padding: "0 0 30px 0 !important",
    width: "980px",

    borderRadius: "34px",

    "@media (max-width: 900px)": {
      width: "600px",
    },

    "& > .title-container": {
      height: "151px",
      borderTopRightRadius: "34px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      backgroundImage: `url(${CloudsImage})`,

      "& > .title": {
        fontSize: "33px",
      },
    },

    "& > .inputs-container": {
      display: "flex",
      flexWrap: "wrap",
      gap: "35px",
      marginTop: "30px",
      justifyContent: "center",

      "& > .inputs": {
        width: "403px",

        "& > div": {
          borderRadius: "10px",
        },
      },
    },

    "& > .last-part": {
      display: "flex",
      flexWrap: "wrap",

      "& > .description": {
        width: "569px",
        height: "107px",
        margin: "30px 70px",

        "@media (max-width: 900px)": {
          width: "400px",
          margin: "30px 0 0 100px",
        },

        "& > div": {
          borderRadius: "10px",
          height: "100%",
        },
      },

      "& > .buttons-container": {
        display: "flex",
        gap: "25px",
        margin: "105px 0 0 35px",

        "@media (max-width: 900px)": {
          margin: "90px 0 0 190px",
        },

        "& > .buttons": {
          padding: "3px 20px",
          height: "30px",
          border: "2px solid black",
          borderRadius: "10px",
          backgroundColor: "white",
          fontFamily: "Amiko",
          fontWeight: "700",
          cursor: "pointer",
        },

        "& > .add": {
          color: "white",
          backgroundColor: "black",
        },
      },
    },
  },
}));
