const io = require('socket.io')(9000, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

let users = [];

const addUser = (username, socketId) => {
  if (username != null  || username.length>0) {
    !users.some((user) => user.username === username) && users.push({ username, socketId });
  } else {
    return;
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return users.find((user) => user.username === username);
};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('addUser', (username) => {
    addUser(username, socket.id);
    io.emit('getUsers', users);
  });

  //send and get message
  socket.on('sendMsg', ({ senderUsername, receiverUsername, text, conversationId }) => {
    const user = getUser(receiverUsername);
    // console.log(user);
    // console.log(users);
    if(user){
      io.to(user.socketId).emit('getMsg', {
        senderUsername,
        conversationId,
        text,
      });
    }else{
      return 
    }
  });

  socket.on('disconnect', () => {
    console.log('a user disconnect');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});
