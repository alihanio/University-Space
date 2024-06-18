import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, Button, Typography, styled } from "@mui/material";
import { logout } from "../../store/slice/authSlice";
import { ADMIN_NAVIGATIONS, USER_NAVIGATIONS } from "../../utils/constants";
import { ROUTES } from "../../routes/routes";
import { useEffect, useState } from "react";
import { get, getDatabase, ref } from "firebase/database";
import { app } from "../../configs/firebase";

const SideBar = () => {
  const { role, email } = useSelector((state) => state.auth);
  const [users, setUsers] = useState(null);

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

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const logOutHandler = () => dispatch(logout({ navigate }));

  return (
    <StyledContainer>
      <Box>
        <Box className="first-block">
          {role === "ADMIN" ? (
            <Typography variant="h1" className="user-image">
              A
            </Typography>
          ) : (
            <img className="user-image" src={users?.photoUrl} alt="user" />
          )}

          <Box className="info-container">
            {role === "ADMIN" ? (
              <>
                <Typography className="name">Admin</Typography>

                <Typography className="info" variant="span">
                  Student Space
                </Typography>
              </>
            ) : (
              <NavLink to={`${ROUTES.USER.INDEX}/${ROUTES.USER.PROFILE}`}>
                <Typography className="name">{users?.fullName}</Typography>

                <Typography className="info" variant="span">
                  {`${users?.status} ${users?.university ? "at" : ""} ${
                    users?.university ? users?.university : ""
                  }`}
                </Typography>
              </NavLink>
            )}
          </Box>
        </Box>

        <hr />

        <Box className="navigations">
          {role === "ADMIN"
            ? ADMIN_NAVIGATIONS?.map(({ text, to }) => (
                <NavLink key={text} className="link" to={to}>
                  {text}
                </NavLink>
              ))
            : USER_NAVIGATIONS?.map(({ text, to }) => (
                <NavLink key={text} className="link" to={to}>
                  {text}
                </NavLink>
              ))}
        </Box>

        <StyledButton onClick={logOutHandler}>Log out</StyledButton>
      </Box>
    </StyledContainer>
  );
};

export default SideBar;

const StyledContainer = styled(Box)(() => ({
  width: "21.875rem",
  height: "100%",
  padding: "3.125rem 0 0 2.25rem ",
  color: "white ",
  fontFamily: "Amiko",
  backgroundColor: "black",
  position: "fixed",
  zIndex: 100,
  left: "0",

  "& > div": {
    display: "flex",
    flexDirection: "column",
    gap: "0.625rem",

    "& .navigations": {
      "& > .link": {
        color: "white",
        fontSize: "1.125rem",
        fontWeight: "400",
        lineHeight: "1.375rem",
        textDecoration: "none",
        cursor: "pointer",
      },

      "& > .link.active": {
        textDecoration: "underline",
      },
    },

    "& .first-block": {
      display: "flex",
      alignItems: "end",
      fontSize: "1.25rem",
      fontWeight: "400",
      lineHeight: "1.688rem",
      textDecoration: "none",

      "& > .user-image": {
        width: "5.125rem",
        height: "5.125rem",
        maxWidth: "6.25rem",
        maxHeight: "6.25rem",
        borderRadius: "0.563rem",

        "@media (max-width: 600px)": {
          width: "3.875rem",
          height: "3.875rem",
        },
      },

      "& > .info-container": {
        marginLeft: "0.625rem ",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",

        "& > a": {
          textDecoration: "none",

          "& > .name": {
            fontSize: "1.188rem",
            fontWeight: "400",
            lineHeight: "1.625rem",
            color: "white",
          },

          "& > .info": {
            color: "rgb(169, 167, 177)",
            fontSize: "0.875rem",
            fontWeight: "400",
            lineHeight: "1.1889rem",
          },
        },
      },
    },

    "& > .navigations": {
      marginTop: "3.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.938rem",

      "& > p": {
        fontSize: "1.25rem",
        fontWeight: "400",
        lineHeight: "1.688rem",
        textAlign: "left",
      },
    },
  },

  "@media (max-width: 900px)": {
    width: "18.75rem",
    padding: "2.5rem 0 0 1.25rem ",

    "& > div": {
      display: "flex",
      flexDirection: "column",
      gap: "0.625rem ",

      "& .first-block": {
        display: "flex",
        alignItems: "end",

        "& > .info-container": {
          marginLeft: "0.625rem ",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          lineHeight: "0.938rem",

          "& > .name": {
            fontSize: "0.938rem",
            fontWeight: "500",
          },

          "& > .info": {
            color: "rgb(169, 167, 177)",
            fontSize: "0.75rem",
            fontWeight: "400",
            lineHeight: "0.938rem",
          },
        },
      },

      "& > .navigations": {
        marginTop: "1.375rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.625rem ",

        "& > p": {
          fontSize: "1.25rem",
          fontWeight: "500",
          lineHeight: "1.688rem",
          textAlign: "left",
        },
      },
    },
  },

  "@media (max-width: 600px)": {
    width: "12.5rem",
    padding: "1.875rem 0 0 1.25rem ",

    "& > div": {
      gap: "0.313rem",

      "& .first-block": {
        display: "flex",
        flexDirection: "column",
        alignItems: "start",

        "& > .info-container": {
          marginLeft: "0.313rem",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",

          "& > .name": {
            fontSize: "1rem",
            fontWeight: "500",
          },

          "& > .info": {
            color: "rgb(169, 167, 177)",
            fontSize: "0.75rem",
            fontWeight: "400",
            lineHeight: "0.938rem",
          },
        },
      },

      "& > .navigations": {
        marginTop: "1.375rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.625rem ",

        "& > p": {
          fontSize: "1.125rem",
          fontWeight: "500",
          lineHeight: "1.25rem",
          textAlign: "left",
        },
      },
    },
  },
}));

const StyledButton = styled(Button)(() => ({
  "&.MuiButton-root": {
    marginTop: "2.813rem",
    borderRadius: "0.5rem",
    border: "0.063rem solid white",
    width: "7.3rem",
    backgroundColor: "transparent",
    color: "white",
    textTransform: "none",
    fontFamily: "Arimo",
    fontSize: "1.25rem",
    fontWeight: "400",
    lineHeight: "1.375rem",

    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },

    "@media (max-width: 900px)": {
      marginTop: "2.813rem",
      width: "7rem",
      fontSize: "1.2rem",
    },

    "@media (max-width: 600px)": {
      marginTop: "5.313rem",
    },
  },
}));
