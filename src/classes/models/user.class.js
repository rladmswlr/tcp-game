import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket, playerId, latency) {
    this.id = id;
    this.socket = socket;
    this.playerId = playerId;
    this.latency = latency;
    this.x = 0;
    this.y = 0;
    this.lastUpdateTime = Date.now();
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  ping() {
    const now = Date.now();

    console.log(`${this.id}: ping`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    // console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드
  calculatePosition() {
    const timeDiff = this.latency / 1000; // 레이턴시(ms)를 초(s) 단위로 계산
    const speed = 3; // 클라이언트의 속도가 3으로 설정되어있음
    const frame = 1 / 30; // 클라이언트가 30 fps 를 가지고 있음
    // distance(거리) = speed(속도) * timeDiff(시간)
    const distance = speed * frame + speed * frame * timeDiff;

    this.x = this.x + distance * this.directionX;
    this.y = this.y + distance * this.directionY;

    return {
      x: this.x,
      y: this.y,
    };
  }
}

export default User;
