import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, styled, Typography, IconButton } from "@mui/material";
import {
  CloseIcon,
  DontLikeIcon,
  EditIcon,
  LikeIcon,
  SearchIcon,
} from "../../../assets/icons";
import QuestionsModal from "./QuestionsModal";
import Modal from "../../UI/Modal";
import SpaceModal from "./SpaceModal";
import { get, getDatabase, onValue, ref, remove, set } from "firebase/database";
import { app } from "../../../configs/firebase";

const Space = () => {
  const [openAddSpaceModal, setOpenAddSpaceModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [questionDelete, setQuestionDelete] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [isLike, setIsLike] = useState({});

  const { email } = useSelector((state) => state.auth);

  const getSpacesData = async () => {
    const db = getDatabase(app);

    const dbRef = ref(db, "studentSpace/spaces");

    await get(dbRef)
      .then((snapshot) => {
        if (snapshot?.exists()) {
          const myData = snapshot?.val();

          const temporaryArray = Object?.keys(myData)?.map((myFireId) => {
            return { ...myData[myFireId], spaceId: myFireId };
          });

          setSpaces(temporaryArray);
        }
      })
      .catch((error) => {
        console.error("Error getting news data:", error);
      });
  };

  useEffect(() => {
    getSpacesData();
  }, []);

  useEffect(() => {
    const db = getDatabase(app);

    const spacesRef = ref(db, "studentSpace/spaces");

    const unsubscribe = onValue(spacesRef, (snapshot) => {
      if (snapshot.exists()) {
        const myData = snapshot.val();
        const temporaryArray = Object.keys(myData).map((myFireId) => {
          return { ...myData[myFireId], spaceId: myFireId };
        });

        setSpaces(temporaryArray);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activeTab) {
      const db = getDatabase(app);

      const questionsRef = ref(db, `studentSpace/spaces/${activeTab}/question`);

      const unsubscribe = onValue(questionsRef, (snapshot) => {
        if (snapshot.exists()) {
          const myData = snapshot.val();

          const temporaryArray = Object.keys(myData).map((myFireId) => {
            return { ...myData[myFireId], questionId: myFireId };
          });

          setQuestions(temporaryArray);
        }
      });

      return () => unsubscribe();
    }
  }, [activeTab]);

  useEffect(() => {
    if (spaces.length > 0) {
      setActiveTab(spaces[0].spaceId);
      getQuestion(spaces[0].spaceId);
    }
  }, [spaces]);

  const getQuestion = async (id) => {
    const db = getDatabase(app);

    const dbRef = ref(db, `studentSpace/spaces/${id}/question`);

    await get(dbRef)
      .then((snapshot) => {
        if (snapshot?.exists()) {
          const myData = snapshot?.val();

          const temporaryArray = Object?.keys(myData)?.map((myFireId) => {
            return { ...myData[myFireId], questionId: myFireId };
          });

          setQuestions(temporaryArray);
        }
      })
      .catch((error) => {
        console.error("Error getting news data:", error);
      });
  };

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("questionLikes")) || {};
    setIsLike(storedLikes);
  }, []);

  useEffect(() => {
    localStorage.setItem("questionLikes", JSON.stringify(isLike));
  }, [isLike]);

  const handleActive = (id) => {
    setActiveTab(id);

    setQuestions([]);
    getQuestion(id);
  };

  const handleIsLike = async (questionId) => {
    try {
      const db = getDatabase(app);
      const dbRef = ref(
        db,
        `studentSpace/spaces/${activeTab}/question/${questionId}`
      );

      const newQuestionLikes = {
        ...isLike,
        [questionId]: !isLike[questionId],
      };

      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const questionData = snapshot.val();

        await set(dbRef, {
          ...questionData,
          questionLikes: newQuestionLikes[questionId]
            ? questionData.questionLikes + 1
            : questionData.questionLikes - 1,
        }).then(() => {
          getQuestion(activeTab);
          setIsLike(newQuestionLikes);
        });
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const handleOpenAddModal = () => setOpenAddModal((prev) => !prev);
  const handleCloseAddModal = () => setOpenAddModal(false);
  const handleCloseupdateModal = () => setOpenUpdateModal(false);

  const handleOpenDeleteModal = (spaceId) => {
    setOpenDeleteModal((prev) => !prev);
    setDeleteId(spaceId);
    setQuestionDelete(false);
  };

  const handleOpenQuestionDeleteModal = (questionId) => {
    setOpenDeleteModal((prev) => !prev);
    setDeleteId(questionId);
    setQuestionDelete(true);
  };

  const handleOpenUpdateModal = (questionId) => {
    setOpenUpdateModal(true);
    setSelectedId(questionId);
  };

  const deleteSpace = async () => {
    if (questionDelete) {
      const db = getDatabase(app);
      const dbRef = ref(
        db,
        `studentSpace/spaces/${activeTab}/question/` + deleteId
      );

      await remove(dbRef)
        .then(() => {
          setOpenDeleteModal(false);
          setQuestions([]);
          getQuestion(activeTab);
        })
        .catch(() => {});
    } else {
      const db = getDatabase(app);

      const dbRef = ref(db, "studentSpace/spaces/" + deleteId);

      await remove(dbRef)
        .then(() => {
          setOpenDeleteModal(false);
          setSpaces([]);
          setQuestions([]);
          getSpacesData();
        })
        .catch(() => {});
    }
  };

  const handleOpenAddSpaceModal = () => setOpenAddSpaceModal((prev) => !prev);
  const handleCloseAddSpaceModal = () => setOpenAddSpaceModal(false);

  const handleSearchInputChange = (event) => setSearchQuery(event.target.value);

  const filteredQuestions = questions.filter((question) =>
    question?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StyledContainer>
      <Typography>SPACE</Typography>

      <Box className="content">
        <Box className="input-box">
          <input
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <SearchIcon className="search-icon" />
        </Box>

        <SpaceModal
          isOpenModal={openAddSpaceModal}
          onClose={handleCloseAddSpaceModal}
          onGetSpacesData={getSpacesData}
        />

        <Box className="space-container">
          <Typography
            className="create-space"
            onClick={handleOpenAddSpaceModal}
          >
            + Create space
          </Typography>

          {spaces?.map(({ spaceId, title, userEmail }) => (
            <Typography
              key={spaceId}
              className={`space ${activeTab === spaceId ? "active" : ""}`}
              onClick={() => handleActive(spaceId)}
            >
              {title}{" "}
              {userEmail === email ? (
                <CloseIcon onClick={() => handleOpenDeleteModal(spaceId)} />
              ) : (
                ""
              )}
            </Typography>
          ))}
        </Box>

        <Box className="button-container">
          <Button variant="contained" onClick={handleOpenAddModal}>
            + Add question
          </Button>
        </Box>

        <QuestionsModal
          isOpenModal={openAddModal}
          onClose={handleCloseAddModal}
          activeTab={activeTab}
          onGetQuestion={getQuestion}
        />

        <QuestionsModal
          isOpenModal={openUpdateModal}
          onClose={handleCloseupdateModal}
          activeTab={activeTab}
          onGetQuestion={getQuestion}
          selectedId={selectedId}
        />

        <Box className="questions-container">
          {filteredQuestions?.map(
            ({ title, description, questionId, questionLikes, users }) => (
              <Box key={questionId} className="question-card">
                <Box className="main-status">
                  <Box className="status-container">
                    <img src={users?.photoUrl} alt="user" className="user" />

                    <Box>
                      <Typography className="user-name">
                        {users?.email === email ? "You" : users?.fullName}
                      </Typography>

                      <Typography className="status">
                        {users?.status}
                      </Typography>
                    </Box>
                  </Box>

                  {users?.email === email ? (
                    <IconButton
                      className="delete"
                      onClick={() => handleOpenQuestionDeleteModal(questionId)}
                    >
                      <CloseIcon />
                    </IconButton>
                  ) : (
                    ""
                  )}
                </Box>

                <Typography className="title">{title}</Typography>
                <Typography className="description">{description}</Typography>

                <Box className="icons-container">
                  {users?.email === email ? (
                    <IconButton className="edit">
                      <EditIcon
                        onClick={() => handleOpenUpdateModal(questionId)}
                      />
                    </IconButton>
                  ) : (
                    ""
                  )}

                  <Box
                    className="like-container"
                    onClick={() => handleIsLike(questionId)}
                  >
                    {questionLikes}
                    {isLike[questionId] ? (
                      <IconButton className="like">
                        <LikeIcon />
                      </IconButton>
                    ) : (
                      <IconButton className="dont-like">
                        <DontLikeIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Box>
            )
          )}
        </Box>

        <StyledModal open={openDeleteModal} onClose={handleOpenDeleteModal}>
          <Typography className="warm-text">
            Are you sure want to delete ?
          </Typography>

          <Box className="button-box">
            <Button className="cansel-btn" onClick={handleOpenDeleteModal}>
              Cancel
            </Button>

            <Button className="delete-btn" onClick={deleteSpace}>
              Delete
            </Button>
          </Box>
        </StyledModal>
      </Box>
    </StyledContainer>
  );
};

export default Space;

const StyledContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  margin: "1rem 3rem 0 25rem",
  width: "70%",

  "@media (max-width:900px)": {
    margin: "1rem 3rem 0 20rem",
    width: "60%",
  },

  "@media (max-width:725px)": {
    width: "50%",
  },

  "@media (max-width:600px)": {
    margin: "1rem 3rem 0 14rem",
    width: "60%",
  },

  "@media (max-width:375px)": {
    margin: "1rem 3rem 0 0",
    width: "80%",
  },

  "& > .MuiTypography-root": {
    fontSize: "2rem",
    fontWeight: "bold",
    padding: "2rem 0",
    fontFamily: "Prosto One",
  },

  "& > .content": {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",

    "& > .input-box": {
      maxWidth: "38.125rem",
      width: "100%",
      position: "relative",

      "& > .search-input": {
        maxWidth: "38.125rem",
        width: "100%",
        height: "2.25rem",
        backgroundColor: "rgba(196, 196, 196, 0.21)",
        border: "none",
        borderRadius: "3rem",
        padding: "0.5rem 2.5rem",
        fontSize: "1rem",
        color: "rgb(117, 117, 117)",
        outline: "none",

        "@media (max-width:900px)": {
          width: "70%",
        },
      },

      "& > .search-icon": {
        color: "rgb(117, 117, 117)",
        position: "absolute",
        left: "10px",
        top: "50%",
        transform: "translateY(-50%)",
      },
    },

    "& > .space-container": {
      display: "flex",
      gap: "3rem",
      maxWidth: "100%",
      width: "90%",
      overflowX: "scroll",
      scrollbarWidth: "thin",
      scrollbarColor: "rgba(0, 0, 0, 0.1) transparent",
      height: "max-content",

      "& > .create-space": {
        backgroundColor: "#c4c4c4",
        borderRadius: "1rem",
        padding: "0.3rem 0.6rem",
        color: "#020202",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer",
        transition: "background-color 0.3s",
        minWidth: "9rem",
      },

      "& > .space": {
        backgroundColor: "#c4c4c4",
        borderRadius: "1rem",
        padding: "0.3rem 0.6rem",
        color: "#020202",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer",
        transition: "background-color 0.3s",
        height: "max-content",
      },

      "& > .space.active": {
        backgroundColor: "#575757",
      },
    },

    "& > .button-container": {
      display: "flex",
      justifyContent: "flex-end",

      "& > .MuiButton-root": {
        backgroundColor: "#000",
        borderRadius: "0.5rem",
        margin: "1rem 0 0 0",
      },
    },

    "& > .questions-container": {
      display: "flex",
      flexDirection: "column",
      gap: "3rem",
      width: "90%",
      marginBottom: "1rem",

      "& > .question-card": {
        width: "100%",
        height: "auto",
        padding: "1rem",
        boxShadow: "rgba(0, 0, 0, 0.25) 0px 5px 15px",
        borderRadius: "1rem",

        "& > .main-status": {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          "& > .status-container": {
            display: "flex",
            gap: "1rem",

            "& > .user": {
              width: "2rem",
              height: "2rem",
              borderRadius: "50%",
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;",
            },

            "& > div > .user-name": {
              fontWeight: "600",
              fontSize: "0.9rem",
            },

            "& > div > .status": {
              color: "grey",
              fontSize: "0.7rem",
              margin: "-0.3rem 0 0 0",
            },
          },
        },

        "& > .title": {
          fontWeight: "bold",
          fontSize: "1.3rem",
          wordBreak: "break-all",
        },

        "& > .description": {
          color: "grey",
          wordBreak: "break-all",
        },

        "& > .delete": {
          width: "2rem",
          height: "2rem",
        },

        "& > .icons-container": {
          display: "flex",
          justifyContent: "flex-end",

          "& > .edit": {
            width: "2.2rem",
            height: "2.2rem",

            "& > svg": {
              width: "2.2rem",
              height: "2.2rem",
            },
          },

          "& > .like-container": {
            "& > .like": {
              width: "3.2rem",
              height: "2.2rem",

              "& > svg": {
                height: "2rem",
                width: "2rem",
              },
            },

            "& > .dont-like": {
              width: "2rem",
              height: "2.2rem",

              "& > svg": {
                height: "1rem",
              },
            },
          },
        },
      },
    },
  },
}));

const StyledModal = styled(Modal)(() => ({
  "& > .content": {
    maxWidth: "30rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    padding: "2rem 3rem",

    "& > .close-icon": {
      display: "none",
    },

    "& > .warm-text": {
      fontSize: "1.563rem",
      fontWeight: "500",
      lineHeight: "1.938rem",
      textAlign: "center",
    },

    "& > .button-box": {
      display: "flex",
      gap: "2rem",
      marginTop: "5%",

      "& > .delete-btn": {
        width: "6rem",
        height: "2.375rem",
        display: "flex",
        color: "white",
        backgroundColor: "red",
        fontSize: "1rem",
        borderRadius: "0.5rem",
        textTransform: "none",
      },

      "& > .cansel-btn": {
        width: "6rem",
        height: "2.375rem",
        display: "flex",
        color: "black",
        border: "1px solid black",
        backgroundColor: "white",
        fontSize: "1rem",
        borderRadius: "0.5rem",
        textTransform: "none",
      },
    },
  },

  "@media (max-width: 600px)": {
    "& > .content": {
      width: "60%",

      "& > .warm-text": {
        fontSize: "1rem",
        fontWeight: "500",
        textAlign: "center",
      },
    },
  },

  "@media (max-width: 375px)": {
    "& > .content": {
      width: "80%",

      "& > .warm-text": {
        fontSize: "0.8rem",
        fontWeight: "500",
        textAlign: "center",
      },

      "& > .button-box": {
        gap: "1rem",

        "& > .delete-btn": {
          width: "5rem",
          height: "2rem",
        },

        "& > .cansel-btn": {
          width: "5rem",
          height: "2rem",
        },
      },
    },
  },
}));
