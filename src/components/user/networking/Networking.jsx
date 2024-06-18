import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { get, getDatabase, onValue, ref } from "firebase/database";
import { Box, Typography, styled } from "@mui/material";
import { ROUTES } from "../../../routes/routes";
import { app } from "../../../configs/firebase";
import { SearchIcon } from "../../../assets/icons";

const Networking = () => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [users, setUsers] = useState([]);

  const { email, role } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  useEffect(() => {
    const getUsersData = async () => {
      const db = getDatabase(app);

      const dbRef = ref(db, "studentSpace/users");

      await get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const myData = snapshot.val();

            const temporaryArray = Object.keys(myData)
              .map((myFireId) => ({ ...myData[myFireId], userId: myFireId }))
              .filter((user) => user.email !== email);

            setUsers(temporaryArray);
          }
        })
        .catch((error) => {
          console.error("Error getting news data:", error);
        });
    };
    getUsersData();

    const db = getDatabase(app);

    const usersRef = ref(db, "studentSpace/users");

    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const myData = snapshot.val();

        const userList = Object.keys(myData)
          .map((key) => ({
            ...myData[key],
            userId: key,
          }))
          .filter((user) => user.email !== email);

        const filteredList = status
          ? userList.filter((user) => user.status === status)
          : userList;

        setUsers(userList);
        setFilteredUsers(filteredList);
      }
    });
  }, [email, status]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    filterUsers(e.target.value);
  };

  const filterUsers = (searchText) => {
    const filteredList = users.filter((user) =>
      user.fullName.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredUsers(filteredList);
  };

  const navigateHandler = (id) => {
    const routePrefix =
      role === "ADMIN" ? ROUTES.ADMIN.INDEX : ROUTES.USER.INDEX;

    navigate(`${routePrefix}${ROUTES.ADMIN.NETWORKING}/${id}`);
  };

  const handleFilteredByStatus = (userStatus) => {
    setStatus(userStatus);
  };

  const handleShowAll = () => setStatus("");

  return (
    <StyledContainer>
      <Typography>NETWORKING</Typography>

      <Box className="input-box">
        <input
          className="search-input"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchChange}
        />
        <SearchIcon className="search-icon" />
      </Box>

      <Box className="filters-container">
        <Typography
          onClick={handleShowAll}
          className={status === "" ? "active-filter" : ""}
        >
          All
        </Typography>

        <Typography
          onClick={() => handleFilteredByStatus("Student")}
          className={status === "Student" ? "active-filter" : ""}
        >
          Student
        </Typography>

        <Typography
          onClick={() => handleFilteredByStatus("Mentor")}
          className={status === "Mentor" ? "active-filter" : ""}
        >
          Mentor
        </Typography>
      </Box>

      <Box className="content">
        {filteredUsers?.length > 0 ? (
          filteredUsers?.map(({ photoUrl, fullName, status, userId }) => (
            <Box
              className="card"
              key={userId}
              onClick={() => navigateHandler(userId)}
            >
              <img src={photoUrl} alt="person" className="image" />

              <Box className="text">
                <Typography className="full-name">{fullName}</Typography>

                <Typography className="status">
                  <span className="dot"> </span>
                  {status}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>No users found</Typography>
        )}
      </Box>
    </StyledContainer>
  );
};
export default Networking;
const StyledContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  margin: "1rem 2rem 0 25rem",
  width: "100%",

  "& > .MuiTypography-root": {
    fontSize: "2rem",
    fontWeight: "bold",
    padding: "2rem 0",
    fontFamily: "Prosto One",
  },

  "& > .input-box": {
    width: "38.125rem",
    position: "relative",

    "& > .search-input": {
      width: "38.125rem",
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

  "& > .filters-container": {
    display: "flex",
    justifyContent: "flex-end",
    gap: "3rem",

    "& > .MuiTypography-root": {
      cursor: "pointer",
    },

    "& > .active-filter": {
      borderBottom: "1px solid black",
    },
  },

  "& > .content": {
    display: "flex",
    flexWrap: "wrap",
    gap: "2rem",
    maxWidth: "100%",
    margin: "2rem 0",

    "& > .card": {
      width: "22.6%",
      backgroundColor: "white",
      boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      borderRadius: "1rem",
      padding: "1rem 1rem 1.5rem 1rem",
      transition: "0.2s",

      "& > .image": {
        width: "100%",
        backgroundColor: "#000000",
        borderRadius: "1rem",
      },

      "& > .text": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",

        "& > .full-name": {
          fontWeight: "bold",
          fontSize: "1.2rem",
          padding: "1rem 0 0 0",
        },

        "& > .status": {
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "gray",
          fontSize: "0.9rem",

          "& > .dot": {
            color: "green",
            backgroundColor: "green",
            borderRadius: "5rem",
            width: "0.5rem",
            height: "0.5rem",
          },
        },
      },

      "&:hover": {
        boxShadow: "0px 10px 20px 5px rgba(52, 58, 57)",
        transform: "translateY(-5px)",
        cursor: "pointer",
      },
    },
  },

  "@media (max-width: 1200px)": {
    "& > .input-box": {
      width: "100%",
      maxWidth: "34.125rem",
      position: "relative",

      "& > .search-input": {
        width: "100%",
        maxWidth: "34.125rem",
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

    "& > .content": {
      "& > .card": {
        textAlign: "center",
        width: "33%",

        "& > .text": {
          "& > .status": {
            fontSize: "0.8rem",
            gap: "0",

            "& > .dot": {
              margin: "0 0 0 1rem",
            },
          },
        },
      },
    },
  },

  "@media (max-width: 900px)": {
    margin: "1rem 2rem 0 20rem",

    "& > .input-box": {
      width: "100%",
      maxWidth: "23.125rem",
      position: "relative",

      "& > .search-input": {
        width: "100%",
        maxWidth: "21.125rem",
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

    "& > .content": {
      "& > .card": {
        width: "32%",
      },
    },
  },

  "@media (max-width: 725px)": {
    "& > .input-box": {
      width: "100%",
      maxWidth: "19.125rem",
      position: "relative",

      "& > .search-input": {
        width: "100%",
        maxWidth: "20.125rem",
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

    "& > .content": {
      "& > .card": {
        width: "42%",
      },
    },
  },

  "@media (max-width: 600px)": {
    margin: "1rem 2rem 0 14rem",

    "& > .input-box": {
      width: "100%",
      maxWidth: "23.125rem",
      position: "relative",

      "& > .search-input": {
        width: "100%",
        maxWidth: "19.125rem",
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

    "& > .content": {
      "& > .card": {
        width: "89%",
      },
    },
  },

  "@media (max-width: 375px)": {
    margin: "1rem 2rem 0 0",

    "& > .content": {
      gap: "1rem",

      "& > .card": {
        width: "45%",
        textAlign: "center",

        "& > .text": {
          "& > .status": {
            fontSize: "0.6rem",
            gap: "0",

            "& > .dot": {
              margin: "0 0 0 0.4rem",
            },
          },
        },
      },
    },
  },
}));
