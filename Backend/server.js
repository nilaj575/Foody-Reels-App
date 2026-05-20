require("dotenv").config();
const http = require("http");
const app = require("./src/app");
const connectDB = require("./src/db/db");

// ✅ destructure initSocket
const { initSocket } = require("./src/socket");


connectDB();

// create HTTP server
const server = http.createServer(app);

// attach socket to same server
const io = initSocket(server);



// optional: make io available in app
app.set("io", io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});