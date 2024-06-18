import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Typography, styled } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "../UI/Modal";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { get, getDatabase, push, ref, set } from "firebase/database";
import { GoogleIcon } from "../../assets/icons";
import { ROLES, ROUTES } from "../../routes/routes";
import { login } from "../../store/slice/authSlice";
import { app, auth, provider } from "../../configs/firebase";
import { SignUpValidate } from "../../utils/helpers/validate";
import { showToast } from "../../utils/helpers/toast";
import SignIn from "./SignIn";

const SignUp = ({ isOpenModal, onClose }) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [users, setUsers] = useState();
  const [isOpenSignInModal, setIsOpenSignInModal] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(SignUpValidate),
  });

  useEffect(() => {
    if (isOpenModal === false) {
      return reset();
    }
  }, [isOpenModal, reset]);

  useEffect(() => {
    const getUsersData = async () => {
      const db = getDatabase(app);

      const dbRef = ref(db, "studentSpace/users");

      await get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const myData = snapshot.val();

            const temporaryArray = Object.keys(myData).map((myFireId) => {
              return { ...myData[myFireId], userId: myFireId };
            });

            setUsers(temporaryArray);
          }
        })
        .catch((error) => {
          console.error("Error getting news data:", error);
        });
    };

    getUsersData();
  }, []);

  const onSubmit = (data) => {
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(({ user }) => {
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            token: user.accessToken,
            isAuth: true,
            role: ROLES.USER,
          })
        );

        const usersData = {
          email: user.email,
          fullName: `${data.firstName} ${data.lastName}`,
          photoUrl:
            "https://www.imagensempng.com.br/wp-content/uploads/2021/08/Icone-usuario-Png.png",
          status: "Student",
          followers: 0,
          uid: user.uid,
          state: "offline",
          isMessage: false,
        };

        const db = getDatabase(app);

        const newDoc = push(ref(db, "studentSpace/users"));

        set(newDoc, usersData)
          .then(() => {})
          .catch(() => {});

        showToast({
          title: "Sigh Up",
          message: "Successfully logged in",
          type: "success",
        });
      })
      .catch(() => {
        showToast({
          title: "Sign Up",
          message: "This account has already been used:(",
          type: "error",
        });
      });

    reset();
    onClose();

    navigate(ROUTES.USER.INDEX);
  };

  const signInWithGoogleHandler = async () => {
    await signInWithPopup(auth, provider)
      .then(({ user }) => {
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            token: user.accessToken,
            isAuth: true,
            role: ROLES.USER,
          })
        );

        const userExists = users?.some(
          (existingUser) => existingUser.email === user.email
        );

        if (!userExists || users === undefined) {
          const usersData = {
            email: user.email,
            fullName: user.displayName,
            photoUrl: user.photoURL,
            status: "Student",
            followers: 0,
            uid: user.uid,
            state: "offline",
            isMessage: false,
          };

          const db = getDatabase(app);

          const newDoc = push(ref(db, "studentSpace/users"));

          set(newDoc, usersData)
            .then(() => {})
            .catch(() => {});
        }

        onClose();

        showToast({
          title: "Sigh Up",
          message: "Successfully logged in",
          type: "success",
        });
      })
      .catch((error) => {
        console.log(error);

        showToast({
          title: "Sigh Up",
          message: "Something went wrong",
          type: "error",
        });
      });
  };

  const handleChangeVisibility = () => setVisiblePassword((prev) => !prev);

  const handleToggleSignInModal = () => setIsOpenSignInModal((prev) => !prev);

  return (
    <StyledModal open={isOpenModal} onClose={onClose}>
      <Box className="box">
        <h3 className="heading">Craete an Account</h3>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <Box className="input-container">
            <TextField
              type="text"
              variant="outlined"
              label="First Name"
              autoComplete="off"
              error={!!errors.firstName}
              placeholder="First name"
              {...register("firstName")}
            />

            <Typography className="validation">
              {errors.firstName ? `${errors.firstName.message}` : ""}
            </Typography>
          </Box>

          <Box className="input-container">
            <TextField
              type="text"
              variant="outlined"
              label="Last Name"
              autoComplete="off"
              placeholder="Last name"
              error={!!errors.lastName}
              {...register("lastName")}
            />

            <Typography className="validation">
              {errors.lastName ? `${errors.lastName.message}` : ""}
            </Typography>
          </Box>

          <Box className="input-container">
            <TextField
              type="email"
              variant="outlined"
              autoComplete="off"
              label="Email"
              error={!!errors.email}
              placeholder="Email"
              {...register("email")}
            />

            <Typography className="validation">
              {errors.email ? `${errors.email.message}` : ""}
            </Typography>
          </Box>

          <Box className="input-container">
            <TextField
              type={visiblePassword ? "text" : "password"}
              placeholder="Password"
              label="Password"
              variant="outlined"
              autoComplete="off"
              error={!!errors.password}
              {...register("password")}
            />

            {visiblePassword ? (
              <VisibilityIcon onClick={handleChangeVisibility} />
            ) : (
              <VisibilityOffIcon onClick={handleChangeVisibility} />
            )}

            <Typography className="validation">
              {errors.password ? `${errors.password.message}` : ""}
            </Typography>
          </Box>

          <Button type="submit" className="sign-in-btn">
            Sign Up
          </Button>
        </form>
        <Button
          onClick={signInWithGoogleHandler}
          type="submit"
          className="sign-up-btn"
        >
          <GoogleIcon className="google-icon" />
          Sign up with google
        </Button>

        <Typography className="warm-text">
          ALREADY HAVE AN ACCOUNT?
          <span className="register-text" onClick={handleToggleSignInModal}>
            LOG IN
          </span>
        </Typography>

        <SignIn
          isOpenModal={isOpenSignInModal}
          onClose={handleToggleSignInModal}
        />
      </Box>
    </StyledModal>
  );
};

