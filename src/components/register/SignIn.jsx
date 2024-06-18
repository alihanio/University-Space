import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Box, Button, TextField, Typography, styled } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { get, getDatabase, push, ref, set } from "firebase/database";
import Modal from "../UI/Modal";
import { GoogleIcon } from "../../assets/icons";
import { ROLES, ROUTES } from "../../routes/routes";
import { login } from "../../store/slice/authSlice";
import { app, auth, provider } from "../../configs/firebase";
import { showToast } from "../../utils/helpers/toast";
import { schema } from "../../utils/helpers/validate";
import SignUp from "./SignUp";

const SignIn = ({ isOpenModal, onClose }) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [isOpenSignUpModal, setIsOpenSignUpModal] = useState(false);
  const [users, setUsers] = useState();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isOpenModal === false) {
      return reset();
    }
  }, [isOpenModal, reset]);

  useEffect(() => {
    const getNewsData = async () => {
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

    getNewsData();
  }, []);

  const onSubmit = (data) => {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, data.email, data.password)
      .then(({ user }) => {
        if (user.email === "admin@gmail.com") {
          dispatch(
            login({
              email: user.email,
              id: user.uid,
              token: user.accessToken,
              isAuth: true,
              role: ROLES.ADMIN,
            })
          );
          showToast({
            title: "Sigh In",
            message: "Welcome Admin:)",
            type: "success",
          });
        } else {
          dispatch(
            login({
              email: user.email,
              id: user.uid,
              token: user.accessToken,
              isAuth: true,
              role: ROLES.USER,
            })
          );
          showToast({
            title: "Sigh In",
            message: "Successfully logged in",
            type: "success",
          });
        }

        reset();
        onClose();

        if (user.email === "admin@gmail.com") {
          return navigate(ROUTES.ADMIN.INDEX);
        } else {
          return navigate(ROUTES.USER.INDEX);
        }
      })
      .catch(() => {
        showToast({
          title: "Sigh In",
          message: "Something went wrong",
          type: "error",
        });
      });
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
      .catch(() => {
        showToast({
          title: "Sigh Up",
          message: "Something went wrong",
          type: "error",
        });
      });
  };

  const handleChangeVisibility = () => setVisiblePassword((prev) => !prev);

  const handleToggleSignUpModal = () => setIsOpenSignUpModal(true);

  return (
    <StyledModal open={isOpenModal} onClose={onClose}>
      <Box className="box">
        <h3 className="heading">Sign in </h3>

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <Box className="input-container">
            <TextField
              type="email"
              placeholder="Email"
              variant="outlined"
              label="Email"
              autoComplete="off"
              error={!!errors.email}
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
              autoComplete="off"
              label="Password"
              variant="outlined"
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
            Sign In
          </Button>
        </form>
        <Button
          onClick={signInWithGoogleHandler}
          type="submit"
          className="sign-up-btn"
        >
          <GoogleIcon className="google-icon" />
          Sign in with google
        </Button>

        <Typography className="warm-text">
          DON'T HAVE AN ACCOUNT?{" "}
          <span className="register-text" onClick={handleToggleSignUpModal}>
            REGISTER
          </span>
        </Typography>

        <SignUp
          isOpenModal={isOpenSignUpModal}
          onClose={handleToggleSignUpModal}
        />
      </Box>
    </StyledModal>
  );
};

