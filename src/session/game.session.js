import { gameSessions } from './sessions.js';
import Game from '../classes/models/game.class.js';
import { config } from '../config/config.js';

export const addGameSession = () => {
  const session = new Game(config.game_data.room);
  gameSessions.push(session);
  session.startGame();
  console.log(`게임이 생성되었습니다.`);
  return session;
};

export const removeGameSession = () => {
  const index = gameSessions.findIndex((session) => session.id === config.game_data.room);
  if (index !== -1) {
    return gameSessions.splice(index, 1)[0];
  }
};

export const getGameSession = () => {
  return gameSessions.find((session) => session.id === config.game_data.room);
};

export const getAllGameSessions = () => {
  return gameSessions;
};
