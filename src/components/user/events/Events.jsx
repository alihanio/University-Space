import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { get, getDatabase, onValue, ref, remove } from "firebase/database";
import { Box, styled, Typography, IconButton, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import CalendarMonthSharpIcon from "@mui/icons-material/CalendarMonthSharp";
import Modal from "../../UI/Modal";
import EventsModal from "../../admin/events/EventsModal";
import { DeleteIcon, EditIcon } from "../../../assets/icons";
import { app } from "../../../configs/firebase";

const Events = () => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTab, setSelectedTab] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [selectId, setSelectId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [events, setEvents] = useState(null);

  const { role } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const getEventsData = async () => {
    const db = getDatabase(app);

    const dbRef = ref(db, "studentSpace/events");

    await get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const myData = snapshot.val();

          const temporaryArray = Object.keys(myData).map((myFireId) => ({
            ...myData[myFireId],
            eventId: myFireId,
          }));

          setEvents(temporaryArray);
        }
        const db = getDatabase(app);

        const usersRef = ref(db, "studentSpace/events");

        onValue(usersRef, (snapshot) => {
          if (snapshot.exists()) {
            const myData = snapshot.val();

            const temporaryArray = Object.keys(myData).map((myFireId) => {
              return { ...myData[myFireId], eventId: myFireId };
            });

            setEvents(temporaryArray);
          }
        });
      })
      .catch((error) => {
        console.error("Error getting user data:", error);
      });
  };

  useEffect(() => {
    getEventsData();
  }, []);

  const handleDateChange = (date) => setSelectedDate(date);

  const filterEventsByTab = (tab) => {
    switch (tab) {
      case "today":
        return events?.filter((event) => {
          const eventDate = new Date(event.date).setHours(0, 0, 0, 0);

          const today = new Date().setHours(0, 0, 0, 0);

          return eventDate === today;
        });

      case "tomorrow":
        return events?.filter((event) => {
          const eventDate = new Date(event.date).setHours(0, 0, 0, 0);

          const tomorrow = new Date();

          tomorrow.setDate(tomorrow.getDate() + 1);

          return eventDate === tomorrow.setHours(0, 0, 0, 0);
        });

      default:
        return selectedDate
          ? events?.filter((event) => {
              const eventDate = new Date(event.date).setHours(0, 0, 0, 0);

              const selectedDateValue = selectedDate
                .toDate()
                .setHours(0, 0, 0, 0);

              return eventDate === selectedDateValue;
            })
          : events;
    }
  };

  const filteredEvents = filterEventsByTab(selectedTab);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setSelectedDate(null);
  };

  const handleDeleteEvent = async () => {
    const db = getDatabase(app);

    const dbRef = ref(db, `studentSpace/events/` + deleteId);

    await remove(dbRef)
      .then(() => {
        setOpenDeleteModal(false);
        setEvents([]);
        getEventsData();
      })
      .catch(() => {});
  };

  const handleOpenDeleteModal = (eventId) => {
    setOpenDeleteModal((prev) => !prev);
    setDeleteId(eventId);
  };

  const toggleModalHandler = () => setOpenModal(true);

  const closeModalHandler = () => setOpenModal(false);

  const toggleUpdateModalHandler = (id) => {
    setOpenUpdateModal(true);
    setSelectId(id);
  };

  const closeUpdateModalHandler = () => setOpenUpdateModal(false);

  const handleNavigate = (id) => {
    if (role === "ADMIN") {
      navigate(`/admin/events/${id}`);
    } else {
      navigate(`/user/events/${id}`);
    }
  };

  return (
    <StyledMainContainer className="main-container-events">
      <Typography>EVENTS</Typography>

      <Box className="actions-nav">
        <Box className="actions-nav-box">
          {role === "ADMIN" ? (
            <StyledButton variant="outlined" onClick={toggleModalHandler}>
              + Add event
            </StyledButton>
          ) : null}

          <StyledDatePicker
            value={selectedDate}
            onChange={handleDateChange}
            slots={{
              openPickerIcon: CalendarMonthSharpIcon,
            }}
          />
        </Box>

        <Box className="tabs">
          {["all", "today", "tomorrow"].map((tab) => (
            <Typography
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={selectedTab === tab ? "selected" : ""}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Typography>
          ))}
        </Box>
      </Box>

      <EventsModal isOpen={openModal} onClose={closeModalHandler} />

      <EventsModal
        isOpen={openUpdateModal}
        onClose={closeUpdateModalHandler}
        selectId={selectId}
      />

      <Box className="events-container">
        <Box className="events-box">
          {filteredEvents?.map(({ eventId, date, title, image }) => (
            <Box key={eventId}>
              <StyledContainer variant="static" backgroundimage={image}>
                <Box className="container">
                  <Box>
                    <Box className="actions-date-container">
                      <Typography className="date">
                        {new Date(date)?.toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Typography>

                      {role === "ADMIN" ? (
                        <Box className="actions-container">
                          <IconButton
                            className="edit"
                            onClick={() => handleOpenDeleteModal(eventId)}
                          >
                            <DeleteIcon />
                          </IconButton>

                          <IconButton
                            className="edit"
                            onClick={() => toggleUpdateModalHandler(eventId)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Box>
                      ) : null}
                    </Box>

                    <Typography className="title">{title}</Typography>
                  </Box>

                  <Typography
                    onClick={() => handleNavigate(eventId)}
                    className="more"
                  ></Typography>
                </Box>
              </StyledContainer>
            </Box>
          ))}
        </Box>
      </Box>

      <StyledModal open={openDeleteModal} onClose={handleOpenDeleteModal}>
        <Typography className="warm-text">
          Are you sure want to delete ?
        </Typography>

        <Box className="button-box">
          <Button className="cansel-btn" onClick={handleOpenDeleteModal}>
            Cancel
          </Button>

          <Button className="delete-btn" onClick={handleDeleteEvent}>
            Delete
          </Button>
        </Box>
      </StyledModal>
    </StyledMainContainer>
  );
};

export default Events;

const StyledMainContainer = styled(Box)(() => ({
  margin: "1rem 2rem 0 25rem",

  "& > .MuiTypography-root": {
    fontSize: "2rem",
    fontWeight: "bold",
    padding: "2rem 0",
    fontFamily: "Prosto One",
  },

  "& > .actions-nav": {
    width: "63.5vw",
    marginRight: "3.25rem",
    marginBottom: "1.25rem",
    display: "flex",
    justifyContent: "space-between",

    "& > .actions-nav-box": {
      display: "flex",
      gap: "20px",
      alignItems: "center",

      "@media (max-width: 375px)": {
        flexDirection: "column",
        alignItems: "start",
      },
    },

    "& > .tabs": {
      display: "flex",
      gap: "0.625rem",
      fontFamily: "Amiko",

      "& > p": {
        cursor: "pointer",
      },

      "& > .selected": {
        textDecoration: "underline",
      },
    },
  },

  "& > .events-container": {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "space-around",
    gap: "1.25rem",
    height: "73vh",
    overflow: "auto",

    "& > .events-box": {
      height: "31.25rem",
      display: "flex",
      flexWrap: "wrap",
      gap: "2.188rem",
    },
  },

  "@media (max-width: 900px)": {
    marginLeft: "21rem",

    "& > .page-name": {
      width: "10rem",
    },

    "& > .actions-nav": {
      width: "100%",
    },

    "& .events-container": {
      justifyContent: "normal",
      width: "33rem",
      gap: "1rem",

      "& > .MuiPagination-root": {
        marginTop: "170px",
      },
    },
  },

  "@media (max-width: 600px)": {
    marginLeft: "13rem",

    "& .events-container": {
      justifyContent: "normal",
      width: "22rem",
      gap: "1rem",

      "& > .events-box": {
        height: "auto",
        width: "auto",
      },

      "& > .MuiPagination-root": {
        marginTop: "170px",
      },
    },

    "& > .actions-nav": {
      width: "100%",

      "& > .actions-nav-box": {
        flexDirection: "column",
      },
    },
  },

  "@media (max-width: 375px)": {
    padding: "1.1rem 0 0 0.5rem",
    marginLeft: "0rem",

    "& > .actions-nav": {
      width: "100%",
      flexDirection: "column",

      // "& > .actions-nav-box": {
      "& > .tabs": {
        width: "200px",
        // },
      },
    },
    "& .events-container": {
      alignItems: "center",
      justifyContent: "start",
      overflow: "auto",
      height: "100%",
      flexDirection: "row",
      width: "15rem",

      "& .events-box": {
        height: "100%",
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
      },

      "& > .MuiPagination-root": {
        alignSelf: "start",
        marginTop: "33rem",
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

const StyledContainer = styled(Box)(({ backgroundimage, variant }) => ({
  overflow: "auto",
  width: "15rem",
  height: "12.5rem",
  backgroundImage: variant === "static" ? `url(${backgroundimage})` : "none",
  backgroundColor: variant === "more" ? "black" : "none",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: "0.75rem",
  color: "white",

  "& > .container": {
    padding: "0.625rem",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    "& > div": {
      height: "100%",

      "& > .actions-date-container": {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",

        "& > .actions-container": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          "& > .edit": {
            width: "2rem",
            height: "2rem",

            "& svg": {
              "& > g": {
                fill: "white",
              },
            },
          },
        },

        "& > .date": {
          marginBottom: "0.313rem",
          fontSize: "0.625rem",
        },
      },

      "& > .details-container": {
        "& > .description-box": {
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
          gap: "5px",

          "& > .description": {
            fontSize: "12px",
            fontWeight: "500",
            lineHeight: "15px",
          },
        },

        "& > .tags-box": {
          display: "flex",
          gap: "10px",

          "& > .tag": {
            borderRadius: "5px",
            padding: "5px",
            fontSize: "12px",
            fontWeight: "400",
            lineHeight: "15px",
            backgroundColor: "white",
            color: "#636363",
          },
        },
      },

      "& > .title": {
        marginBottom: "0.625rem",
        fontFamily: "Inter",
        fontSize: "1.25rem",
        fontWeight: "600",
      },
    },

    "& > .more": {
      textAlign: "end",
      color: "white",
      textDecoration: "none",
      cursor: "pointer",

      "&::before": {
        content: "'Read more'",
      },

      "&:hover::before": {
        content: "'Go to the event →'",
      },
    },
  },

  "@media (max-width: 600px)": {
    width: "9rem",
    height: "7rem",

    "& > .container": {
      padding: "0.625rem",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",

      "& > div": {
        height: "100%",

        "& > .details-container": {
          "& > .description-box": {
            display: "flex",
            flexDirection: "column",
            marginBottom: "5px",
            gap: "5px",

            "& > .description": {
              fontSize: "12px",
              fontWeight: "500",
              lineHeight: "15px",
            },
          },

          "& > .tags-box": {
            display: "flex",
            gap: "5px",

            "& > .tag": {
              borderRadius: "5px",
              padding: "5px",
              fontSize: "11px",
              fontWeight: "400",
              lineHeight: "12px",
              backgroundColor: "white",
              color: "#636363",
            },
          },
        },

        "& > .date": {
          marginBottom: "0rem",
          fontSize: "0.625rem",
        },

        "& > .title": {
          marginBottom: "0.1rem",
          fontFamily: "Inter",
          fontSize: "1.25rem",
          fontWeight: "600",
        },
      },

      "& > .more": {
        textAlign: "end",
        cursor: "pointer",
        fontSize: ".6rem",

        "&::before": {
          content: "'Подробнее'",
        },

        "&:hover::before": {
          textAlign: "start",
          content: "'Перейти к мероприятию 🡡'",
        },
      },
    },
  },

  "@media (max-width: 375px)": {
    width: "15rem",
    height: "11rem",

    "& > .container": {
      "& > .more": {
        fontSize: "1rem",

        "&::before": {
          content: "'Подробнее'",
        },

        "&:hover::before": {
          textAlign: "start",
          content: "'Перейти к мероприятию 🡡'",
        },
      },
    },
  },
}));

const StyledDatePicker = styled(DatePicker)(() => ({
  fontFamily: "Roboto",
  fontWeight: "600",
  border: "none",
  padding: "0",

  "& input": {
    fontWeight: "550",
    fontSize: "1rem",
    padding: "0",
    width: "6.5rem",
    color: "#4D4E51",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
}));

const StyledButton = styled(Button)(() => ({
  color: "black",
  borderColor: "black",

  "@media (max-width: 600px)": {
    padding: "5px",
    width: "7rem",
    fontSize: "1rem",
    letterSpacing: "0",
    textTransform: "lowercase",
  },

  "@media (max-width: 375px)": {
    padding: "5px",
    width: "92%",
    textTransform: "lowercase",
  },
}));
