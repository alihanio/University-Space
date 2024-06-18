import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../routes/routes";
import { Box, Button, Typography, styled } from "@mui/material";
import {
  BagIcon,
  DeleteIcon,
  EditIcon,
  MarkIcon,
  SearchIcon,
} from "../../../assets/icons";
import PossibilitiesModal from "./PossibilitiesModal";
import Modal from "../../UI/Modal";
import { get, getDatabase, onValue, ref, remove } from "firebase/database";
import { app } from "../../../configs/firebase";

const Possibilities = () => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [posibilities, setPosibilities] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Job");
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectId, setSelectId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState("Job");

  const { role } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const getPosibilitiesData = async () => {
    const db = getDatabase(app);

    const dbRef = ref(db, "studentSpace/possibilities");

    await get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const myData = snapshot.val();

          const temporaryArray = Object.keys(myData)
            .map((myFireId) => ({
              ...myData[myFireId],
              id: myFireId,
            }))

            .filter((posibilities) => posibilities.type === filter);

          setPosibilities(temporaryArray);
        }
        const db = getDatabase(app);

        const usersRef = ref(db, "studentSpace/possibilities");
        onValue(usersRef, (snapshot) => {
          if (snapshot.exists()) {
            const myData = snapshot.val();

            const temporaryArray = Object.keys(myData)
              .map((myFireId) => {
                return { ...myData[myFireId], id: myFireId };
              })
              .filter((posibilities) => posibilities.type === filter);

            setPosibilities(temporaryArray);
          }
        });
      })
      .catch((error) => {
        console.error("Error getting user data:", error);
      });
  };
  useEffect(() => {
    getPosibilitiesData();
  }, [filter]);

  const handleOpenUpdateModal = (id) => {
    setOpenUpdateModal(true);
    setSelectId(id);
  };
  const handleCloseUpdateModal = () => setOpenUpdateModal(false);
  const handleOpenModal = () => setOpenModal((prev) => !prev);

  const handleOpenDeleteModal = (id) => {
    setOpenDeleteModal((prev) => !prev);
    setDeleteId(id);
  };

  const deletePossibilities = async () => {
    const db = getDatabase(app);

    const dbRef = ref(db, `studentSpace/possibilities/` + deleteId);
    await remove(dbRef)
      .then(() => {
        setOpenDeleteModal(false);
        setPosibilities([]);
        getPosibilitiesData();
      })
      .catch(() => {});
  };

  const navigateHandler = (id) => {
    if (role === "ADMIN") {
      navigate(`${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.OPPORTUNITIES}/${id}`);
    } else {
      navigate(`${ROUTES.USER.INDEX}${ROUTES.USER.OPPORTUNITIES}/${id}`);
    }
  };

  const changeSearch = (e) => setSearchQuery(e.target.value);

  const filterByCriteria = (criteria) => {
    setFilter(criteria);
    setActiveFilter(criteria);
  };

  const filteredPosibilities = posibilities?.filter((posibilitie) =>
    posibilitie?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StyledContainer>
      <Typography>Opportunities</Typography>

      <Box className="search-add">
        <Box className="search-container">
          <SearchIcon />

          <input
            value={searchQuery}
            onChange={changeSearch}
            type="text"
            className="search-input"
            placeholder="Search..."
          />
        </Box>

        {role === "ADMIN" && (
          <button className="add-possibilities" onClick={handleOpenModal}>
            + Add possibilities
          </button>
        )}
      </Box>

      <Box className="filter-buttons-container">
        <button
          className={`filter-buttons ${activeFilter === "Job" ? "active" : ""}`}
          onClick={() => filterByCriteria("Job")}
        >
          Job
        </button>
        <button
          className={`filter-buttons ${
            activeFilter === "Internship" ? "active" : ""
          }`}
          onClick={() => filterByCriteria("Internship")}
        >
          Internship
        </button>
        <button
          className={`filter-buttons ${
            activeFilter === "Master's dagree" ? "active" : ""
          }`}
          onClick={() => filterByCriteria("Master's dagree")}
        >
          Master's dagree
        </button>
        <button
          className={`filter-buttons ${
            activeFilter === "Other..." ? "active" : ""
          }`}
          onClick={() => filterByCriteria("Other...")}
        >
          Other...
        </button>
      </Box>

      <Box className="possibilities-container">
        {filteredPosibilities?.map(
          ({ id, title, price, location, experience }) => (
            <Box className="possibilitie">
              <Box className="first-block">
                <Typography className="possibilitie-title">{title}</Typography>

                {role === "ADMIN" && (
                  <span className="action-box">
                    <EditIcon
                      className="edit"
                      onClick={() => handleOpenUpdateModal(id)}
                    />

                    <DeleteIcon
                      className="delete"
                      onClick={() => handleOpenDeleteModal(id)}
                    />
                  </span>
                )}
              </Box>

              <Box className="center-block">
                <Typography className="price">${price}</Typography>

                <span className="city-container">
                  <MarkIcon className="city-icon" />
                  <Typography className="city">{location}</Typography>
                </span>

                <Box className="more-button-container">
                  <button
                    className="more-button"
                    onClick={() => navigateHandler(id)}
                  >
                    More details
                  </button>
                </Box>
              </Box>

              <Box className="experience-container">
                <BagIcon />

                <Typography className="experience">{experience}</Typography>
              </Box>
            </Box>
          )
        )}
      </Box>
      <PossibilitiesModal
        isOpenModal={openModal}
        onClose={handleOpenModal}
        filter={filter}
      />

      <PossibilitiesModal
        isOpenModal={openUpdateModal}
        onClose={handleCloseUpdateModal}
        selectId={selectId}
      />

      <StyledModal open={openDeleteModal} onClose={handleOpenDeleteModal}>
        <Typography className="warm-text">
          Are you sure want to delete ?
        </Typography>

        <Box className="button-box">
          <Button className="cansel-btn" onClick={handleOpenDeleteModal}>
            Cancel
          </Button>

          <Button className="delete-btn" onClick={deletePossibilities}>
            Delete
          </Button>
        </Box>
      </StyledModal>
    </StyledContainer>
  );
};

