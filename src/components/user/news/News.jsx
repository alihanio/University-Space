import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, getDatabase, onValue, ref } from "firebase/database";
import { Box, Typography, styled } from "@mui/material";
import { ROUTES } from "../../../routes/routes";
import { app } from "../../../configs/firebase";

const News = () => {
  const [news, setNews] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getNewsData = async () => {
      const db = getDatabase(app);

      const dbRef = ref(db, "studentSpace/news");

      await get(dbRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const myData = snapshot.val();

            const temporaryArray = Object.keys(myData).map((myFireId) => {
              return { ...myData[myFireId], newsId: myFireId };
            });

            setNews(temporaryArray);
          }
        })
        .catch((error) => {
          console.error("Error getting news data:", error);

          alert("Error fetching news data");
        });
    };
    getNewsData();

    const db = getDatabase(app);
    const usersRef = ref(db, "studentSpace/news");
    onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const myData = snapshot.val();
        const temporaryArray = Object.keys(myData).map((myFireId) => {
          return { ...myData[myFireId], newsId: myFireId };
        });

        setNews(Object?.values(temporaryArray));
      }
    });
  }, []);

  const shortenDescription = (description) => {
    const sentences = description.split(/[.!?]/);

    const words = description.split(/\s+/);

    let abbreviatedDescription = "";

    if (sentences.length > 3) {
      abbreviatedDescription = sentences.slice(0, 3).join(". ") + "...";
    } else if (words.length > 40) {
      abbreviatedDescription = words.slice(0, 40).join(" ") + "...";
    } else {
      abbreviatedDescription = description;
    }

    return abbreviatedDescription;
  };

  const handleInnerPage = (newsId) =>
    navigate(`${ROUTES.USER.INDEX}${ROUTES.USER.NEWS}/${newsId}`);

  return (
    <StyledContsiner>
      <Box className="container">
        <Typography>NEWS</Typography>

        <Box className="news-container">
          {news?.map(({ newsId, imageUrl, title, date, description }) => (
            <Box
              className="news-box"
              key={newsId}
              onClick={() => handleInnerPage(newsId)}
            >
              <img className="news-img" src={imageUrl} alt="img" />

              <Box className="information-box">
                <Typography className="title">{title}</Typography>
                <Typography className="date">{date}</Typography>
                <Typography className="description">
                  {shortenDescription(description)}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </StyledContsiner>
  );
};

export default News;

const StyledContsiner = styled(Box)(() => ({
  width: "100%",

  "& > .container": {
    margin: "1rem 2rem 0 25rem",

    "& > .MuiTypography-root": {
      fontSize: "2rem",
      fontWeight: "bold",
      padding: "2rem 0",
      fontFamily: "Prosto One",
    },

    "& > .news-container": {
      marginTop: "3%",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",

      "& > .news-box": {
        width: "94%",
        display: "flex",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        borderRadius: "0.5rem",
        padding: "0.688rem 0rem 0.688rem 0.688rem",
        cursor: "pointer",

        "& > .news-img": {
          width: "18.75rem",
          height: "10.5rem",
          borderRadius: "1rem",
        },

        "& > .information-box": {
          padding: "0.5rem",
          width: "80%",

          "& > .title": {
            fontSize: "1.563rem",
            fontWeight: "400",
            lineHeight: "2.375rem",
            color: "rgb(2, 2, 2)",
          },

          "& > .date": {
            fontSize: "0.688rem",
            fontWeight: "400",
            lineHeight: "1.063rem",
            color: "rgb(169, 167, 177)",
          },

          "& > .description": {
            fontSize: "0.813rem",
            fontWeight: "400",
            lineHeight: "1.25rem",
            color: "rgb(62, 61, 68)",
            marginTop: "1%",
          },
        },
      },
    },

    "@media (max-width: 1200px)": {
      marginLeft: "23.875rem",
    },

    "@media (max-width: 910px)": {
      marginLeft: "19.875rem",
    },

    "@media (max-width: 725px)": {
      marginLeft: "19.875rem",

      "& > .news-container": {
        "& > .news-box": {
          display: "flex",
          flexDirection: "column",
          padding: "0.688rem 0rem 0rem 0.688rem",

          "& > .news-img": {
            width: "94%",
          },

          "& > .information-box": {
            padding: "0.5rem",
            width: "94%",
          },
        },
      },
    },

    "@media (max-width: 600px)": {
      marginLeft: "13.875rem",
    },
    "@media (max-width: 375px)": {
      marginLeft: "0rem",

      "& > .news-container": {
        "& > .news-box": {
          "& > .information-box": {
            "& > .title": {
              fontSize: "1.363rem",
              fontWeight: "400",
              lineHeight: "2.075rem",
            },

            "& > .description": {
              fontSize: "0.613rem",
              lineHeight: "1rem",
            },
          },
        },
      },
    },
  },
}));
