import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LandingPage from "./screens/LandingPage/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MyNotes from "./screens/MyNotes/MyNotes";
import CreateNote from "./screens/CreateNote/CreateNote";
import EditNote from "./screens/EditNote/EditNote";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" Component={LandingPage} />
        <Route path="/mynotes" Component={MyNotes} />
        <Route path="/create-note" Component={CreateNote} />
        <Route path="/note/:id" Component={EditNote} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
