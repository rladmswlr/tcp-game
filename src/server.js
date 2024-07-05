import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection } from './events/onConnection.js';
import { addGameSession, getAllGameSessions } from './session/game.session.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host} : ${config.server.port}에서 실행중 입니다`);
      console.log(server.address());
      addGameSession();
    });
  })
  .catch((e) => {
    console.error(e);
  });
