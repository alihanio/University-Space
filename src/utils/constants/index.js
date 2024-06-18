import { ROUTES } from "../../routes/routes";
import {
  AndreyImage,
  AnnaImage,
  BobImage,
  KatyImage,
  MigaleImage,
  NataliaImage,
} from "../../assets/images";

const ABOUT_US_DATA = [
  {
    key: 1,
    title: "News",
    description:
      "Stay up to date with all the events that happen in the student community",
  },

  {
    key: 2,
    title: "Planning",
    description: "Improve your efficiency by optimizing your task flow",
  },

  {
    key: 3,
    title: "Questions",
    description: "Leave a request and get answers to your questions",
  },

  {
    key: 4,
    title: "Networking",
    description:
      "Connect with other students, expand your horizons and find like-minded people",
  },

  {
    key: 5,
    title: "Events",
    description: "Join interesting events and enrich your experience",
  },

  {
    key: 6,
    title: "Opportunities",
    description:
      "Look for vacancies and other opportunities that match your interests and career ambitions",
  },
];

const QUESTIONS = [
  {
    question: "What programs are offered at your university?",
    answer:
      "Our university offers a wide range of programs across various disciplines including arts, sciences, engineering, business, and more. You can explore our program offerings on our website or contact our admissions office for detailed information.",
  },

  {
    question: "How can I apply for admission to your university?",
    answer:
      "To apply for admission, you can visit our university website and navigate to the admissions section. There, you will find detailed instructions on the application process, including the required documents and deadlines. If you have any specific questions or need assistance, feel free to reach out to our admissions team.",
  },

  {
    question: "What scholarships or financial aid options are available?",
    answer:
      "Our university offers various scholarships and financial aid options to support students in their academic journey. These may include merit-based scholarships, need-based grants, work-study programs, and more. We encourage you to explore our financial aid resources on our website or contact our financial aid office for personalized assistance.",
  },

  {
    question: "Can international students apply to your university?",
    answer:
      "Yes, we welcome applications from international students. Our university values diversity and strives to create an inclusive environment for all students. International applicants can find specific admission requirements and guidelines on our website or reach out to our international admissions office for support.",
  },

  {
    question: "How can I schedule a campus tour or visit?",
    answer:
      "You can schedule a campus tour or visit by contacting our admissions office directly. We offer guided tours led by knowledgeable staff members who can provide insights into campus life, academic programs, and facilities. Visiting our campus is a great way to experience our vibrant community firsthand.",
  },
];

const FEEDBACKS = [
  {
    id: 1,
    fullName: "Natalia Lobodyanskaya",
    text: "The learning process is organized as efficiently and conveniently as possible. The timing and form of training makes the course more accessible to everyone. This allows you to work out at your own pace without any unnecessary stress or time pressure.",
    image: NataliaImage,
    fullNameColor: "white",
    textColor: "white",
    background: "rgb(0, 0, 0)",
  },

  {
    id: 2,
    fullName: "Natalia Lobodyanskaya",
    text: "The learning process is organized as efficiently and conveniently as possible. The timing and form of training makes the course more accessible to everyone. This allows you to work out at your own pace without any unnecessary stress or time pressure.",
    image: NataliaImage,
    fullNameColor: "rgb(0, 0, 0)",
    textColor: "rgb(0, 0, 0)",
    background: "rgb(169, 167, 177)",
  },

  {
    id: 3,
    fullName: "Natalia Lobodyanskaya",
    text: "The learning process is organized as efficiently and conveniently as possible. The timing and form of training makes the course more accessible to everyone. This allows you to work out at your own pace without any unnecessary stress or time pressure.",
    image: NataliaImage,
    fullNameColor: "white",
    textColor: "white",
    background: "rgb(0, 0, 0)",
  },

  {
    id: 4,
    fullName: "Natalia Lobodyanskaya",
    text: "The learning process is organized as efficiently and conveniently as possible. The timing and form of training makes the course more accessible to everyone. This allows you to work out at your own pace without any unnecessary stress or time pressure.",
    image: NataliaImage,
    fullNameColor: "rgb(0, 0, 0)",
    textColor: "rgb(0, 0, 0)",
    background: "rgb(169, 167, 177)",
  },

  {
    id: 5,
    fullName: "Natalia Lobodyanskaya",
    text: "The learning process is organized as efficiently and conveniently as possible. The timing and form of training makes the course more accessible to everyone. This allows you to work out at your own pace without any unnecessary stress or time pressure.",
    image: NataliaImage,
    fullNameColor: "white",
    textColor: "white",
    background: "rgb(0, 0, 0)",
  },

  {
    id: 6,
    fullName: "Natalia Lobodyanskaya",
    text: "The learning process is organized as efficiently and conveniently as possible. The timing and form of training makes the course more accessible to everyone. This allows you to work out at your own pace without any unnecessary stress or time pressure.",
    image: NataliaImage,
    fullNameColor: "rgb(0, 0, 0)",
    textColor: "rgb(0, 0, 0)",
    background: "rgb(169, 167, 177)",
  },
];

