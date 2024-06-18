import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { get, getDatabase, ref, set } from "firebase/database";
import { Box, Button, Typography, styled } from "@mui/material";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { ROLES } from "../../../routes/routes";
import { Image } from "../../../assets/images";
import { app } from "../../../configs/firebase";

const InnerNetworking = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [makeMentor, setMakeMentor] = useState(false);
  const [innerData, setInnerData] = useState(null);

  const { id } = useParams();

  const { role } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    const storedSubscribed = JSON.parse(
      localStorage.getItem(`subscribed-${id}`)
    );
    if (storedSubscribed !== null) {
      setSubscribed(storedSubscribed);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    const storedMentorStatus = JSON.parse(localStorage.getItem(`mentor-${id}`));

    if (storedMentorStatus !== null) {
      setMakeMentor(storedMentorStatus);
    }
  }, [id]);

  const fetchData = async () => {
    const db = getDatabase();

    const dbRef = ref(db, "studentSpace/users/" + id);

    try {
      const snapshot = await get(dbRef);

      if (snapshot.exists()) {
        const targetObject = snapshot.val();

        setInnerData(targetObject);
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  };

  const handleSubscribe = () => {
    setSubscribed((prev) => !prev);

    localStorage.setItem(`subscribed-${id}`, JSON.stringify(!subscribed));
    if (innerData.followers !== -1) {
      const followersCount = subscribed
        ? innerData.followers - 1 >= 0
          ? innerData.followers - 1
          : 0
        : innerData.followers + 1;

      const data = {
        ...innerData,
        followers: followersCount,
      };
      updateUserData(data);
    }
  };

  const handleMakeMentor = () => {
    setMakeMentor((prev) => !prev);

    localStorage.setItem(`mentor-${id}`, JSON.stringify(!makeMentor));

    const mentorStatus = makeMentor ? "Student" : "Mentor";

    const data = {
      ...innerData,
      status: mentorStatus,
    };

    updateUserData(data);
  };

  const updateUserData = (data) => {
    const db = getDatabase(app);

    const userRef = ref(db, "studentSpace/users/" + id);

    set(userRef, data)
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  const fullName = innerData?.fullName || "";

  const [firstName, lastName] = fullName.split(" ");

  const handleGoBack = () => navigate(-1);

  return (
    <StyledContainer>
      <KeyboardBackspaceOutlinedIcon
        className="go-back"
        onClick={handleGoBack}
      />

      <Box className="content">
        <img src={Image} alt="imag" className="image" />

        <img src={innerData?.photoUrl} alt="profily" className="user-photo" />

        <Box className="followers-container">
          <Box className="followers">
            <Typography>
              <span>{innerData?.followers}</span> Followers
            </Typography>
          </Box>

          {role === ROLES.ADMIN ? (
            <Button variant="contained" onClick={handleMakeMentor}>
              {makeMentor ? "Revert to student" : "Make a mentor"}
            </Button>
          ) : null}

          <Button
            variant="contained"
            onClick={handleSubscribe}
            className={subscribed ? "subscribed" : ""}
          >
            {subscribed ? "You are subscribed" : "+ Subscribe"}
          </Button>
        </Box>

        <Box className="about">
          <Typography variant="h5" className="title">
            About
          </Typography>

          <Box className="description">
            <Typography>
              First name: <span>{firstName}</span>
            </Typography>

            <Typography>
              Last name: <span>{lastName}</span>
            </Typography>

            <Typography>
              Data of Birth:
              <span>{innerData?.dateOfBirth || "Not filled in"}</span>
            </Typography>

            <Typography>
              University:
              <span>{innerData?.university || "Not filled in"}</span>
            </Typography>

            <Typography>
              Email: <span>{innerData?.email}</span>
            </Typography>

            <Typography>
              Description:
              <span>{innerData?.description || "Not filled in"}</span>
            </Typography>
          </Box>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default InnerNetworking;

const StyledContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  margin: "2rem 0 0 23rem",
  width: "100%",

  "@media (max-width: 900px)": {
    margin: "2rem 0 0 20rem",
  },

  "@media (max-width: 600px)": {
    margin: "2rem 0 0 12rem",
  },

  "@media (max-width: 375px)": {
    margin: "2rem 0 0 0",
  },

  "& > .go-back": {
    position: "absolute",
    top: "2rem",
    left: "23rem",
    cursor: "pointer",
    fontSize: "1.5rem",
    color: "black",

    "@media (max-width: 900px)": {
      left: "20rem",
    },

    "@media (max-width: 600px)": {
      left: "13rem",
    },

    "@media (max-width: 375px)": {
      left: "3rem",
    },
  },

  "& > .content": {
    width: "90%",
    height: "auto",
    padding: "0 0 1rem 0",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    borderRadius: "1rem",
    margin: "0 0 1rem 0",

    "@media (max-width: 375px)": {
      width: "85%",
    },

    "& > .image": {
      width: "100%",
      height: "12rem",
      borderRadius: "1rem 1rem 0 0",
    },

    "& > .user-photo": {
      maxWidth: "12rem",
      width: "100%",
      height: "12rem",
      backgroundColor: "white",
      margin: "-7rem 0 0 2%",
      padding: "0.5rem",
      borderRadius: "1rem",
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 10px",

      "@media (max-width: 375px)": {
        margin: "-7rem 0 0 12%",
        width: "90%",
      },
    },

    "& > .followers-container": {
      display: "flex",
      justifyContent: "flex-end",
      flexDirection: "column",
      alignItems: "flex-end",
      margin: "0 2rem 0 0",
      gap: "1rem",

      "@media (max-width: 600px)": {
        margin: "6rem 0 0 2rem",
        alignItems: "flex-start",
      },

      "@media (max-width: 375px)": {
        margin: "6rem 0 0 0",
        alignItems: "center",
      },

      "& > .followers": {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        margin: "-5.5rem 2.5rem 0.5rem 0",

        "& > .MuiTypography-root": {
          width: "5.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "grey",
          fontSize: "0.9rem",

          "& > span": {
            fontWeight: "bold",
            fontSize: "1.2rem",
            color: "black",
          },
        },
      },

      "& > .MuiButton-root": {
        maxWidth: "10rem",
        width: "100%",
        height: "auto",
        borderColor: "black",
        textTransform: "none",
        background: "black",
        color: "white",

        "&:active": {
          background: "white",
          color: "black",
        },

        "&.subscribed": {
          background: "#aeaeae",
          color: "white",
        },
      },
    },

    "& > .about": {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      margin: "0 2rem",

      "& > .title": {
        fontWeight: "bold",
        margin: "1rem 0 0 0.5rem",
      },

      "& > .description": {
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
        padding: "1rem",
        backgroundColor: "#f2f2f2",
        borderRadius: "1rem",

        "& > .MuiTypography-root": {
          fontWeight: "bold",
          wordBreak: "break-all",

          "& > span": {
            color: "grey",
            fontWeight: "normal",
          },
        },
      },
    },
  },
}));
