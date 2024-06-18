import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { get, getDatabase, ref } from "firebase/database";
import { Box, Typography, styled } from "@mui/material";
import { BagIcon, MarkIcon } from "../../../assets/icons";

const InnerPossibilities = () => {
  const [innerData, setInnerData] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();

      const dbRef = ref(db, "studentSpace/possibilities/" + id);

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

  const goBack = () => window.history.back();

  return (
    <StyledContainer>
      <KeyboardBackspaceOutlinedIcon onClick={goBack} className="go-back" />

      <Box className="box">
        <Box className="inner-box">
          <Typography variant="h1" className="title">
            {innerData?.title}
          </Typography>

          <Box className="location-box">
            <MarkIcon className="mark-icon" />
            <Typography className="location">{innerData?.location}</Typography>
          </Box>

          <Box className="experience-box">
            <BagIcon className="bag-icon" />

            <Typography className="experience">
              {innerData?.experience}
            </Typography>
          </Box>

          <Typography className="description">
            {innerData?.description}
          </Typography>

          <Box className="price-box">
            <Typography className="price">${innerData?.price}</Typography>
          </Box>
        </Box>
      </Box>
    </StyledContainer>
  );
};

export default InnerPossibilities;

const StyledContainer = styled(Box)(() => ({
  margin: "0 2rem 0 25rem",
  height: "95vh",
  width: "100%",

  "& > .go-back": {
    position: "absolute",
    top: "20px",
    cursor: "pointer",
  },

  "& > .box": {
    display: "flex",
    alignItems: "center",
    height: "100%",

    "& > .inner-box": {
      width: "95%",
      padding: "25px 25px 20px 50px",
      boxShadow: "0 0 16px 1px #a5a5a5",
      borderRadius: "34px",

      "@media (max-width:600px)": {
        padding: "15px 15px 15px 15px",
      },

      "& > .title": {
        fontSize: "35px",
        fontFamily: "Poppins",
        color: "rgb(7, 53, 117)",

        "@media (max-width: 900px)": {
          fontSize: "30px",
        },

        "@media (max-width:600px)": {
          fontSize: "20px",
        },
      },

      "& > .location-box": {
        display: "flex",
        marginTop: "5px",
        alignItems: "flex-end",

        "& > .mark-icon": {
          width: "40px",
          height: "61px",

          "@media (max-width: 900px)": {
            width: "40px",
            height: "40px",
          },

          "@media (max-width:600px)": {
            width: "20px",
            height: "20px",
          },
        },

        "& > .location": {
          fontSize: "23px",
          color: "rgb(7, 53, 117)",

          "@media (max-width: 900px)": {
            fontSize: "20px",
          },

          "@media (max-width:600px)": {
            fontSize: "13px",
          },
        },
      },

      "& > .experience-box": {
        display: "flex",
        gap: "5px",
        alignItems: "flex-end",
        marginTop: "30px",

        "& > .bag-icon": {
          marginBottom: "7px",

          "@media (max-width:600px)": {
            width: "20px",
            height: "20px",
            marginBottom: "3px",
          },
        },

        "& > .experience": {
          fontFamily: "Amiko",
          fontSize: "23px",
          color: "rgb(7, 53, 117)",

          "@media (max-width: 900px)": {
            fontSize: "20px",
          },

          "@media (max-width:600px)": {
            fontSize: "13px",
          },
        },
      },

      "& > .description": {
        marginTop: "10px",
        fontSize: "17px",
        fontFamily: "Amiko",
        color: "rgb(7, 53, 117)",

        "@media (max-width:600px)": {
          fontSize: "13px",
        },
      },

      "& > .price-box": {
        display: "flex",
        marginTop: "10px",
        justifyContent: "flex-end",

        "& > .price": {
          padding: "0 22px",
          borderRadius: "12.5px",
          fontSize: "25px",
          fontFamily: "Poppins",
          color: "rgb(7, 53, 117)",
          backgroundColor: "rgba(30, 135, 248, 0.4)",

          "@media (max-width: 900px)": {
            fontSize: "20px",
          },

          "@media (max-width:600px)": {
            fontSize: "15px",
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
