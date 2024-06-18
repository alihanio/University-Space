import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get, getDatabase, ref } from "firebase/database";
import { Box, styled, Typography } from "@mui/material";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";

const EventsInner = () => {
  const [innerData, setInnerData] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();

      const dbRef = ref(db, "studentSpace/events/" + id);

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
    <StyledContainer backgroundimage={innerData?.image}>
      <Box className="first-block">
        <Typography onClick={goBack}>
          <KeyboardBackspaceOutlinedIcon />
        </Typography>

        <Box>
          <Typography variant="h3">{innerData?.title}</Typography>
        </Box>
      </Box>

      <Typography>{innerData?.description}</Typography>
    </StyledContainer>
  );
};

export default EventsInner;

const StyledContainer = styled(Box)(({ backgroundimage }) => ({
  padding: "2rem",
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  marginLeft: "21rem",

  "& > .first-block": {
    "& > div": {
      backgroundImage: `url(${backgroundimage})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
      borderRadius: "1.25rem",
      width: "60rem",
      height: "15rem",
      backgroundSize: "cover",
      backgroundPosition: "center",

      "& > h3": {
        alignSelf: "end",
        color: "#FFFFFF",
        fontSize: "2.5rem",
        fontWeight: "600",
        marginBottom: "1.3rem",
      },
    },
  },

  "@media (max-width: 900px)": {
    marginLeft: "20rem",

    "& > .first-block": {
      "& > div": {
        gap: "0",
        width: "32rem",
      },
    },
  },

  "@media (max-width: 600px)": {
    marginLeft: "12rem",

    "& > .first-block": {
      "& > div": {
        gap: "0",
        width: "21rem",
      },
    },
  },

  "@media (max-width: 375px)": {
    marginLeft: "0rem",

    "& > .first-block": {
      "& > div": {
        gap: "0",
        width: "14rem",
      },
    },
  },
}));
