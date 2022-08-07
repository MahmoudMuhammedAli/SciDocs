import TextEditor from "./pages/TextEditor";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import Login from "./pages/Login";
import "./index.css";
import { UserContext } from "./context/UserContext";
function App() {
  return (
    <UserContext.Provider value={{ username: "" }}>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} /> */}
          <Route path="/" element={<Navigate replace to={`/login`} />} />
          <Route path="/documents/:id" element={<TextEditor />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
