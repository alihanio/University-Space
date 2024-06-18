import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { store } from "./store/store";
import "./configs/firebase";
import { LocalizationProvider } from "@mui/x-date-pickers";
import EventsModal from "./components/admin/events/EventsModal";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />

      <EventsModal />
    </LocalizationProvider>
  </Provider>
);