export default Possibilities;

const StyledContainer = styled(Box)(() => ({
  width: "100%",
  margin: "1rem 2rem 0 25rem",

  "& > .MuiTypography-root": {
    fontSize: "2rem",
    fontWeight: "bold",
    padding: "2rem 0",
    fontFamily: "Prosto One",
  },

  "& > .search-add": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "49px",

    "& > .search-container": {
      height: "36px",
      width: "70%",
      display: "flex",
      gap: "5px",
      alignItems: "center",
      borderRadius: "18px",
      padding: "0 10px",
      backgroundColor: "rgba(196, 196, 196, 0.21)",

      "& > .search-input": {
        border: "none",
        height: "100%",
        width: "100%",
        backgroundColor: "transparent",
        fontSize: "14px",

        "&:focus": {
          outline: "none",
        },
      },
    },

    "& > .add-possibilities": {
      border: "none",
      cursor: "pointer",
      fonrFamily: "Amiko",
      fontSize: "25px",
      height: "30px",
      backgroundColor: "white",
      color: "rgba(115, 100, 100, 0.6)",

      "@media (max-width: 1200px)": {
        fontSize: "20px",
      },
    },
  },

  "& > .filter-buttons-container": {
    marginTop: "28px",
    display: "flex",
    gap: "33px",

    "@media (max-width: 740px)": {
      gap: "25px",
    },

    "@media (max-width: 375px)": {
      gap: "16px",
    },

    "& > .filter-buttons": {
      padding: "5px 15px",
      borderRadius: "15px",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
      backgroundColor: "rgb(196, 196, 196)",

      "@media (max-width: 740px)": {
        fontSize: "12px",
        padding: "5px 10px",
      },

      "@media (max-width: 375px)": {
        fontSize: "10px",
      },
    },

    " & > .filter-buttons.active": {
      backgroundColor: "#575757",
    },
  },

  "& > .possibilities-container": {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "60px",
    width: "97%",

    "& > .possibilitie": {
      width: "100%",
      height: "173px",
      borderRadius: "34px",
      padding: "22px 30px",
      boxShadow: "0 0 16px 1px #a5a5a5",

      // "@media (max-width: 1200px)": {
      //   width: "820px",
      // },

      // "@media (max-width: 900px)": {
      //   width: "700px",
      // },

      // "@media (max-width: 600px)": {
      //   width: "600px",
      // },

      "& > .first-block": {
        display: "flex",
        justifyContent: "space-between",

        "& > .possibilitie-title": {
          fontFamily: "Poppins",
          fontSize: "25px",
          color: "rgb(7, 53, 117)",

          "@media (max-width: 740px)": {
            fontSize: "20px",
          },
        },

        "& > .action-box": {
          display: "flex",
          alignItems: "center",
          gap: "3px",

          "& > .edit": {
            width: "23px",
            height: "23px",
            cursor: "pointer",
          },

          "& > .delete": {
            width: "23px",
            height: "23px",
            cursor: "pointer",
          },
        },
      },

      "& > .center-block": {
        display: "flex",
        alignItems: "center",

        "& > .price": {
          padding: "2px 13px",
          borderRadius: "13.5px",
          fontFamily: "Poppins",
          color: "rgb(7, 53, 117)",
          backgroundColor: "rgba(30, 135, 248, 0.4)",

          "@media (max-width: 740px)": {
            fontSize: "10px",
          },
        },

        "& > .city-container": {
          display: "flex",
          alignItems: "flex-end",
          marginLeft: "100px",

          "& > .city-icon": {
            "@media (max-width: 740px)": {
              width: "15px",
              height: "15px",
            },
          },

          "@media (max-width: 740px)": {
            marginLeft: "50px",
          },

          "@media (max-width: 375px)": {
            marginLeft: "30px",
          },

          "& > .city": {
            color: "rgb(7, 53, 117)",
            "@media (max-width: 740px)": {
              fontSize: "10px",
            },
          },
        },

        "& > .more-button-container": {
          display: "flex",
          width: "67%",
          justifyContent: "flex-end",

          "& > .more-button": {
            border: "none",
            padding: "5px 20px",
            fontFamily: "Amiko",
            fontSize: "23px",
            color: "white",
            cursor: "pointer",
            borderRadius: "22.5px",
            backgroundColor: "rgb(30, 135, 248)",

            "@media (max-width: 950px)": {
              fontSize: "18px",
              padding: "5px 15px",
            },

            "@media (max-width: 815px)": {
              fontSize: "15px",
              padding: "5px 12px",
            },

            "@media (max-width: 740px)": {
              fontSize: "10px",
            },
          },
        },
      },

      "& > .experience-container": {
        display: "flex",
        alignItems: "center",
        gap: "7px",

        "& > .experience": {
          marginTop: "6px",
          fontFamily: "Amiko",
          fontSize: "23px",
          color: "rgb(7, 53, 117)",

          "@media (max-width: 740px)": {
            fontSize: "20px",
          },
        },
      },
    },
  },

  "@media (max-width: 900px)": {
    margin: "1rem 2rem 0 20rem",

    "& > .title": {
      fontSize: "30px",
    },
  },

  "@media (max-width: 600px)": {
    margin: "1rem 2rem 0 14rem",

    "& > .title": {
      fontSize: "25px",
    },
  },

  "@media (max-width: 375px)": {
    margin: "1rem 2rem 0 0",
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
