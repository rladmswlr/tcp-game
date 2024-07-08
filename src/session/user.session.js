import User from '../classes/models/user.class.js';
import { updateUser } from '../db/user/user.db.js';
import { userSessions } from './sessions.js';

export const addUser = (socket, uuid, playerId, latency, x, y) => {
  const user = new User(uuid, socket, playerId, latency, x, y);
  userSessions.push(user);
  return user;
};

export const removeUser = async (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    const { id, playerId, latency, x, y, lastUpdateTime } = userSessions[index];
    console.log(`x: ${x},y: ${y}`);
    await updateUser(x, y, id);

    return userSessions.splice(index, 1)[0];
  }
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};