export default SignIn;

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

          "& > .MuiInputBase-input.MuiOutlinedInput-input": {
            padding: "1rem 0.8rem",
          },

          "& > .MuiFormLabel-root.MuiInputLabel-root": {
            lineHeight: "1.3rem",
          },

          "& > .MuiFormLabel-root.MuiInputLabel-root.Mui-focused": {
            color: "black",
            transform: "translate(14px, -4px) scale(0.75)",
          },

          "& > .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "black",
              borderWidth: "1px",
            },

          "& > div > .MuiInputBase-root.MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "red",
              borderWidth: "1px",
            },

          "& > .MuiFormLabel-root.MuiInputLabel-root.Mui-error": {
            color: "red",
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
        gap: "1rem",
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
        marginBottom: "10%",

        "& > .register-text": {
          color: "rgb(66, 76, 85)",
          cursor: "pointer",
        },
      },
    },

    "& .MuiFormControl-root.MuiTextField-root  ": {
      width: "25.875rem",
      "& .MuiOutlinedInput-root fieldset": {
        width: "25.875rem",
        borderRadius: "1rem",
      },
    },

    "@media (max-width: 1200px)": {
      width: "28rem !important",

      "& > div > .heading": {
        fontSize: "1.5rem !important",
      },

      "& > div > form > .input-container": {
        height: "3.3rem",

        "& > .MuiFormControl-root.MuiTextField-root  ": {
          width: "21.875rem",
          height: "3rem",

          "& > .MuiFormLabel-root.MuiInputLabel-root": {
            lineHeight: "0.8rem",
          },

          "& > div > .MuiInputBase-input.MuiOutlinedInput-input": {
            padding: "0.7rem 0.8rem",
          },

          "& > .MuiOutlinedInput-root fieldset": {
            width: "21.875rem",
            height: "3rem",
          },
        },

        "& > .MuiSvgIcon-root": {
          position: "absolute",
          top: "0.7rem !important",
          right: "1rem !important",
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
        fontSize: "0.9rem",
      },
    },

    "@media (max-width: 910px)": {
      width: "25rem !important",

      "& > div > form > .input-container": {
        height: "3.2rem ",

        "& > .MuiFormControl-root.MuiTextField-root  ": {
          width: "19.875rem",
          height: "3rem",

          "& > .MuiFormLabel-root.MuiInputLabel-root": {
            fontSize: "0.9rem",
            lineHeight: "0.9rem",
          },

          "& > div > .MuiInputBase-input.MuiOutlinedInput-input": {
            padding: "0.7rem 0.7rem",
            fontSize: "0.9rem",
          },

          "& > .MuiOutlinedInput-root fieldset": {
            width: "19.875rem !important",
            height: "3rem",
            borderRadius: "0.9rem",
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

      "& > div > form > .input-container": {
        "& > .MuiFormControl-root.MuiTextField-root  ": {
          width: "16.875rem",
          height: "2.8rem",

          "& > .MuiFormLabel-root.MuiInputLabel-root": {
            fontSize: "0.7rem",
            lineHeight: "0.7rem",
          },

          "& > div > .MuiInputBase-input.MuiOutlinedInput-input": {
            padding: "0.7rem 0.7rem",
            fontSize: "0.7rem",
          },

          "& > .MuiOutlinedInput-root fieldset": {
            width: "16.875rem !important",
            height: "2.8rem",
            borderRadius: "0.7rem",
          },
        },

        "& > .MuiSvgIcon-root": {
          top: "0.7rem !important",
          fontSize: "1.1rem",
        },
      },

      "& > div > form > .sign-in-btn": {
        width: "16.875rem !important",
        fontSize: "0.6rem",
        borderRadius: "0.7rem !important",
      },

      "& > div > .sign-up-btn": {
        width: "9.5rem !important",
        fontSize: "0.42rem",
        padding: "0.525rem 1rem !important",
      },

      "& > div > .warm-text": {
        fontSize: "0.7rem !important",
      },
    },

    "@media (max-width: 375px)": {
      width: "18rem !important",

      "& > div > form > .input-container": {
        height: "3.5rem !important",

        "& > .MuiFormControl-root.MuiTextField-root  ": {
          width: "16.875rem !important",
          height: "2.5rem !important",

          "& > .MuiFormLabel-root.MuiInputLabel-root": {
            lineHeight: "0.5rem",
          },

          "& > div > .MuiInputBase-input.MuiOutlinedInput-input": {
            padding: "0.7rem 0.6rem",
            fontSize: "0.7rem",
          },

          "& > .MuiOutlinedInput-root fieldset": {
            width: "16.875rem !important",
            height: "2.5rem",
            borderRadius: "0.5rem",
          },
        },

        "& > .MuiSvgIcon-root": {
          top: "0.7rem !important",
          fontSize: "0.9rem",
        },
      },

      "& > div > form > .sign-in-btn": {
        width: "16.875rem !important",
        fontSize: "0.6rem",
        borderRadius: "0.5rem !important",
      },

      "& > div > .sign-up-btn": {
        "& .google-icon": {
          width: "0.7rem",
          height: "0.7rem",
        },
      },

      "& > div > .warm-text": {
        fontSize: "0.68rem !important",
      },
    },
  },
}));
