import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { get, getDatabase, ref } from "firebase/database";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import { Box, Typography, styled } from "@mui/material";

const InnerNews = () => {
  const [innerData, setInnerData] = useState(null);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();

      const dbRef = ref(db, "studentSpace/news/" + id);

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

  const handleGoBack = () => navigate(-1);

  return (
    <StyledContainer>
      <KeyboardBackspaceOutlinedIcon
        onClick={handleGoBack}
        className="go-back"
      />

      <Typography className="title">{innerData?.title}</Typography>
      <Typography className="date">{innerData?.date}</Typography>

      <img className="image" src={innerData?.imageUrl} alt="img" />

      <Typography className="description">{innerData?.description}</Typography>
    </StyledContainer>
  );
};

export default InnerNews;

const StyledContainer = styled(Box)(() => ({
  padding: "3rem 0rem 0rem 3rem",
  paddingLeft: "23.875rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  width: "100%",

  "& > .go-back": {
    position: "absolute",
    top: "1rem",
    left: "23.875rem",
    cursor: "pointer",
    fontSize: "2rem",
  },

  "& > .title": {
    color: "rgb(2, 2, 2)",
    fontSize: "2rem",
    fontWeight: 500,
    lineHeight: "3.1875rem",
    textAlign: "center",
  },

  "& > .date": {
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.063rem",
    color: "rgb(169, 167, 177)",
    textAlign: "center",
  },

  "& > .image": {
    width: "26.75rem",
    height: "14.5rem",
    borderRadius: "1rem",
    marginTop: "2%",
  },

  "& > .description": {
    width: "80%",
    minWidth: "80%",
    marginTop: "5%",
    fontSize: "0.813rem",
    fontWeight: "400",
    lineHeight: "1.25rem",
    color: "rgb(62, 61, 68)",
  },

  "@media (max-width: 1200px)": {
    padding: "3rem 0rem 0rem 3rem",
    paddingLeft: "23.875rem",

    "& > .image": {
      width: "22.75rem",
      height: "12.5rem",
    },
  },

  "@media (max-width: 900px)": {
    padding: "3rem 0rem 0rem 3rem",
    paddingLeft: "16.875rem",

    "& > .title": {
      fontSize: "1.7rem",
      lineHeight: "2.9rem",
    },

    "& > .date": {
      fontSize: "0.8rem",
      lineHeight: "0.9rem",
    },

    "& > .go-back": {
      left: "20.875rem",
      fontSize: "1.5rem",
    },

    "& > .image": {
      width: "22.75rem",
      height: "12.5rem",
    },
  },

  "@media (max-width: 750px)": {
    "& > .image": {
      width: "16.75rem",
      height: "8.5rem",
    },
  },

  "@media (max-width: 600px)": {
    padding: "3rem 0rem 0rem 3rem",
    paddingLeft: "10.875rem",

    "& > .title": {
      fontSize: "1.4rem",
      lineHeight: "2.5rem",
    },

    "& > .description": {
      width: "80%",
      fontSize: "0.713rem",
      lineHeight: "1.15rem",
    },

    "& > .date": {
      fontSize: "0.6rem",
      lineHeight: "0.9rem",
    },

    "& > .go-back": {
      left: "13.875rem",
    },

    "& > .image": {
      width: "10.75rem",
      height: "6.5rem",
    },
  },

  "@media (max-width: 375px)": {
    padding: "3rem 0rem 0rem 0rem",
    paddingLeft: "0rem",

    "& > .title": {
      fontSize: "1.4rem",
      lineHeight: "2.5rem",
    },

    "& > .description": {
      width: "80%",
      fontSize: "0.613rem",
      lineHeight: "0.9rem",
    },

    "& > .date": {
      fontSize: "0.6rem",
      lineHeight: "0.9rem",
    },

    "& > .go-back": {
      left: "0.875rem",
      fontSize: "1.2rem",
    },

    "& > .image": {
      width: "10.75rem",
      height: "6.5rem",
    },
  },
}));
