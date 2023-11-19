const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });

  // Listen for 'leaveCall' event from clients
  socket.on("leaveCall", () => {
    // Notify other users to reload the page
    socket.broadcast.emit("reloadPage");
  });
  socket.on("userMutedStatus", ({ isMuted }) => {
    // Broadcast the muted status to other users
    console.log(isMuted);
    socket.broadcast.emit("userMutedChanged", { isMuted });
  });
  socket.on("userCameraStatus", ({ isCameraOff }) => {
    console.log(isCameraOff);
    socket.broadcast.emit("userCameraChanged", { isCameraOff });
  });
  socket.on("message", ({ userToCall, message }) => {
    console.log(userToCall, message);
    io.to(userToCall).emit("message", { message, from: socket.id });
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
