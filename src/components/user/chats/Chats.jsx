import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { get, getDatabase, onValue, ref, set } from "firebase/database";
import { Box, Typography, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { app } from "../../../configs/firebase";

const Chats = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [myUsers, setMyUsers] = useState(null);
  const [users, setUsers] = useState([]);

  const { email, role } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    const getChatsData = async () => {
      const db = getDatabase(app);

      const dbRef = ref(db, "studentSpace/users");
      await get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const myData = snapshot.val();

            const temporaryArray = Object.keys(myData).map((myFireId) => {
              return { ...myData[myFireId], userId: myFireId };
            });

            const filteredArray = temporaryArray.filter(
              (user) => user.email !== email
            );

            setUsers(filteredArray);
          }
        })
        .catch((error) => {
          console.error("Error getting news data:", error);
        });
    };

    getChatsData();

    const db = getDatabase(app);

    const usersRef = ref(db, "studentSpace/users");

    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const myData = snapshot.val();

        const temporaryArray = Object.keys(myData).map((myFireId) => {
          return { ...myData[myFireId], userId: myFireId };
        });

        const filteredArray = temporaryArray.filter(
          (user) => user.email !== email
        );

        setUsers(filteredArray);
      }
    });
  }, [email]);

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

          setMyUsers(temporaryArray[0]);
        }
      })
      .catch((error) => {
        console.error("Error getting user data:", error);
      });
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const filteredUsers = users?.filter((user) =>
    user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleChangeState = () => {
      const data = {
        ...myUsers,
        state: "online",
      };

      const db = getDatabase(app);

      const newDoc = ref(db, "studentSpace/users/" + myUsers?.userId);

      set(newDoc, data)
        .then(() => {})
        .catch(() => {});
    };
    if (myUsers?.userId) {
      handleChangeState();
    }
  }, [myUsers, myUsers?.userId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNavigate = (userId) => {
    if (role === "ADMIN") {
      navigate(`/admin/chats/${userId}`);
    } else {
      navigate(`/user/chats/${userId}`);
    }
  };

  return (
    <StyledContainer>
      <Typography>CHATS</Typography>

      <Box className="form-box">
        <Box className="input-box">
          <input
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <SearchIcon className="search-icon" />
        </Box>

        <Box className="users-container">
          {filteredUsers?.map((user) => (
            <Box
              key={user.userId}
              className="user-box"
              onClick={() => handleNavigate(user.userId)}
            >
              <img className="user-img" src={user?.photoUrl} alt="user-img" />

              <Box>
                <Typography className="user-name">{user?.fullName}</Typography>

                <Typography className="new-message">
                  {user.isMessage ? "new message !" : ""}
                </Typography>
              </Box>

              <Typography
                style={
                  user?.state === "online"
                    ? { color: "#00e676" }
                    : { color: "red" }
                }
                className="user-state"
              >
                {user?.state}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default Chats;

const StyledContainer = styled(Box)(() => ({
  width: "1400px",
  margin: "1rem 2rem 0 25rem",

  "& > .MuiTypography-root": {
    fontSize: "2rem",
    fontWeight: "bold",
    padding: "2rem 0",
    fontFamily: "Prosto One",
  },

  "& > .form-box": {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",

    "& > .input-box": {
      width: "80%",
      position: "relative",

      "@media (max-width: 750px)": {
        width: "100%",
      },

      "@media (max-width: 375px)": {
        width: "100%",
      },

      "& > .search-input": {
        width: "100%",
        height: "2.25rem",
        backgroundColor: "rgba(196, 196, 196, 0.21)",
        border: "none",
        borderRadius: "3rem",
        padding: "0.5rem 2.5rem",
        fontSize: "1rem",
        color: "rgb(117, 117, 117)",
        outline: "none",
      },

      "& > .search-icon": {
        color: "rgb(117, 117, 117)",
        position: "absolute",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
      },
    },

    "& > .users-container": {
      display: "flex",
      flexDirection: "column",
      marginTop: "3%",
      gap: "1rem",
      width: "80%",
      maxWidth: "774px",

      "@media (max-width: 750px)": {
        width: "100%",
      },

      "@media (max-width: 375px)": {
        width: "100%",
      },

      "& > .user-box": {
        display: "flex",
        width: "100%",
        alignItems: "center",
        padding: "0.5rem 1rem",
        cursor: "pointer",
        boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
        borderRadius: "1rem",
        position: "relative",

        "& > .user-img": {
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
          marginRight: "1rem",
          cursor: "pointer",
        },

        "&  .new-message": {
          fontSize: "0.8rem",
          color: "green",
        },

        "& .user-name": {
          "@media (max-width: 600px)": {
            maxWidth: "50px",
          },
        },

        "& > .user-state": {
          position: "absolute",
          right: "1rem",
        },
      },
    },
  },

  "@media (max-width: 900px)": {
    margin: "1rem 2rem 0 20rem",
  },

  "@media (max-width: 600px)": {
    margin: "1rem 2rem 0 14rem",
  },

  "@media (max-width: 375px)": {
    margin: "1rem 2rem 0 0",
  },
}));
