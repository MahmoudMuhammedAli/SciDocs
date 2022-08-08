const mongoose = require("mongoose");
const Document = require("./Document");
const express = require("express");
const app = express();
const http = require("http");
// const socketio = require("socket.io");
const cors = require("cors");

// run app on port 3001 or env port
const port = process.env.PORT || 3002;
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://mahmoud_0:qweasdzxc123@scidox1.psd0kjb.mongodb.net/?retryWrites=true&w=majority";
try {
  mongoose.connect(
    uri,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    () => console.log(" Mongoose is connected")
  );
} catch (e) {
  console.log("could not connect");
}

app.use(cors());
const server = http.createServer(app);
const io = require("socket.io")(port, {
  cors: {
    origin: "*",
    methods: [ "GET", "POST" ],
  },
});

const defaultValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId, username) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.broadcast.to(documentId).emit("user-joined-current-room", username);
    console.log(username + " joined the room");
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}

app.get("/", (req, res) => {
  res.send("Server is running");
  console.log("Server is running");
  console.log(io);
});
