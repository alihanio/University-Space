import { useEffect, useState } from "react";
import { LuCalendarDays } from "react-icons/lu";
import { IoPerson } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { get, getDatabase, ref } from "firebase/database";
import { Box, Typography, styled } from "@mui/material";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import CloseIcon from "@mui/icons-material/Close";
import TodoModel from "./TodoModal";
import { CompleteImage } from "../../../assets/images";
import { CheckboxIcon, ProgressIcon } from "../../../assets/icons";

const InnerPlanning = () => {
  const [inProgressList, setInProgressList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [innerData, setInnerData] = useState(null);
  const [todoList, setTodoList] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();

      const dbRef = ref(db, "studentSpace/planning/" + id);

      await get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const targetObject = snapshot.val();

            setInnerData(targetObject);
          }
        })
        .catch((error) => {
          console.error("Error getting news data:", error);
        });
    };
    fetchData();
  }, [id]);

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

  useEffect(() => {
    const saveTasksToLocalStorage = () => {
      localStorage.setItem(todoStorageKey, JSON.stringify(todoList));

      localStorage.setItem(
        inProgressStorageKey,
        JSON.stringify(inProgressList)
      );

      localStorage.setItem(completedStorageKey, JSON.stringify(completedList));
    };

    saveTasksToLocalStorage();
  }, [
    todoList,
    inProgressList,
    completedList,
    todoStorageKey,
    inProgressStorageKey,
    completedStorageKey,
  ]);

  const handleIsVisible = () => setOpenModal((prev) => !prev);

  const handleAddTask = (newTask) => {
    const taskId = uuidv4();

    setTodoList([...todoList, { id: taskId, task: newTask }]);
  };

  const handleDragStart = (e, task, id, listName) => {
    e.dataTransfer.setData("task", task);
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("listName", listName);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, targetListName) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("id");
    const task = e.dataTransfer.getData("task");
    const sourceListName = e.dataTransfer.getData("listName");

    switch (targetListName) {
      case "todo":
        setTodoList((prevTodoList) => [...prevTodoList, { id: taskId, task }]);
        break;

      case "inProgress":
        setInProgressList((prevInProgressList) => [
          ...prevInProgressList,
          { id: taskId, task },
        ]);
        break;

      case "completed":
        setCompletedList((prevCompletedList) => [
          ...prevCompletedList,
          { id: taskId, task },
        ]);
        break;

      default:
        break;
    }

    if (sourceListName === "todo") {
      setTodoList((prevTodoList) =>
        prevTodoList.filter((item) => item.id !== taskId)
      );
    } else if (sourceListName === "inProgress") {
      setInProgressList((prevInProgressList) =>
        prevInProgressList.filter((item) => item.id !== taskId)
      );
    } else if (sourceListName === "completed") {
      setCompletedList((prevCompletedList) =>
        prevCompletedList.filter((item) => item.id !== taskId)
      );
    }
  };

  const handleDeleteTask = (taskId) => {
    setTodoList((prevTodoList) =>
      prevTodoList.filter((task) => task.id !== taskId)
    );

    setInProgressList((prevInProgressList) =>
      prevInProgressList.filter((task) => task.id !== taskId)
    );

    setCompletedList((prevCompletedList) =>
      prevCompletedList.filter((task) => task.id !== taskId)
    );
  };

  const goBack = () => window.history.back();

  return (
    <StyledContainer image={innerData?.imageUrl}>
      <Box className="image">
        <Typography className="title">{innerData?.title}</Typography>
      </Box>

      <Typography className="go-back" onClick={goBack}>
        <KeyboardBackspaceOutlinedIcon />
      </Typography>

      <Box className="container">
        <Typography className="text-container">
          {innerData?.description}
        </Typography>

        <TodoModel
          isOpenModal={openModal}
          onClose={handleIsVisible}
          onTaskAdd={handleAddTask}
        />

        <Box className="info">
          <Box>
            <IoPerson style={{ width: "25px", height: "25px" }} />
            <Typography variant="span">{innerData?.instructor}</Typography>
          </Box>

          <Box>
            <LuCalendarDays style={{ width: "25px", height: "25px" }} />
            <Box className="date">
              <Typography className="month">{innerData?.date}</Typography>
            </Box>
          </Box>
        </Box>

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

              {todoList?.map((task) => (
                <Box
                  key={task.id}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, task.task, task.id, "todo")
                  }
                  className="task"
                >
                  <Typography>{task.task}</Typography>
                  <CloseIcon onClick={() => handleDeleteTask(task.id)} />
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

              {inProgressList?.map((task) => (
                <Box
                  key={task.id}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, task.task, task.id, "inProgress")
                  }
                  className="task"
                >
                  <Typography>{task.task}</Typography>
                  <CloseIcon onClick={() => handleDeleteTask(task.id)} />
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

              {completedList?.map((task) => (
                <Box
                  key={task.id}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, task.task, task.id, "completed")
                  }
                  className="task"
                >
                  <Typography>{task.task}</Typography>
                  <CloseIcon onClick={() => handleDeleteTask(task.id)} />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default InnerPlanning;

const StyledContainer = styled(Box)(({ image }) => ({
  margin: "0 0 1rem 21.5rem",
  width: "100%",
  overflowX: "clip",

  "& > .go-back": {
    marginLeft: "2px",

    "@media (max-width: 375px)": {
      marginLeft: "2px",
      margin: "5px",
    },
  },

  "& > .image": {
    backgroundImage: `url(${image})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
    paddingLeft: "13rem",
    gap: "1rem",
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    height: "40%",

    "& > .title": {
      fontFamily: "Poppins",
      fontSize: "3rem",
      color: "white",
    },
  },

  "& > .container": {
    marginLeft: "2rem",
    width: "90%",

    "& > .text-container": {
      marginLeft: "3rem",
      marginTop: "1rem",
      fontFamily: "Poppins",
      width: "35rem",
      fontSize: "1.5rem",
    },

    "& > .info": {
      margin: "1rem 0 0 2.7rem",
      width: "500px",

      display: "flex",
      flexDirection: "column",
      gap: "1rem",

      "& > div": {
        display: "flex",
        alignItems: "center",
        gap: "1rem",

        "& > span": {
          color: "#a2a2a2",
          fontFamily: "Poppins",
        },

        "& > .date": {
          display: "flex",
          gap: "1rem",

          "& > .year": {
            backgroundColor: "#c4c4c4",
            fontFamily: "Poppins",
            borderRadius: "5px",
            padding: "0 3px",
          },

          "& > .month": {
            borderRadius: "5px",
            fontFamily: "Poppins",
            backgroundColor: "#e59348",
            padding: " 0 3px ",
          },
        },
      },
    },

    "& > .todo-container": {
      margin: "3rem 0 3rem 3rem",

      "& > .MuiTypography-root": {
        fontSize: "1.3rem",
        fontWeight: "600",
      },

      "& > .todo-content": {
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        margin: "1rem 1rem 1rem 0",

        "& > .block": {
          maxHeight: "100%",
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
            width: "max-content",
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
          minHeight: "9rem",
          width: "18.9rem",
        },

        "& > .block:nth-child(2)": {
          borderRadius: "0.5rem",
          backgroundColor: "#8ac0fb",
          padding: ".5rem",
          minHeight: "9rem",
          width: "18.9rem",
        },

        "& > .block:last-child": {
          backgroundColor: "#93dc96",
          minHeight: "9rem",
          borderRadius: "0.5rem",
          padding: ".5rem",
          width: "18.9rem",
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
          wordBreak: "break-all",
          justifyContent: "space-between",
          width: "14.7rem",
          height: "auto",
          backgroundColor: "#FFFFFF",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          padding: "1rem",
          borderRadius: "0.5rem",
          margin: "0.5rem 0 1rem 0",
        },
      },
    },
  },

  "@media (max-width: 900px)": {
    margin: "0 0 1rem 18.5rem",
    width: "100%",

    "& > .image": {
      width: "110%",
    },
  },

  "@media (max-width: 600px)": {
    margin: "0 0 1rem 12.5rem",
    width: "100%",

    "& > .image": {
      width: "100%",
      padding: "2rem",
    },

    "& > .container": {
      marginLeft: "0",

      "& > .text-container": {
        width: "10rem",
      },

      "& > .todo-container": {
        margin: "2.5rem",

        "& > .todo-content": {
          flexDirection: "column",
        },
      },

      "& > .info": {
        width: "15rem",
      },
    },
  },

  "@media (max-width: 375px)": {
    margin: "0 0 0rem 0",
    width: "100%",

    "& > .image": {
      width: "100%",
      padding: "0",
      height: "15vh",
    },

    "& > .container": {
      "& > .info": {
        margin: "1rem 0",
        width: "100%",
      },

      "& > .text-container": {
        width: "100%",
        fontSize: "1rem",
        margin: "0",
        marginTop: ".5rem",
      },

      "& > .todo-container": {
        margin: "0",

        "& > .todo-content": {
          flexWrap: "wrap",

          "& > .block": {
            height: "100%",
            padding: "1rem",
          },
        },
      },
    },
  },
}));
