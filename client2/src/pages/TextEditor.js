import React, { useCallback, useEffect, useMemo, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import "../styles.css";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { v4 as uuidV4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { AvatarGenerator } from "random-avatar-generator";

const SAVE_INTERVAL_MS = 2000;
const ALERTS_TTL = 1000;
const TOOLBAR_OPTIONS = [
  [ { header: [ 1, 2, 3, 4, 5, 6, false ] } ],
  [ { font: [] } ],
  [ { list: "ordered" }, { list: "bullet" } ],
  [ "bold", "italic", "underline" ],
  [ { color: [] }, { background: [] } ],
  [ { script: "sub" }, { script: "super" } ],
  [ { align: [] } ],
  [ "image", "blockquote", "code-block" ],
  [ "clean" ],
];

export default function TextEditor() {
  const generator = useMemo(() => new AvatarGenerator(), []);
  const { globalUsername, updateGlobalDocumentID } = useContext(UserContext);
  const { id: documentId } = useParams();
  const [ socket, setSocket ] = useState();
  const [ quill, setQuill ] = useState();
  const [ showConnectedAlert, setShowConnectedAlert ] = useState();
  const [ showDisconnectedAlert, setShowDisconnectedAlert ] = useState();
  const [ showIncomingUserAlert, setShowIncomingUserAlert ] = useState();
  const [ showRoomDetails, setShowRoomDetails ] = useState(false);
  const [ incomingUser, setIncomingUser ] = useState();
  const [ connectedUsers, setConnectedUsers ] = useState([
    {
      username: globalUsername,
      avatar: generator.generateRandomAvatar(globalUsername),
    },
  ]);
  const openConnectedAlert = () => {
    setShowConnectedAlert(true);
    setTimeout(() => {
      setShowConnectedAlert(false);
    }, ALERTS_TTL);
  };
  const openDisconnectedAlert = () => {
    setShowDisconnectedAlert(true);
    setTimeout(() => {
      setShowDisconnectedAlert(false);
    }, ALERTS_TTL);
  };
  const openIncomingUserAlert = (user) => {
    setIncomingUser(user);
    setShowIncomingUserAlert(true);
    setTimeout(() => {
      setShowIncomingUserAlert(false);
    }, ALERTS_TTL + 3000);
  };

  let navigate = useNavigate();

  useEffect(
    () => {
      updateGlobalDocumentID(documentId);
      if (!globalUsername) {
        navigate("/login");
      }
    },
    [ documentId, globalUsername, navigate, updateGlobalDocumentID ]
  );
  useEffect(() => {
    const s = io("https://scidox.herokuapp.com/");
    // const s = io("http://localhost:3002/");
    setSocket(s);
    console.log("connected to socket");
    openConnectedAlert();
    return () => {
      s.disconnect();
      openDisconnectedAlert();
    };
  }, []);

  useEffect(
    () => {
      if (socket == null || quill == null) return;
      socket.once("load-document", (document) => {
        quill.setContents(document);
        quill.enable();
      });

      socket.emit("get-document", documentId, globalUsername);
    },
    [ socket, quill, documentId, globalUsername ]
  );

  useEffect(
    () => {
      if (socket == null || quill == null) return;

      socket.on("user-joined-current-room", (user) => {
        console.log(user + " joined the room");
        openIncomingUserAlert(user);
      });

      return () => {
        socket.off("user-joined-current-room");
      };
    },
    [ socket, quill, connectedUsers, generator ]
  );
  useEffect(
    () => {
      if (socket == null) return;

      const interval = setInterval(() => {
        socket.emit("get-users", documentId);
      }, SAVE_INTERVAL_MS);
      socket.on("current-users", (users) => {
        // user will look something like this ["user1", "user1", "user1" , "user2", "user3"]. We want to remove duplicates and sort the array.
        const uniqueUsers = [ ...new Set(users) ].sort();
        // create an array of objects on the template of { username: "", avatar: generator.generateRandomAvatar(user) }
        console.log(uniqueUsers);
        const x = uniqueUsers.map((user) => ({
          name: user,
          avatar: generator.generateRandomAvatar(user),
        }));
        setConnectedUsers(x);
      });
      console.log("connected", connectedUsers);

      return () => {
        clearInterval(interval);
        socket.off("current-users");
      };
    },
    [ socket, connectedUsers, generator, documentId, globalUsername ]
  );
  useEffect(
    () => {
      if (socket == null || quill == null) return;

      const interval = setInterval(() => {
        socket.emit("save-document", quill.getContents());
      }, SAVE_INTERVAL_MS);

      return () => {
        clearInterval(interval);
      };
    },
    [ socket, quill ]
  );

  useEffect(
    () => {
      if (socket == null || quill == null) return;

      const handler = (delta) => {
        quill.updateContents(delta);
      };
      socket.on("receive-changes", handler);

      return () => {
        socket.off("receive-changes", handler);
      };
    },
    [ socket, quill ]
  );

  useEffect(
    () => {
      if (socket == null || quill == null) return;

      const handler = (delta, oldDelta, source) => {
        if (source !== "user") return;
        socket.emit("send-changes", delta);
      };
      quill.on("text-change", handler);

      return () => {
        quill.off("text-change", handler);
      };
    },
    [ socket, quill ]
  );

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);
  return (
    <React.Fragment>
      <div className="container w-screen" ref={wrapperRef} />
      <div
        className={`alert alert-warning shadow-lg sticky bottom-0 transition ${showIncomingUserAlert
          ? "opacity-100"
          : "opacity-0"}`}
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current flex-shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="">
            {" "}
            <span className="font-bold">{incomingUser} </span>just joined your
            document. you can collaborate together on it.
          </span>
        </div>
      </div>
      <div
        className={`alert alert-success shadow-lg sticky  transition ${showConnectedAlert
          ? "opacity-100"
          : "opacity-0"}  ${showIncomingUserAlert ? "bottom-20" : "bottom-0"}`}
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current flex-shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="">Connected to the servers</span>
        </div>
      </div>
      <div
        className={`fixed  top-72 w-72 min-h-40 bg-red-600 rounded-r-2xl p-2 ${showRoomDetails
          ? "left-0"
          : "-left-56"} transition `}
        onClick={() => setShowRoomDetails(!showRoomDetails)}
      >
        <div className="flex flex-col justify-between gap-2 ">
          {connectedUsers.map((user) => (
            <div
              key={uuidV4()}
              className={`flex  items-center gap-2 ${showRoomDetails
                ? "justify-start"
                : "justify-end"}`}
            >
              <img src={user.avatar} alt="" className="w-10 h-10" />

              <span
                className={`text-white text-lg font-semibold font-sans  ${showRoomDetails
                  ? "block"
                  : "hidden"}`}
              >
                {user.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
