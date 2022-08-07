import TextEditor from "./pages/TextEditor";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import Login from "./pages/Login";
import "./app.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} /> */}
        <Route path="/" element={<Navigate replace to={`/login`} />} />
        <Route path="/documents/:id" element={<TextEditor />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
