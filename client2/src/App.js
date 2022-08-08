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
import { useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [ globalUsername, setGlobalUsername ] = useState("");
  const [ globalDocumentID, setGlobalDocumentID ] = useState("");

  return (
    <ErrorBoundary>
      <UserContext.Provider
        value={{
          globalUsername,
          setGlobalUsername,
          globalDocumentID,
          setGlobalDocumentID,
        }}
      >
        <Router>
          <Routes>
            {/* <Route path="/" element={<Navigate to={`/documents/${uuidV4()}`} />} /> */}
            <Route path="/" element={<Navigate replace to={`/login`} />} />
            <Route path="/documents/:id" element={<TextEditor />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
