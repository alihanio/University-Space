import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Typography, styled } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { get, getDatabase, onValue, ref, remove } from "firebase/database";
import TodoModel from "../../user/planning/TodoModal";
import CourseModel from "./CourseModal";
import Modal from "../../UI/Modal";
import { ROUTES } from "../../../routes/routes";
import { CompleteImage } from "../../../assets/images";
import { CheckboxIcon, EditIcon, ProgressIcon } from "../../../assets/icons";
import { app } from "../../../configs/firebase";

const Planning = () => {
  const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [inProgressList, setInProgressList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectId, setSelectId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [todoList, setTodoList] = useState([]);
  const [course, setCourse] = useState([]);

  const { role, email, id } = useSelector((state) => state.auth);

  const todoStorageKey = `todoList_${id}`;
  const inProgressStorageKey = `inProgressList_${id}`;
  const completedStorageKey = `completedList_${id}`;

  useEffect(() => {
    const localTodoList =
      JSON.parse(localStorage.getItem(todoStorageKey)) || [];

    const localInProgressList =
      JSON.parse(localStorage.getItem(inProgressStorageKey)) || [];

    const localCompletedList =
      JSON.parse(localStorage.getItem(completedStorageKey)) || [];

    setTodoList(localTodoList);
    setInProgressList(localInProgressList);
    setCompletedList(localCompletedList);
  }, [todoStorageKey, inProgressStorageKey, completedStorageKey]);

  const getPlanning = async () => {
    const db = getDatabase(app);

    const dbRef = ref(db, "studentSpace/planning");

    await get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const myData = snapshot.val();

          const temporaryArray = Object.keys(myData).map((myFireId) => ({
            ...myData[myFireId],
            id: myFireId,
          }));

          setCourse(temporaryArray);
        }
        const db = getDatabase(app);

        const usersRef = ref(db, "studentSpace/planning");

        onValue(usersRef, (snapshot) => {
          if (snapshot.exists()) {
            const myData = snapshot.val();

            const temporaryArray = Object.keys(myData).map((myFireId) => {
              return { ...myData[myFireId], id: myFireId };
            });

            setCourse(temporaryArray);
          }
        });
      })
      .catch((error) => {
        console.error("Error getting user data:", error);
      });
  };

  useEffect(() => {
    getPlanning();
  }, []);

  const navigate = useNavigate();

  const handleOpenAddModal = () => setOpenAddModal((prev) => !prev);

  const handleOpenDeleteModal = (e, id) => {
    e.stopPropagation();

    setOpenDeleteModal((prev) => !prev);
    setDeleteId(id);
  };

  const handleIsVisible = () => setOpenAddTaskModal((prev) => !prev);

  const handleAddTask = (newTask) => {
    const id = uuidv4();

    const updatedTask = { id, task: newTask };

    setTodoList([...todoList, updatedTask]);

    const updatedTodoList = [...todoList, updatedTask];

    localStorage.setItem(todoStorageKey, JSON.stringify(updatedTodoList));
  };

  const handleDragStart = (e, task, id, listName) => {
    e.dataTransfer.setData("task", task);
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("listName", listName);
  };

  const handleDragOver = (e) => e?.preventDefault();
  const handleDrop = (e, targetListName) => {
    e.preventDefault();

    const task = e.dataTransfer.getData("task");

    const id = e.dataTransfer.getData("id");

    const sourceListName = e.dataTransfer.getData("listName");

    switch (targetListName) {
      case "todo":
        setTodoList((prevTodoList) => [...prevTodoList, { id, task }]);
        break;

      case "inProgress":
        setInProgressList((prevInProgressList) => [
          ...prevInProgressList,
          { id, task },
        ]);
        break;

      case "completed":
        setCompletedList((prevCompletedList) => [
          ...prevCompletedList,
          { id, task },
        ]);
        break;

      default:
        break;
    }

    switch (sourceListName) {
      case "todo":
        setTodoList((prevTodoList) =>
          prevTodoList.filter((item) => item.id !== id)
        );
        break;

      case "inProgress":
        setInProgressList((prevInProgressList) =>
          prevInProgressList.filter((item) => item.id !== id)
        );
        break;

      case "completed":
        setCompletedList((prevCompletedList) =>
          prevCompletedList.filter((item) => item.id !== id)
        );
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    localStorage.setItem(todoStorageKey, JSON.stringify(todoList));
    localStorage.setItem(inProgressStorageKey, JSON.stringify(inProgressList));
    localStorage.setItem(completedStorageKey, JSON.stringify(completedList));
  }, [
    todoList,
    inProgressList,
    completedList,
    todoStorageKey,
    inProgressStorageKey,
    completedStorageKey,
  ]);

  const handleOpenUpdateModal = (e, id) => {
    e.stopPropagation();

    setOpenUpdateModal(true);
    setSelectId(id);
  };

  const deleteCourse = async () => {
    const db = getDatabase(app);

    const dbRef = ref(db, `studentSpace/planning/` + deleteId);

    await remove(dbRef)
      .then(() => {
        setOpenDeleteModal(false);
        setCourse([]);
        getPlanning();
      })
      .catch(() => {});
  };

  const handleCloseUpdateModal = () => setOpenUpdateModal(false);

  const handleDeleteTask = (id) => {
    const updatedTodoList = todoList.filter((item) => item.id !== id);

    const updatedInProgressList = inProgressList.filter(
      (item) => item.id !== id
    );

    const updatedCompletedList = completedList.filter((item) => item.id !== id);

    setTodoList(updatedTodoList);
    setInProgressList(updatedInProgressList);
    setCompletedList(updatedCompletedList);

    localStorage.setItem(todoStorageKey, JSON.stringify(updatedTodoList));
    localStorage.setItem(
      inProgressStorageKey,
      JSON.stringify(updatedInProgressList)
    );
    localStorage.setItem(
      completedStorageKey,
      JSON.stringify(updatedCompletedList)
    );
  };

  const handleInnerPage = (id) => {
    if (role === "ADMIN") {
      navigate(`${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.PLANNING}/${id}`);
    } else {
      navigate(`${ROUTES.USER.INDEX}${ROUTES.USER.PLANNING}/${id}`);
    }
  };

  return (
    <StyledContainer>
      <CourseModel isOpenModal={openAddModal} onClose={handleOpenAddModal} />
      <CourseModel
        isOpenModal={openUpdateModal}
        onClose={handleCloseUpdateModal}
        selectId={selectId}
      />

      <Typography>PLANNING</Typography>

      <Box className="courses-tab">
        <Typography>All courses</Typography>
        <Typography className="create" onClick={handleOpenAddModal}>
          + Create a courses
        </Typography>
      </Box>

      <Box className="content">
        <Typography className="courses">Courses</Typography>

        <Box className="courses-container">
          {course
            ?.filter((item) => item.userEmail === email)
            ?.map(({ title, date, imageUrl, id }) => (
              <Box
                key={id}
                className="courses-card"
                onClick={() => handleInnerPage(id)}
              >
                <img src={imageUrl} alt="img" />

                <Typography className="title">
                  <span className="dot"> </span>

                  {title}
                </Typography>

                <Box className="about">
                  <Typography className="date">{date}</Typography>

                  <Box className="icon-container">
                    <EditIcon
                      className="edit"
                      onClick={(e) => handleOpenUpdateModal(e, id)}
                    />
                    <DeleteIcon onClick={(e) => handleOpenDeleteModal(e, id)} />
                  </Box>
                </Box>
              </Box>
            ))}
        </Box>

        <TodoModel
          isOpenModal={openAddTaskModal}
          onClose={handleIsVisible}
          onTaskAdd={handleAddTask}
        />

        <Box className="todo-container">
          <Typography>Todo List</Typography>

          <Box className="todo-content">
            <Box
              onDrop={(e) => handleDrop(e, "todo")}
              onDragOver={handleDragOver}
              className="block"
            >
              <Typography variant="h6" className="todo">
                <CheckboxIcon className="icon" />
                Todo
              </Typography>

              {todoList?.map(({ task, id }) => (
                <Box
                  key={id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, id, "todo")}
                  className="task"
                >
                  <Typography>{task}</Typography>
                  <CloseIcon onClick={() => handleDeleteTask(id)} />
                </Box>
              ))}
              <Typography onClick={handleIsVisible}>+Add task</Typography>
            </Box>

            <Box
              onDrop={(e) => handleDrop(e, "inProgress")}
              onDragOver={handleDragOver}
              className="block"
            >
              <Typography variant="h6" className="in-progress">
                <ProgressIcon className="icon" />
                In Progress
              </Typography>

              {inProgressList?.map(({ task, id }) => (
                <Box
                  key={id}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, task, id, "inProgress")
                  }
                  className="task"
                >
                  <Typography>{task}</Typography>
                  <CloseIcon onClick={() => handleDeleteTask(id)} />
                </Box>
              ))}
            </Box>

            <Box
              onDrop={(e) => handleDrop(e, "completed")}
              onDragOver={handleDragOver}
              className="block"
            >
              <Typography variant="h6" className="complated">
                <img src={CompleteImage} alt="complete" />
                Completed
              </Typography>

              {completedList?.map(({ task, id }) => (
                <Box
                  key={id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, id, "completed")}
                  className="task"
                >
                  <Typography>{task}</Typography>
                  <CloseIcon onClick={() => handleDeleteTask(id)} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <StyledModal open={openDeleteModal} onClose={handleOpenDeleteModal}>
        <Typography className="warm-text">
          Are you sure want to delete ?
        </Typography>

        <Box className="button-box">
          <Button className="cansel-btn" onClick={handleOpenDeleteModal}>
            Cansel
          </Button>

          <Button className="delete-btn" onClick={deleteCourse}>
            Delete
          </Button>
        </Box>
      </StyledModal>
    </StyledContainer>
  );
};

