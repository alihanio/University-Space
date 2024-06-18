import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, styled } from "@mui/material";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { getDatabase, ref, push, set, get, onValue } from "firebase/database";
import Modal from "../../UI/Modal";
import { CloseIcon, FileIcon, SendIcon } from "../../../assets/icons";
import { app } from "../../../configs/firebase";
import { showToast } from "../../../utils/helpers/toast";

const Chat = () => {
  const [openImageInChat, setOpenImageInChat] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [openImage, setOpenImage] = useState(false);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [myData, setMyData] = useState(null);
  const [image, setImage] = useState("");

  const imageRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { id } = useParams();

  const { id: userId, email } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleCloseImage = () => setOpenImage(false);

  const handleOpenImage = () => setOpenImage((prev) => !prev);

  const handleCloseImageInChat = () => {
    setSelectedImage(null);
    setOpenImageInChat(false);
  };

  const handleOpenImageInChat = (imageSrc) => {
    setSelectedImage(imageSrc);
    setOpenImageInChat(true);
  };

  const chatId =
    userId > userData?.uid ? userData?.uid + userId : userId + userData?.uid;

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();

      const dbRef = ref(db, "studentSpace/users/" + id);

      await get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const targetObject = snapshot.val();

            setUserData(targetObject);
          }
        })

        .catch((error) => {
          console.error("Error getting user data:", error);
        });
    };
    fetchData();
  }, [id]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
                myId: myFireId,
              }))

              .filter((user) => user.email === email);
            setMyData(temporaryArray[0]);
          }
        })
        .catch((error) => {
          console.error("Error getting user data:", error);
        });
    };
    getUsersData();
  }, [email]);

  useEffect(() => {
    const handleChangeState = () => {
      const data = {
        ...userData,
        isMessage: false,
      };

      const db = getDatabase(app);

      const newDoc = ref(db, "studentSpace/users/" + id);

      set(newDoc, data)
        .then(() => {})
        .catch(() => {});
    };

    if (userData?.isMessage === true) {
      handleChangeState();
    }
  }, [id, userData]);

  useEffect(() => {
    const listenForMessages = () => {
      if (chatId) {
        const db = getDatabase(app);

        const chatRef = ref(db, `studentSpace/chats/${chatId}/messages`);

        onValue(
          chatRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const messagesData = snapshot.val();

              const temporaryArray = Object.keys(messagesData).map(
                (myFireId) => {
                  return { ...messagesData[myFireId], id: myFireId };
                }
              );

              setMessages(temporaryArray);
            } else {
              setMessages([]);
            }
          },
          {
            cancelOnDisconnect: true,
          }
        );
      }
    };

    listenForMessages();
  }, [chatId]);

  const getMassages = () => {
    if (chatId) {
      const db = getDatabase(app);

      const chatRef = ref(db, `studentSpace/chats/${chatId}/messages`);

      get(chatRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const messagesData = snapshot.val();

            const messagesArray = Object.values(messagesData);

            setMessages(messagesArray);
          } else {
            setMessages([]);
          }
        })
        .catch((error) => {
          console.error("Error getting messages:", error);
        });
    }
  };

  useEffect(() => {
    getMassages();
  }, [chatId]);

  const handleGoBack = () => navigate(-1);

  const handleChangeMessage = (e) => setNewMessage(e.target.value);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    const db = getDatabase(app);

    const chatRef = ref(db, `studentSpace/chats/${chatId}/messages`);

    const messageRef = push(chatRef);

    const newMessageData = {
      userId: userId,
      text: newMessage,
      timestamp: new Date().toISOString(),
      image,
    };

    try {
      await set(messageRef, newMessageData);

      getMassages();

      showToast({
        title: "Send Message",
        message: "Message sent successfully!",
        type: "success",
      });

      setNewMessage("");
      setImage(null);

      const data = {
        ...myData,
        isMessage: true,
      };

      const db = getDatabase(app);

      const newDoc = ref(db, "studentSpace/users/" + myData.myId);

      set(newDoc, data)
        .then(() => {})
        .catch(() => {});
    } catch (error) {
      console.error("Error sending message:", error);

      showToast({
        title: "Send Message",
        message: "Failed to send message.",
        type: "error",
      });
    }
  };
  const formatTimestamp = (timestamp) => {
    const messageDate = new Date(timestamp);

    const formatTime = (date) => {
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    const formatDate = (date) => {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
      });
    };

    const isYesterday = (date) => {
      const yesterday = new Date();

      yesterday.setDate(yesterday.getDate() - 1);

      return (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
      );
    };

    const isBeforeYesterday = (date) => {
      const beforeYesterday = new Date();

      beforeYesterday.setDate(beforeYesterday.getDate() - 2);

      return date < beforeYesterday;
    };

    if (isYesterday(messageDate)) {
      return "Yesterday at " + formatTime(messageDate);
    } else if (isBeforeYesterday(messageDate)) {
      return formatDate(messageDate) + " at " + formatTime(messageDate);
    } else {
      return formatTime(messageDate);
    }
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

  const handleFile = () => {
    if (image) {
      setImage(null);
    } else {
      imageRef.current.click();
    }
  };

  const handleDeleteImage = () => setImage(null);

  return (
    <StyledContainer>
      <Typography variant="h1" onClick={handleGoBack} className="title">
        <KeyboardBackspaceOutlinedIcon />
      </Typography>

      <Box className="content">
        <Box className="user-box">
          <img className="user-img" src={userData?.photoUrl} alt="user-img" />
          <Typography className="user-name">{userData?.fullName}</Typography>
        </Box>

        <Box className="chat">
          <Box className="messages-container">
            {messages.map((message) => (
              <>
                {message.image ? (
                  <div
                    key={message?.id}
                    className="message-with-photo"
                    style={
                      message.userId === userId
                        ? {
                            position: "relative",
                            background: "#f3f3f3",
                            color: "black",
                          }
                        : {}
                    }
                  >
                    <img
                      src={message.image}
                      className="photo"
                      alt="img"
                      onClick={() => handleOpenImageInChat(message.image)}
                    />

                    <StyledModal
                      open={openImageInChat}
                      onClose={handleCloseImageInChat}
                    >
                      <img src={selectedImage} alt="img" className="image" />
                    </StyledModal>

                    {message.text !== "" && (
                      <Typography className="text">{message?.text}</Typography>
                    )}

                    <Box className="hour-box">
                      <Typography className="hour">
                        {formatTimestamp(message?.timestamp)}
                      </Typography>
                    </Box>
                  </div>
                ) : (
                  <div
                    key={message?.id}
                    className="message"
                    style={
                      message.userId === userId
                        ? {
                            position: "relative",
                            background: "#f3f3f3",
                            color: "black",
                          }
                        : {}
                    }
                  >
                    {message.text !== "" && (
                      <Typography className="text">{message?.text}</Typography>
                    )}

                    <img src={message.image} className="no-photo" alt="img" />

                    <Box className="hour-box">
                      <Typography className="hour">
                        {formatTimestamp(message?.timestamp)}
                      </Typography>
                    </Box>
                  </div>
                )}
              </>
            ))}
            <div ref={messagesEndRef}></div>
          </Box>
        </Box>

        <Box className="input-container">
          {image ? (
            <Box className="image-box">
              <img
                src={image}
                alt="Selected"
                className="image"
                onClick={handleOpenImage}
              />
              <CloseIcon className="close" onClick={handleDeleteImage} />
            </Box>
          ) : (
            <FileIcon className="file-icon" onClick={handleFile} />
          )}

          <StyledModal open={openImage} onClose={handleCloseImage}>
            <img src={image} alt="Selected" className="image" />
          </StyledModal>

          <input
            ref={imageRef}
            id="photo"
            type="file"
            accept=".jpg, .png"
            style={{ display: "none" }}
            onChange={handleFileChange}
            max="1"
          />

          <input
            value={newMessage}
            onChange={handleChangeMessage}
            className="input"
            placeholder="Type on message here ..."
          />

          <SendIcon
            onClick={handleSendMessage}
            className="send-icon"
            style={{
              cursor: newMessage || image ? "pointer" : "not-allowed",
              opacity: newMessage || image ? 1 : 0.5,
              pointerEvents: newMessage || image ? "auto" : "none",
            }}
          />
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default Chat;

const StyledContainer = styled(Box)(() => ({
  margin: "1.3rem 2rem 0 25rem",
  width: "1400px",

  "& > .title": {
    fontFamily: "Prosto One",
    fontSize: "25px",
    cursor: "pointer",
  },

  "& > .content": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "15px",

    "@media (max-width: 375px)": {
      alignItems: "flex-start",
    },

    "& > .user-box": {
      display: "flex",
      maxWidth: "50.125rem",
      width: "80%",
      padding: "0.5rem 1rem",
      alignItems: "center",
      cursor: "pointer",
      boxShadow: "rgba(0, 0, 0, 0.15) 0px 5px 15px 0px",
      borderRadius: "1rem",
      backgroundColor: "rgba(115, 100, 100, 0.09)",

      "@media (max-width: 375px)": {
        width: "100%",
      },

      "& > .user-img": {
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
        marginRight: "1rem",
        cursor: "pointer",
      },

      "& > .user-name": {
        fontFamily: "Poppins",
        fontSize: "21px",
        fontWeight: "500",
      },
    },

    "& > .chat": {
      minHeight: "30rem",
      maxHeight: "30rem",
      flex: "1",
      display: "flex",
      width: "80%",
      maxWidth: "50.125rem",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      overflowY: "auto",

      "@media (max-width: 375px)": {
        width: "100%",
      },

      "& > .messages-container::-webkit-scrollbar": {
        width: "6px",
      },

      "& > .messages-container::-webkit-scrollbar-track": {
        background: "#f1f1f1",
      },

      "& > .messages-container::-webkit-scrollbar-thumb ": {
        background: " #888",
        borderRadius: "5px",
      },

      "& > .messages-container::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },

      "& > .messages-container": {
        maxHeight: "30rem",
        overflowY: "auto",
        width: "100%",

        "& > .message": {
          color: "white",
          margin: "1rem 0",
          minHeight: "47px",
          maxWidth: "360px",
          width: "fit-content",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "flex-end",
          flexDirection: "column",
          padding: "0.1rem 1rem 0.3rem",
          background: "black",
          borderRadius: "1.125rem 1.125rem 1.125rem 0",

          "& .no-photo": {
            width: "0",
            height: "0",
          },

          "& > .hour-box": {
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",

            "& > .hour": {
              fontFamily: "Poppins",
              fontSize: "9px",
              minWidth: "20px",
            },
          },

          "& > .text": {
            fontFamily: "Poppins",
            maxWidth: "340px",
            wordBreak: "break-all",
          },
        },

        "& > .message-with-photo": {
          color: "white",
          margin: "1rem 0",
          maxWidth: "360px",
          width: "fit-content",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          padding: " 0.5rem 1rem 0.1rem",
          background: "black",
          borderRadius: "1.125rem 1.125rem 1.125rem 0",

          "& > .text": {
            wordBreak: "break-all",
            fontFamily: "Poppins",
            maxWidth: "340px",
          },

          "& > .photo": {
            maxWidth: "10rem",
            maxHeight: "10rem",
            marginTop: "1rem",
          },

          "& > .hour-box": {
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",

            "& > .hour": {
              fontFamily: "Poppins",
              fontSize: "9px",
              minWidth: "20px",
            },
          },
        },
      },
    },

    "& > .input-container": {
      width: "80%",
      height: "70px",
      maxWidth: "50.125rem",
      display: "flex",
      alignItems: "center",
      borderRadius: "13px",
      padding: "0 15px",
      backgroundColor: "rgba(115, 100, 100, 0.09)",
      boxShadow: "0 10px 10px 3px rgba(115, 100, 100, 0.09)",

      "& > .image-box": {
        position: "relative",

        "& > .image": {
          width: "3rem",
          height: "3rem",
        },

        "& > .close": {
          position: "absolute",
          right: "0.3rem",
          top: "0.3rem",
          cursor: "pointer",
          width: "0.5rem",
          height: "0.5rem",
          display: "none",
        },

        "&:hover > .close": {
          display: "block",
        },
      },

      "@media (max-width: 375px)": {
        width: "100%",
      },

      "& > .file-icon": {
        cursor: "pointer",
      },

      "& > .input": {
        height: "100%",
        width: "100%",
        border: "none",
        fontFamily: "Poppins",
        fontSize: "21px",
        backgroundColor: "transparent",
        marginLeft: "20px",

        "&:focus": { outline: "none" },

        "&::placeholder": {
          fontSize: "100%",

          "@media (max-width: 825px)": {
            fontSize: "80%",
          },

          "@media (max-width: 750px)": {
            fontSize: "70%",
          },

          "@media (max-width: 700px)": {
            fontSize: "60%",
          },
        },
      },

      "& > .send-icon": { cursor: "pointer" },
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

const StyledModal = styled(Modal)(() => ({
  "& > .content": {
    padding: "0px",
    maxWidth: "90%",
    maxHeight: "80vh",

    "& > img": {
      maxWidth: "100%",
      maxHeight: "80vh",
    },

    "& > .close-icon": {
      top: "-2rem",
      right: "-2rem",
    },
  },
}));
