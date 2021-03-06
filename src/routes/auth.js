import { Router } from 'express';
import { wrap } from '../utils';
import { passportAuthMiddleware, validateRequest } from '../middlewares';
import { RegisterUserRequest, LoginUserRequest } from '../requests';
import { AuthController } from '../controllers';
import { JwtTypes } from '../constants';

const authRouter = Router();

authRouter.post(
  '/register',
  validateRequest(RegisterUserRequest),
  wrap(async (req, res) => {
    const user = await AuthController.registerUser(req.body);
    res.status(201).json(user);
  }),
);

authRouter.post(
  '/login',
  validateRequest(LoginUserRequest),
  wrap(async (req, res) => {
    const [access_token, refresh_token] = await AuthController.loginUser(req.body);
    res.json({
      access_token,
      refresh_token,
    });
  }),
);

authRouter.get(
  '/refresh',
  passportAuthMiddleware(JwtTypes.REFRESH),
  wrap(async (req, res) => {
    const [access_token, refresh_token] = await AuthController.refreshTokens(req.user);
    return res.json({
      access_token,
      refresh_token,
    });
  }),
);

authRouter.get(
  '/me',
  passportAuthMiddleware(JwtTypes.ACCESS),
  wrap(async (req, res) => {
    const user = await AuthController.getMyStats(req.user);
    res.status(201).json(user);
  }),
);

export { authRouter };
