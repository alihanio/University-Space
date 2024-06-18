import { Fragment, useState } from "react";
import {
  Collapse,
  Divider,
  List,
  ListItemButton,
  Typography,
  styled,
} from "@mui/material";
import { PlusIcon } from "../../assets/icons";
import { QUESTIONS } from "../../utils/constants";

const Questions = () => {
  const [expanded, setExpanded] = useState(null);

  const expandClickHandler = (i) =>
    setExpanded((prev) => (prev === i ? null : i));

  return (
    <StyledList className="list">
      <Typography variant="h2" className="title">
        Questions
      </Typography>

      {QUESTIONS.map(({ question, answer }, i) => (
        <Fragment key={question}>
          <Divider className="divider" />

          <ListItemButton onClick={() => expandClickHandler(i)}>
            <Typography className="question">{question}</Typography>

            <StyledPlus
              alt="plus"
              rotated={expanded === i ? i : null}
              index={i}
            />
          </ListItemButton>

          <Collapse in={expanded === i} unmountOnExit>
            <Typography className="answer">{answer}</Typography>
          </Collapse>
        </Fragment>
      ))}

      <Divider className="divider" />
    </StyledList>
  );
};

export default Questions;

const StyledList = styled(List)(() => ({
  width: "100%",

  "& > .title": {
    color: "white",
    fontSize: "2.5rem",
    fontWeight: 700,
    lineHeight: "3.1875rem",
    margin: "0 0 0 30px",
  },

  "& > .divider": {
    background: "#4A4A4A",
    margin: "2.12rem",
  },

  "& .question": {
    color: "white",
    fontSize: "1.25rem",
    fontWeight: "600",
    margin: "1rem",
    width: "30%",
    flexGrow: 1,
  },

  "& .answer": {
    color: "white",
    fontSize: "1.125rem",
    fontWeight: "300",
    width: "auto",
    margin: "0 2rem",
    fontFamily: "Poppins",
  },

  "@media (max-width: 1200px)": {
    "& > .title": {
      fontSize: "2.25rem",
      lineHeight: "3rem",
    },

    "& > .divider": {
      margin: "2rem",
    },

    "& .question": {
      fontSize: "1.25rem",
    },

    "& .answer": {
      fontSize: "1.125rem",
    },
  },

  "@media (max-width: 910px)": {
    "& > .title": {
      fontSize: "2rem",
      lineHeight: "2.75rem",
    },

    "& > .divider": {
      margin: "1.75rem",
    },

    "& .question": {
      fontSize: "1rem",
    },

    "& .answer": {
      fontSize: "1rem",
    },
  },

  "@media (max-width: 610px)": {
    "& > .title": {
      fontSize: "1.75rem",
      lineHeight: "2.5rem",
    },

    "& > .divider": {
      margin: "1.50rem",
    },

    "& .question": {
      fontSize: "0.9rem",
    },

    "& .answer": {
      fontSize: "0.9rem",
    },
  },

  "@media (max-width: 375px)": {
    "& > .title": {
      fontSize: "1.5rem",
      lineHeight: "2.25rem",
    },

    "& > .divider": {
      margin: "1.25rem",
    },

    "& .question": {
      fontSize: "0.7rem",
    },

    "& .answer": {
      fontSize: "0.7rem",
    },
  },
}));

const StyledPlus = styled(PlusIcon)(({ rotated, index }) => ({
  cursor: "pointer",
  transform: `rotate(${rotated === index ? "45deg" : "0"})`,
  transition: "transform 0.3s ease",
  marginRight: "1rem",
  width: "1.75rem",
  height: "1.75rem",

  "@media (max-width: 910px)": {
    width: "1.50rem",
    height: "1.50rem",
  },

  "@media (max-width: 610px)": {
    width: "1.25rem",
    height: "1.25rem",
  },

  "@media (max-width: 375px)": {
    width: "1rem",
    height: "1rem",
  },
}));
