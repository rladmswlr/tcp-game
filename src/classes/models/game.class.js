import { createLocationUpdate } from '../../utils/notification/game.notification.js';

const MAX_PLAYERS = 10;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.state = 'waiting'; // 'waiting', 'inProgress'
  }

  addUser(user) {
    if (this.users.length > MAX_PLAYERS) {
      throw new Error('게임 세션에 자리가 없습니다!');
    }
    this.users.push(user);

    // this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    //if (this.users.length === MAX_PLAYERS) setTimeout(() => this.startGame(), 3000);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);

    if (this.users.length < MAX_PLAYERS) this.state = 'waiting';
  }

  startGame() {
    this.state = 'inProgress';
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });

    return maxLatency;
  }

  // user 클래스의 각각의 유저 x, y 위치 정보를 하나의 배열로 합치고 패킷으로 변환한다.
  getAllLocation(userId) {
    // const maxLatency = this.getMaxLatency(); // 전체 유저의 최대 레이턴시 구하기

    const locationData = this.users
      .filter((user) => user.id !== userId)
      .map((user) => {
        const { x, y } = user.getPosition();
        return { id: user.id, playerId: user.playerId, x, y };
      });
    return createLocationUpdate(locationData);
  }
}

export default Game;