export default SignUp;

const StyledModal = styled(Modal)(() => ({
  "& > .content": {
    width: "32rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    "& > .box": {
      width: "100%",
      flexDirection: "column",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      "& > .heading": {
        textAlign: "center",
        color: "rgb(76, 72, 89)",
        fontSize: "2rem",
        fontWeight: " 500",
        marginTop: "10%",
        marginBottom: "5%",
      },

      "& > .form": {
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
        alignItems: "center",

        "& > .input-container": {
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: "0.3rem",
          marginTop: "5%",
          width: "100%",
          height: "4rem",
          position: "relative",

          "& > .MuiFormControl-root.MuiTextField-root  ": {
            width: "25.875rem",

            "& > .MuiFormLabel-root.MuiInputLabel-root": {
              lineHeight: "1.3rem",
            },

            "& > .MuiFormLabel-root.MuiInputLabel-root.Mui-focused": {
              color: "black",
              transform: "translate(14px, -4px) scale(0.75)",
            },

            "& > .MuiFormLabel-root.MuiInputLabel-root.Mui-error": {
              color: "red",
            },

            "& > .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "black",
                borderWidth: "1px",
              },

            "& > .MuiInputBase-root.MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "red",
                borderWidth: "1px",
              },

            "& > div > .MuiInputBase-input.MuiOutlinedInput-input": {
              padding: "1rem 0.8rem",
            },

            "& > .MuiOutlinedInput-root fieldset": {
              width: "25.875rem",
              borderRadius: "1rem",
              border: `1px solid gray`,
            },
          },

          "& > .MuiSvgIcon-root": {
            position: "absolute",
            top: "1rem",
            right: "1rem",
            cursor: "pointer",

            "& > path": {
              fill: "gray",
            },
          },

          "& > .validation": {
            color: "red",
            fontSize: "0.8rem",
          },
        },

        "& > .sign-in-btn": {
          width: "25.875rem",
          backgroundColor: "rgb(7, 27, 38)",
          color: "white",
          padding: "0.625rem 1rem",
          borderRadius: "1rem",
          marginTop: "5%",
          border: "1px solid black",
          transition: "all 0.3s ease",
        },
      },

      "& > .sign-up-btn": {
        width: "15rem",
        backgroundColor: "white",
        color: "rgb(117, 117, 117)",
        border: "1px solid rgb(189, 189, 189)",
        boxShadow:
          " rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
        padding: "0.625rem 1rem",
        borderRadius: "0.3rem",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: "5%",
      },

      "& > .warm-text": {
        fontSize: "1rem",
        fontWeight: "500",
        lineHeight: " 1.25rem",
        letterSpacing: "2%",
        color: "rgb(117, 117, 117)",
        marginTop: "5%",
        marginBottom: "4%",
        textAlign: "center",

        "& > .register-text": {
          color: "rgb(66, 76, 85)",
          cursor: "pointer",
        },
      },
    },

    "@media (max-width: 1200px)": {
      width: "30rem",

      "& > div > .heading": {
        fontSize: "1.7rem !important",
      },

      "& > div > form > .input-container": {
        height: "3.3rem !important",

        "& > .MuiFormControl-root.MuiTextField-root  ": {
          width: "21.875rem !important",
          height: "3rem",

          "& > .MuiFormLabel-root.MuiInputLabel-root": {
            lineHeight: "0.8rem !important",
          },

          "& > div > .MuiInputBase-input.MuiOutlinedInput-input": {
            padding: "0.7rem 0.8rem !important",
          },

          "& > .MuiOutlinedInput-root fieldset": {
            width: "21.875rem !important",
            height: "3rem",
          },
        },

        "& > .MuiSvgIcon-root": {
          position: "absolute",
          top: "0.7rem !important",
          right: "1rem",
          cursor: "pointer",

          "& > path": {
            fill: "gray",
          },
        },

        "& > .validation": {
          fontSize: "0.7rem !important",
        },
      },

      "& > div > form > .sign-in-btn": {
        width: "21.875rem !important",
      },

      "& > div > .sign-up-btn": {
        width: "15rem !important",
        fontSize: "0.7rem",
      },

      "& > div > .warm-text": {
        fontSize: "0.95rem !important",
      },
    },

    "@media (max-width: 910px)": {
      width: "25rem",

      "& > div > form > .input-container": {
        height: "3.2rem !important",

        "& > .MuiFormControl-root.MuiTextField-root  ": {
          width: "19.875rem !important",
          height: "3rem !important",

          "& > .MuiFormLabel-root.MuiInputLabel-root": {
            fontSize: "0.9rem",
            lineHeight: "0.9rem !important",
          },

          "& > div > .MuiInputBase-input.MuiOutlinedInput-input": {
            padding: "0.7rem 0.7rem !important",
            fontSize: "0.9rem",
          },

          "& > .MuiOutlinedInput-root fieldset": {
            width: "19.875rem !important",
            height: "3rem",
            borderRadius: "0.9rem !important",
          },
        },

        "& > .MuiSvgIcon-root": {
          top: "0.8rem !important",
          fontSize: "1.2rem",
        },

        "& > .validation": {
          fontSize: "0.6rem !important",
        },
      },

      "& > div > form > .sign-in-btn": {
        width: "19.875rem !important",
        fontSize: "0.7rem",
        borderRadius: "0.9rem !important",
      },

      "& > div > .sign-up-btn": {
        width: "12rem !important",
        fontSize: "0.6rem",
      },

      "& > div > .warm-text": {
        fontSize: "0.8rem !important",
      },
    },

    "@media (max-width: 610px)": {
      width: "22rem !important",

      "& > div > .heading": {
        fontSize: "1.4rem !important",
      },

      "& > div > form > .input-container": {
        "& > .MuiFormControl-root.MuiTextField-root  ": {
          width: "16.875rem !important",
          height: "2.8rem !important",

          "& > .MuiFormLabel-root.MuiInputLabel-root": {
            fontSize: "0.7rem",
            lineHeight: "0.7rem !important",
          },

          "& > div > .MuiInputBase-input.MuiOutlinedInput-input": {
            padding: "0.7rem 0.7rem !important",
            fontSize: "0.7rem",
          },

          "& > .MuiOutlinedInput-root fieldset": {
            width: "16.875rem !important",
            height: "2.8rem",
            borderRadius: "0.7rem !important",
          },
        },

        "& > .MuiSvgIcon-root": {
          top: "0.7rem !important",
          fontSize: "1.1rem",
        },

        "& > .validation": {
          fontSize: "0.55rem !important",
        },
      },

      "& > div > form > .sign-in-btn": {
        width: "16.875rem !important",
        fontSize: "0.6rem",
        borderRadius: "0.7rem !important",
      },

      "& > div > .sign-up-btn": {
        width: "9rem !important",
        fontSize: "0.4rem",
        padding: "0.525rem 1rem !important",

        "& > .google-icon": {
          width: "0.9rem",
          height: "0.9rem",
        },
      },

      "& > div > .warm-text": {
        fontSize: "0.7rem !important",
      },
    },

    "@media (max-width: 375px)": {
      width: "18rem !important",

      "& > div > .heading": {
        fontSize: "1rem !important",
      },

      "& > div > form > .input-container": {
        height: "2.9rem !important",

        "& > .MuiFormControl-root.MuiTextField-root  ": {
          width: "16.875rem !important",
          height: "2.5rem !important",

          "& > div > .MuiInputBase-input.MuiOutlinedInput-input": {
            padding: "0.7rem 0.6rem !important",
            fontSize: "0.6rem",
          },

          "& > .MuiOutlinedInput-root fieldset": {
            width: "16.875rem !important",
            height: "2.5rem",
            borderRadius: "0.5rem !important",
          },
        },

        "& > .MuiSvgIcon-root": {
          top: "0.7rem !important",
          fontSize: "0.9rem",
        },

        "& > .validation": {
          fontSize: "0.5rem !important",
        },
      },

      "& > div > form > .sign-in-btn": {
        width: "16.875rem !important",
        fontSize: "0.5rem",
        padding: "0.425rem 1rem !important",
        borderRadius: "0.5rem !important",
      },

      "& > div > .sign-up-btn": {
        width: "7.5rem !important",
        fontSize: "0.35rem",

        "& > .google-icon": {
          width: "0.7rem",
          height: "0.7rem",
        },
      },

      "& > div > .warm-text": {
        fontSize: "0.65rem !important",
      },
    },
  },
}));
