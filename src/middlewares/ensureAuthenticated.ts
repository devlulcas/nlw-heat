import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  // Sem token nem rola
  if (!authToken) {
    return response.status(401).json({
      errorCode: "token.invalid",
    });
  }
  // Pegamos a string, dividimos em duas partes, ignoramos a primeira ("Bearer") e guardamos apenas o token
  // Bearer SKFSDKFSD219333LSDFDKSF2EWKLFSDKF23KDSDKFSDJ
  const [, token] = authToken.split(" ");

  // Validamos o token
  const secretSignature = process.env.JWT_SIGNATURE;

  try {
    const { sub } = verify(token, secretSignature) as IPayload;
    request.user_id = sub;
    return next();
  } catch (error) {
    return response.status(401).json({
      errorCode: "token.expired",
    });
  }
}

export { ensureAuthenticated };