const POSSIBILITIES = [
  {
    id: 1,
    title: "Fullstack web-developer (Laravel + Vue JS)",
    price: "50 000 c",
    location: "Bishkek",
    experience: "Work experience from 3 to 6 years",
    description:
      "Requirements. Basic knowledge of front-end technologies: HTML, CSS, JavaScript. Typically, some experience with at least one JS framework is required. Naturally, the most popular ones are jQuery/Angular/React.js/Vue.js. Experience working in one of the server-side languages ​​- PHP, Python, Ruby. But Node.js is almost never found in the requirements for junior vacancies. Understanding of the basics of relational (MySQL, PostgreSQL) databases. NoSQL databases are usually not found in such vacancies. Experience with Git (90% of all vacancies). Classic - understanding of OOP principles and design patterns.",
  },
];

const NETWORKING = [
  {
    id: 1,
    fullName: "Bob",
    status: "Студент(-a) Student Space",
    image: BobImage,
  },

  {
    id: 2,
    fullName: "Migale",
    status: "Студент(-a) Student Space",
    image: MigaleImage,
  },

  {
    id: 3,
    fullName: "Anna",
    status: "Студент(-a) Student Space",
    image: AnnaImage,
  },

  {
    id: 4,
    fullName: "Katy",
    status: "Студент(-a) Student Space",
    image: KatyImage,
  },

  {
    id: 5,
    fullName: "Andrey",
    status: "Студент(-a) Student Space",
    image: AndreyImage,
  },
];

const PROFILE_DATA = [
  {
    id: 1,
    image: BobImage,
    followers: 1026,
    following: 56,
    firstName: "Bob",
    lastName: "",
    dateOfBirth: "21.01.2001",
    university: "Student Space",
    email: "bob@gmail.com",
    description: "Hello my friends:)",
  },

  {
    id: 2,
    image: MigaleImage,
    followers: 1026,
    following: 56,
    firstName: "Miguel",
    lastName: "",
    dateOfBirth: "21.01.2001",
    university: "Student Space",
    email: "miguel@gmail.com",
    description: "Hello my friends:)",
  },

  {
    id: 3,
    image: AnnaImage,
    followers: 1026,
    following: 56,
    firstName: "Anna",
    lastName: "",
    dateOfBirth: "21.01.2001",
    university: "Student Space",
    email: "anna@gmail.com",
    description: "Hello my friends:)",
  },

  {
    id: 4,
    image: KatyImage,
    followers: 1026,
    following: 56,
    firstName: "Katy",
    lastName: "",
    dateOfBirth: "21.01.2001",
    university: "Student Space",
    email: "katy@gmail.com",
    description: "Hello my friends:)",
  },

  {
    id: 5,
    image: AndreyImage,
    followers: 1026,
    following: 56,
    firstName: "Andrey",
    lastName: "",
    dateOfBirth: "21.01.2001",
    university: "Student Space",
    email: "andrey@gmail.com",
    description: "Hello my friends:)",
  },
];

