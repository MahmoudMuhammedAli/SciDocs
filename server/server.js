const mongoose = require("mongoose");
const Document = require("./Document");
const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");

// run app on port 3001 or env port
const port = process.env.PORT || 3002;

mongoose.connect("mongodb://localhost/google-docs-clone", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});
const defaultValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
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
});
app.listen(port, () => console.log(`Listening on port ${port}`));
