import { addUser, getUserById } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { getGameSession } from '../../session/game.session.js';
import CustomError from '../../utils/error/customError.js';
import { createUser, findUserByDeviceID, updateUserLogin } from '../../db/user/user.db.js';

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    let { deviceId, playerId, latency } = payload;

    const gameSession = getGameSession();

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    // const user = getUserById(deviceId);
    // if (!user) {
    //   throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    // }
    // const existUser = gameSession.getUser(user.id);
    // if (!existUser) {
    //   gameSession.addUser(user);
    // }

    let user = await findUserByDeviceID(deviceId);

    console.log(user);

    if (!user) {
      user = await createUser(deviceId, playerId);
      user.x = 0;
      user.y = 0;
    }

    const nowUser = addUser(socket, deviceId, playerId, latency, user.x, user.y);

    gameSession.addUser(nowUser);

    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: deviceId },
      deviceId,
    );

    socket.write(initialResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default initialHandler;
