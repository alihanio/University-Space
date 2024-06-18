import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, styled } from "@mui/material";
import Modal from "../../components/UI/Modal";
import { Image } from "../../assets/images";
import { PictureIcon } from "../../assets/icons";
import { get, getDatabase, ref, set } from "firebase/database";
import { app } from "../../configs/firebase";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  const [users, setUsers] = useState(null);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [university, setUniversity] = useState("");
  const [description, setDescription] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profileEmail, setProfileEmail] = useState("");

  const { email } = useSelector((state) => state.auth);

  const imageRef = useRef(null);

  useEffect(() => {
    const handleChangeState = () => {
      const data = {
        ...users,
        state: "online",
      };

      const db = getDatabase(app);
      const newDoc = ref(db, "studentSpace/users/" + users?.userId);

      set(newDoc, data)
        .then(() => {})
        .catch(() => {});
    };

    if (users?.userId) {
      handleChangeState();
    }
  }, [users]);

  window.addEventListener("beforeunload", async () => {
    if (users?.userId) {
      const db = getDatabase(app);

      const userRef = ref(db, "studentSpace/users/" + users?.userId);

      await set(userRef, {
        ...users,
        state: "offline",
      });
    }
  });

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

          const nameParts = temporaryArray[0]?.fullName.split(" ");

          setFirstName(nameParts[0]);
          setLastName(nameParts[nameParts.length - 1]);
          setProfileEmail(temporaryArray[0]?.email);
          setDescription(temporaryArray[0]?.description);
          setUniversity(temporaryArray[0]?.university);
          setDateOfBirth(temporaryArray[0]?.dateOfBirth);
          setImage(temporaryArray[0]?.photoUrl);
        }
      })

      .catch((error) => {
        console.error("Error getting user data:", error);
      });
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const modalHandler = () => {
    setOpen(true);

    getUsersData();
  };

  const closemodalHandler = () => {
    setOpen(false);

    setLastName("");
    setFirstName("");
    setProfileEmail("");
    setDescription("");
    setUniversity("");
    setDateOfBirth("");
    setImage("");
  };

  const handleProfileUpdate = () => {
    const data = {
      ...users,
      email: profileEmail,
      fullName: `${firstName} ${lastName}`,
      photoUrl: image,
      description: description,
      university: university,
      dateOfBirth: dateOfBirth,
    };

    const db = getDatabase(app);
    const newDoc = ref(db, "studentSpace/users/" + users?.userId);

    set(newDoc, data)
      .then(() => {
        getUsersData();
        setOpen(false);
      })
      .catch(() => {});
  };

  const handleClick = () => {
    if (image) {
      setImage(null);
    } else {
      imageRef.current.click();
    }
  };

  const changeFileHandler = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setImage(event.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleChangeLastName = (e) => setLastName(e.target.value);
  const handleChangeFirstName = (e) => setFirstName(e.target.value);
  const handleChangeUniversity = (e) => setUniversity(e.target.value);
  const handleChangeDescription = (e) => setDescription(e.target.value);
  const handleChangeDateOfBirth = (e) => setDateOfBirth(e.target.value);
  const handleChangeProfileEmail = (e) => setProfileEmail(e.target.value);

  const fullName = users?.fullName || "";

  const [userFirstName, userLastName] = fullName?.split(" ");

  return (
    <StyledContainer>
      <Typography>Profile</Typography>

      <Box className="profile-container">
        <Box className="photo-container">
          <Box className="photo-box">
            <img src={users?.photoUrl} alt="img" className="photo" />
          </Box>
        </Box>

        <Box className="background-container">
          <Typography className="full-name">{users?.fullName}</Typography>
          <Typography className="role">{users?.status}</Typography>
        </Box>

        <Box className="user-data">
          <button className="edit-button" onClick={modalHandler}>
            EDIT PROFILE
          </button>

          <StyledModal
            open={open}
            onClose={closemodalHandler}
            className="modal"
          >
            <Box>
              <Box className="photo-container" onClick={handleClick}>
                {image ? (
                  <img src={image} alt="img" className="photo" />
                ) : (
                  <>
                    <PictureIcon />

                    <input
                      ref={imageRef}
                      id="photo"
                      type="file"
                      accept=".jpg"
                      className="input-file"
                      onChange={changeFileHandler}
                      max="1"
                    />
                  </>
                )}
              </Box>

              <Typography className="description">
                click on the photo to change it
              </Typography>
            </Box>

            <Box className="inputs-container">
              <Box className="inputs-box">
                <Typography className="label">First name:</Typography>

                <input
                  value={firstName}
                  onChange={handleChangeFirstName}
                  type="text"
                  className="input"
                />
              </Box>

              <Box className="inputs-box">
                <Typography className="label">Last name:</Typography>

                <input
                  value={lastName}
                  onChange={handleChangeLastName}
                  type="text"
                  className="input"
                />
              </Box>

              <Box className="inputs-box">
                <Typography className="label">Date of Birth:</Typography>

                <input
                  value={dateOfBirth}
                  onChange={handleChangeDateOfBirth}
                  type="text"
                  className="input"
                  typeof="date"
                />
              </Box>
            </Box>

            <Box className="inputs-container">
              <Box className="inputs-box">
                <Typography className="label">Email:</Typography>

                <input
                  value={profileEmail}
                  onChange={handleChangeProfileEmail}
                  type="text"
                  className="input"
                />
              </Box>

              <Box className="inputs-box">
                <Typography className="label">University:</Typography>

                <input
                  value={university}
                  onChange={handleChangeUniversity}
                  type="text"
                  className="input"
                />
              </Box>

              <Box className="inputs-box">
                <Typography className="label">Description:</Typography>

                <input
                  value={description}
                  onChange={handleChangeDescription}
                  type="text"
                  className="input"
                  typeof="date"
                />
              </Box>

              <button
                className="save-button"
                disabled={
                  !firstName?.trim() ||
                  !lastName?.trim() ||
                  !profileEmail?.trim() ||
                  !university?.trim() ||
                  !dateOfBirth?.trim() ||
                  !description?.trim() ||
                  !image
                }
                onClick={handleProfileUpdate}
              >
                save
              </button>
            </Box>
          </StyledModal>

          <Box className="active-container">
            <Box className="active-box">
              <Typography className="quantity">{users?.followers}</Typography>

              <Typography className="active-title">Followers</Typography>
            </Box>
          </Box>

          <Typography className="about-me">About me</Typography>

          <Box className="about-me-box">
            <Box className="info-box">
              <Typography className="title">First name:</Typography>
              <Typography className="value">
                {userFirstName || "Not field in"}
              </Typography>
            </Box>

            <Box className="info-box">
              <Typography className="title">Last name:</Typography>
              <Typography className="value">
                {userLastName || "Not field in"}
              </Typography>
            </Box>

            <Box className="info-box">
              <Typography className="title">Date of Birth:</Typography>
              <Typography className="value">
                {users?.dateOfBirth || "Not field in"}
              </Typography>
            </Box>

            <Box className="info-box">
              <Typography className="title">University:</Typography>
              <Typography className="value">
                {users?.university || "Not field in"}
              </Typography>
            </Box>

            <Box className="info-box">
              <Typography className="title">Email:</Typography>
              <Typography className="value">
                {users?.email || "Not field in"}
              </Typography>
            </Box>

            <Box className="info-box desc">
              <Typography className="title">Description:</Typography>

              <Typography className="value desc">
                {users?.description || "Not field in"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default Profile;

const StyledContainer = styled(Box)(() => ({
  margin: "1rem 2rem 0 25rem",

  width: "100%",
  "& > .MuiTypography-root": {
    fontSize: "2rem",
    fontWeight: "bold",
    padding: "2rem 0",
    fontFamily: "Prosto One",
  },

  "@media (max-width:900px)": {
    marginLeft: "301px",
  },

  "@media (max-width:600px)": {
    marginLeft: "201px",
  },

  "@media (max-width:375px)": {
    marginLeft: "0px",
    padding: "20px 0 0 0",
  },

  "& > .profile-title": {
    fontFamily: "Prosto One",
    fontSize: "25px",
  },

  "& > .profile-container": {
    marginTop: "27px",
    width: "100%",
    height: "544px",
    position: "relative",

    "@media (max-width:600px)": {
      margin: "27px 1rem 1rem 0",
      width: "90%",
      height: "auto",
    },

    "@media (max-width:375px)": {
      margin: "27px 1rem 1rem 0",
      width: "85%",
      height: "auto",
    },

    "& > .background-container": {
      height: "176px",
      backgroundColor: "black",
      width: "100%",
      borderRadius: "27px 27px 0 0",
      backgroundImage: `url(${Image})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      paddingTop: "111px",

      "@media (max-width:900px)": {
        paddingTop: "90px",
      },

      "& > .full-name": {
        marginLeft: "213px",
        fontSize: "25px",
        color: "white",
        fontWeight: "400",
        fontFamily: "Prosto One",

        "@media (max-width:1080px)": {
          fontSize: "20px",
        },

        "@media (max-width:800px)": {
          fontSize: "17px",
        },

        "@media (max-width:600px)": {
          fontSize: "10px",
        },
      },

      "& > .role": {
        marginLeft: "213px",
        fontSize: "17px",
        color: "rgb(169, 167, 177)",
        fontWeight: "400",
        fontFamily: "Amiko",
      },
    },

    "& > .user-data": {
      width: "100%",
      display: "flex",
      alignContent: "flex-start",
      flexWrap: "wrap",
      boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.25)",
      borderRadius: "0 0 27px 27px",
      padding: "0 30px 24px",
      justifyContent: "space-between",

      "& > .edit-button": {
        marginTop: "63px",
        fontFamily: "Amiko",
        fontSize: "12px",
        width: "172px",
        height: "25px",
        borderRadius: "8px",
        border: "0.5px solid black",
        backgroundColor: "white",
        cursor: "pointer",
      },

      "& > .active-container": {
        display: "flex",
        margin: "17px 0 0 44%",
        gap: "21px",
        height: "48px",

        "@media (max-width:1200px)": {
          margin: "17px 16px 0 30%",
        },

        "@media (max-width:1080px)": {
          margin: "12px 16px 0 22%",
          gap: "10px",
        },

        "@media (max-width:1020px)": {
          margin: "12px 10px 0 10%",
        },

        "@media (max-width:900px)": {
          margin: "12px 10px 0 0",
          gap: "0",
        },

        "& > .active-box": {
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          width: "100px",

          "@media (max-width:900px)": {
            width: "80px",
          },

          "@media (max-width:600px)": {
            width: "80px",
            padding: "0 0 0 4rem",
          },

          "& > .quantity": {
            fontFamily: "Amiko",
            fontSize: "20px",

            "@media (max-width:1080px)": {
              fontSize: "17px",
            },
          },

          "& > .active-title": {
            fontFamily: "Amiko",
            fontSize: "17px",

            "@media (max-width:1080px)": {
              fontSize: "14px",
            },
          },
        },
      },

      "& > .about-me": {
        margin: "36px 0 0 6px",
        fontSize: "20px",
        fontFamily: "Anek Latin",
        fontWeight: "500",
        width: "100%",
      },

      "& > .about-me-box": {
        width: "100%",
        height: "190px",
        display: "flex",
        padding: "12.5px 0 0 8px",
        borderRadius: "16px",
        flexDirection: "column",
        gap: "3px",
        backgroundColor: "rgba(196, 196, 196, 0.23)",

        "& > .info-box": {
          display: "flex",
          alignItems: "center",
          gap: "5.5px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",

          "& > .title": {
            fontFamily: "Amiko",
            fontSize: "17px",
            fontWeight: "600",
          },

          "& > .value": {
            fontFamily: "Amiko",
            fontSize: "17px",
            color: "rgb(56, 51, 51)",
          },

          "& > .desc": {
            "@media (max-width:600px)": {
              minWidth: "150px",
              overflow: "hidden",
            },
          },
        },

        "& > .desc": {
          "@media (max-width:600px)": {
            minWidth: "150px",
            overflow: "hidden",
          },
        },
      },
    },

    "& > .photo-container": {
      top: "2rem",
      zIndex: "10",
      left: "1.7rem",
      width: "172px",
      padding: "6px",
      height: "178px",
      borderRadius: "9px",
      position: "absolute",
      backgroundColor: "white",
      boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.25)",

      "@media (max-width:900px)": {
        left: "1.7rem",
      },

      "@media (max-width:600px)": {
        left: "1.7rem",
      },

      "@media (max-width:375px)": {
        left: "1.7rem",
      },

      "& > .photo-box": {
        width: "100%",
        height: "100%",
        borderRadius: "5px",

        "& > .photo": {
          objectFit: "cover",
          width: "100%",
          height: "100%",
        },
      },
    },
  },
}));

const StyledModal = styled(Modal)(() => ({
  "& > .content": {
    display: "flex",
    width: "919px",
    transition: "0.5s",
    borderRadius: "29px",
    paddingBottom: "60px",

    "@media (max-width:1000px)": {
      width: "700px",
    },

    "@media (max-width:600px)": {
      paddingTop: "60px",
      width: "500px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflow: "scroll",
      height: "812px",
    },

    "@media (max-width: 600px)": {
      width: "400px",
    },

    "@media (max-width: 375px)": {
      width: "300px",
    },

    "& > div": {
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      textAlign: "center",
      gap: "10px",
      margin: "13px 0 0 13px",

      "& > .description": {
        width: "115px",
        fontFamily: "Prosto One",
        fontSize: "10px",
        color: "rgb(55, 133, 215)",
      },

      "& > .photo-container": {
        width: "172px",
        padding: "9px",
        height: "178px",
        borderRadius: "9px",
        boxShadow: "0 0 10px 1px rgba(0, 0, 0, 0.25)",

        "@media (max-width:600px)": {
          width: "auto",
          height: "auto",
        },

        "& > .photo": {
          width: "160px",
          height: "166px",
          objectFit: "cover",
          borderRadius: "5px",
        },

        "& > .input-file": {
          display: "none",
        },
      },
    },

    "& > .inputs-container": {
      margin: "63px 0 0 33px",

      "@media (max-width:1000px)": {
        width: "200px",
      },

      "@media (max-width:600px)": {
        margin: "0",
      },

      "& > .inputs-box": {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginBottom: "15px",

        "@media (max-width:600px)": {
          margin: 0,
        },

        "@media (max-width:375px)": {
          margin: 0,
        },

        "& > .label": {
          fontFamily: "Amiko",
          fontSize: "17px",
          fontWeight: "600",
        },

        "& > .input": {
          width: "268px",
          height: "38px",
          transition: "0.3s",
          fontFamily: "Amiko",
          fontSize: "14px",
          padding: "0 15px",
          borderRadius: "10px",
          border: "1px solid #BDBDBD",

          "@media (max-width:1000px)": {
            width: "200px",
          },
        },
      },

      "& > .save-button": {
        height: "30px",
        width: "87px",
        borderRadius: "10px",
        border: "1px solid",
        backgroundColor: "white",
        fontFamily: "Amiko",
        fontSize: "14px",
        fontWeight: "600",
        marginLeft: "180px",
        cursor: "pointer",

        "&:hover": {
          color: "white",
          backgroundColor: "black",
        },

        "@media (max-width:1000px)": {
          marginLeft: "100px",
        },
      },
    },
  },
}));
