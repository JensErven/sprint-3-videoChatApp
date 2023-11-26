const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const allowedOrigins = [
  "https://videochat-ochre.vercel.app",
  "https://videochat-ochre.vercel.app/",
  "http://localhost:3000", // Add your development URL
  // Add more allowed URLs if needed
];

const io = require("socket.io")(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running");
});

// Initialize an array to store connected users
const userList = [];

io.on("connection", (socket) => {
  socket.on("join", ({ userName }) => {
    const user = { id: socket.id, name: userName };
    userList.push(user);

    // Notify all clients about the updated user list
    io.emit("users", userList);
    socket.emit("me", user);
    console.log(userList);

    // Other event handlers...
  });

  socket.on("disconnect", () => {
    const index = userList.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      userList.splice(index, 1);
      io.emit("users", userList); // Notify clients about the updated list
    }
    socket.broadcast.emit("callended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });

    const callingWith = userList.find((user) => user.id === userToCall);

    if (callingWith) {
      io.to(socket.id).emit("callingwith", {
        name: callingWith.name,
        id: callingWith.id,
      });
    }
  });

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
    // Find the user in the users list based on the userToCall ID
    const callingWith = userList.find((user) => user.id === data.to);

    // If the user is found, emit the name to the caller
    if (callingWith) {
      io.to(socket.id).emit("callingwith", {
        name: callingWith.name,
        id: callingWith.id,
      });
    }
  });

  // Listen for 'leaveCall' event from clients
  socket.on("leaveCall", ({ user1, user2 }) => {
    // Notify other users to reload the page

    io.to(user1).emit("reloadPage");
    io.to(user2).emit("reloadPage");
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
  socket.on("message", ({ callingWith, message, sender }) => {
    console.log(callingWith, message, sender);
    io.to(callingWith).emit("message", { message, from: sender });
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
