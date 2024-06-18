import Feedbacks from "../../components/landing/Feedbacks";
import AboutUs from "../../components/landing/AboutUs";
import Collage from "../../components/landing/Collage";
import Intro from "../../components/landing/Intro";
import Header from "../../layout/Header";
import Footer from "../../layout/Footer";

const Home = () => (
  <>
    <Header />
    <Intro />
    <AboutUs />
    <Collage />
    <Feedbacks />
    <Footer />
  </>
);

export default Home;
