let io;
module.exports = {
  initIo: (server) => {
    io = require("socket.io")(server, {
      cors: {
        origin: "*",
      },
    });
    return io;
  },
  getIo: () => {
    if (!io) throw Error("Socket io not initialized !");
    return io;
  },
};