const FAKE_EVENTS = [
  {
    id: 1,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Desert_Electric.jpg/1200px-Desert_Electric.jpg",
    date: "2024-04-24",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },

  {
    id: 2,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Desert_Electric.jpg/1200px-Desert_Electric.jpg",
    date: "2024-04-24",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },

  {
    id: 3,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Desert_Electric.jpg/1200px-Desert_Electric.jpg",
    date: "2024-04-10",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },

  {
    id: 4,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Desert_Electric.jpg/1200px-Desert_Electric.jpg",
    date: "2024-04-20",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },

  {
    id: 5,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Desert_Electric.jpg/1200px-Desert_Electric.jpg",
    date: "2024-4-14",
    title: "Бермет",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },

  {
    id: 6,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Desert_Electric.jpg/1200px-Desert_Electric.jpg",
    date: "2024-4-24",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },

  {
    id: 7,
    image:
      "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
    date: "2024-04-24",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinnыer"],
  },

  {
    id: 8,
    image:
      "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
    date: "2024-04-24",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },

  {
    id: 9,
    image:
      "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
    date: "2024-04-24",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },
  {
    id: 10,
    image:
      "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
    date: "2024-04-24",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinnыer"],
  },

  {
    id: 11,
    image:
      "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
    date: "2024-04-24",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },

  {
    id: 12,
    image:
      "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
    date: "2024-04-24",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },
  {
    id: 13,
    image:
      "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
    date: "2024-04-26",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinnыer"],
  },

  {
    id: 14,
    image:
      "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
    date: "2024-04-26",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },

  {
    id: 15,
    image:
      "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
    date: "2024-04-26",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },
  {
    id: 16,
    image:
      "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
    date: "2024-04-24",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinnыer"],
  },

  {
    id: 17,
    image:
      "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
    date: "2024-04-24",
    title: "bermet",
    startTime: "10:00",
    events: ["breakfast", "lunch", "dinner"],
    tags: ["breakfast", "lunch", "dinner"],
  },
];

const SPACE = [
  {
    id: 1,
    title: "Mathematics",
  },

  {
    id: 2,
    title: "Machine learning",
  },

  {
    id: 3,
    title: "Introduction to Programming",
  },

  {
    id: 4,
    title: "Creative",
  },
];

const USER_NAVIGATIONS = [
  { text: "News", to: `${ROUTES.USER.INDEX}${ROUTES.USER.NEWS}` },
  { text: "Space", to: `${ROUTES.USER.INDEX}${ROUTES.USER.SPACE}` },
  { text: "Networking", to: `${ROUTES.USER.INDEX}${ROUTES.USER.NETWORKING}` },
  { text: "Planning", to: `${ROUTES.USER.INDEX}${ROUTES.USER.PLANNING}` },
  { text: "Events", to: `${ROUTES.USER.INDEX}${ROUTES.USER.EVENTS}` },
  { text: "Chats", to: `${ROUTES.USER.INDEX}${ROUTES.USER.CHATS}` },
  {
    text: "Opportunities",
    to: `${ROUTES.USER.INDEX}${ROUTES.USER.OPPORTUNITIES}`,
  },
];

const ADMIN_NAVIGATIONS = [
  { text: "News", to: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.NEWS}` },
  { text: "Networking", to: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.NETWORKING}` },
  { text: "Planning", to: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.PLANNING}` },
  { text: "Events", to: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.EVENTS}` },
  {
    text: "Opportunities",
    to: `${ROUTES.ADMIN.INDEX}${ROUTES.ADMIN.OPPORTUNITIES}`,
  },
];

const EVENT_IMAGE =
  "data:image/jpeg;base64,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";

export {
  ABOUT_US_DATA,
  QUESTIONS,
  FEEDBACKS,
  NETWORKING,
  PROFILE_DATA,
  SPACE,
  USER_NAVIGATIONS,
  ADMIN_NAVIGATIONS,
  FAKE_EVENTS,
  EVENT_IMAGE,
  POSSIBILITIES,
};