export default Planning;
const StyledContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  margin: "1rem 2rem 0 25rem",

  "& > .MuiTypography-root": {
    fontSize: "2rem",
    fontWeight: "bold",
    padding: "2rem 0",
    fontFamily: "Prosto One",
  },

  "& > .courses-tab": {
    display: "flex",
    gap: "1rem",

    "& > .MuiTypography-root": {
      fontSize: "1.3rem",
      fontWeight: "600",
    },

    "& > .create": {
      fontWeight: "normal",
      color: "grey",
      cursor: "pointer",
      fontFamily: "Poppins",
    },
  },

  "& > .content": {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",

    "& > .courses": {
      fontSize: "1.5rem",
      fontWeight: "500",
      margin: "1rem 0 0 0",
    },

    "& > .courses-container": {
      display: "flex",
      flexWrap: "wrap",
      gap: "2rem",

      "& > .courses-card": {
        maxWidth: "20rem",
        maxHeight: "14rem",
        height: "100%",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        borderRadius: "0.5rem",

        "& > img": {
          width: "100%",
          height: "55%",
          borderRadius: "0.5rem 0.5rem 0 0",
        },

        "& > .title": {
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0 0 0 1rem",
          color: "grey",
          width: "19rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",

          "& > .dot": {
            color: "#93dc96",
            backgroundColor: "green",
            borderRadius: "5rem",
            width: "0.5rem",
            height: "0.5rem",
          },
        },

        "& > .about": {
          display: "flex",
          justifyContent: "space-between",

          "& > .date": {
            display: "flex",
            alignItems: "center",
            margin: "0.5rem 0 0 1rem",
            padding: "0 0 0 1rem",
            backgroundColor: "orange",
            width: "7rem",
            borderRadius: "1rem",
            fontSize: "0.8rem",
          },

          "& > .icon-container": {
            display: "flex",
            alignItems: "center",
            cursor: "pointer",

            "& > .edit": {
              width: "1.5rem",
              height: "1.5rem",
            },
          },
        },
      },
    },

    "& > .todo-container": {
      "& > .MuiTypography-root": {
        fontSize: "1.3rem",
        fontWeight: "600",
      },

      "& > .todo-content": {
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
        margin: "1rem 0 0 0",

        "& > .block": {
          maxHeight: "100%",
          height: "100%",
          padding: "0 0 5rem 0",

          "& > .todo": {
            backgroundColor: "grey",
            padding: "0rem 10rem 0 1rem",
            borderRadius: "0.5rem",
            color: "white",
          },

          "& > .in-progress": {
            backgroundColor: "#8ac0fb",
            padding: "0rem 6.3rem 0 1rem",
            borderRadius: "0.5rem",
            color: "white",
          },

          "& > .complated": {
            backgroundColor: "#93dc96",
            padding: "0rem 5.85rem 0 1rem",
            borderRadius: "0.5rem",
            color: "white",
            display: "flex",
            alignItems: "center",
          },
        },

        "& > .block:first-child": {
          borderRadius: "0.5rem",
          backgroundColor: "grey",
          padding: ".5rem",
          minHeight: "7rem",
        },

        "& > .block:nth-child(2)": {
          borderRadius: "0.5rem",
          backgroundColor: "#8ac0fb",
          padding: ".5rem",
          minHeight: "7rem",
        },

        "& > .block:last-child": {
          backgroundColor: "#93dc96",
          borderRadius: "0.5rem",
          padding: ".5rem",
          minHeight: "7rem",
        },

        "& > div > h6 > .icon": {
          width: "1rem",
          height: "1rem",
          margin: "0 0.5rem 0 0",
        },

        "& > div > h6 > img": {
          width: "2rem",
          height: "2rem",
          margin: "0 0.3rem 0 0",
        },

        "& > div > .task": {
          display: "flex",
          justifyContent: "space-between",
          width: "14.7rem",
          height: "auto",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          padding: "1rem",
          borderRadius: "0.5rem",
          margin: "0.5rem 0 1rem 0",
          backgroundColor: "#FFFFFF",
        },
      },
    },
  },

  "@media (max-width: 900px)": {
    "& > .content": {
      "& > .courses": {
        fontSize: "1rem",
      },

      "& > .courses-container": {
        flexDirection: "column",
      },

      "& > .todo-container": {
        "& > .todo-content": {
          flexDirection: "column",

          "& > .block": {
            width: "20rem",
            height: "100%",
          },
        },
      },
    },
  },

  "@media (max-width: 600px)": {
    marginLeft: "13.5rem",

    "& > .courses-tab": {
      alignItems: "center",

      "& > .create": {
        fontSize: "1rem",
      },

      "& > p": {},
    },

    "& > .content": {
      "& > .courses": {
        fontSize: "1.5rem",
      },

      "& > .courses-container": {
        flexDirection: "column",

        "& > .courses-card": {
          width: "30rem",
        },
      },

      "& > .todo-container": {
        "& > .todo-content": {
          flexDirection: "column",

          "& > .block": {
            width: "20rem",
            height: "100%",
          },
        },
      },
    },
  },

  "@media (max-width: 375px)": {
    margin: "0",

    "& > .courses-tab": {
      width: "17rem",

      "& > .MuiTypography-root": {
        fontSize: "1rem",
        fontWeight: "600",
      },

      "& > .create": {
        color: "grey",
        cursor: "pointer",
        fontFamily: "Poppins",
      },

      marginBottom: ".5rem",
    },

    "& > .MuiTypography-root": {
      fontSize: "2rem",
      fontWeight: "bold",
      padding: ".5rem 0",
      fontFamily: "Prosto One",
    },

    "& > .content": {
      "& > .courses": {
        fontSize: "1.5rem",
      },

      "& > .courses-container": {
        flexDirection: "row",

        "& > .courses-card": {
          "& > .title": {
            width: "10rem",
          },

          width: "90%",
        },
      },

      "& > .todo-container": {
        "& > .MuiTypography-root": {
          width: "auto",
          marginTop: "2rem",
        },

        "& > .todo-content": {
          flexDirection: "column",
          width: "17rem",

          "& > .block": {
            height: "100%",
            width: "16.5rem",
          },
        },
      },
    },
  },
}));

const StyledModal = styled(Modal)(() => ({
  "& > .content": {
    width: "30rem",
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
      marginTop: "10%",

      "& > .delete-btn": {
        marginTop: "2%",
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
        marginTop: "2%",
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

    "@media (max-width: 725px)": {
      width: "24rem",
      padding: "1rem 0rem 1rem 0rem",

      "& > .warm-text": {
        fontSize: "1.3rem",
        lineHeight: "1.638rem",
      },

      "& > .button-box": {
        display: "flex",
        gap: "1rem",
        marginTop: "10%",

        "& > .delete-btn": {
          marginTop: "2%",
          width: "5rem",
          fontSize: "0.9rem",
        },

        "& > .cansel-btn": {
          marginTop: "2%",
          width: "5rem",
          fontSize: "0.9rem",
        },
      },
    },

    "@media (max-width: 600px)": {
      width: "20rem",
      padding: "1rem 0rem 1rem 0rem",

      "& > .warm-text": {
        fontSize: "1.1rem",
        lineHeight: "1.638rem",
      },

      "& > .button-box": {
        display: "flex",
        gap: "1rem",
        marginTop: "10%",

        "& > .delete-btn": {
          marginTop: "2%",
          width: "4rem",
          fontSize: "0.8rem",
        },

        "& > .cansel-btn": {
          marginTop: "2%",
          width: "4rem",
          fontSize: "0.8rem",
        },
      },
    },

    "@media (max-width: 375px)": {
      width: "16rem",
      padding: "1rem 0rem 1rem 0rem",

      "& > .warm-text": {
        fontSize: "0.9rem",
        lineHeight: "1.638rem",
      },

      "& > .button-box": {
        display: "flex",
        gap: "1rem",
        marginTop: "10%",

        "& > .delete-btn": {
          marginTop: "2%",
          width: "4rem",
          fontSize: "0.8rem",
        },

        "& > .cansel-btn": {
          marginTop: "2%",
          width: "4rem",
          fontSize: "0.8rem",
        },
      },
    },
  },
}));
