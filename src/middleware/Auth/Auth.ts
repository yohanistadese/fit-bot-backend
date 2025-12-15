import jwt from "jsonwebtoken";
import { env } from "../../config";
import { UserStatus } from "../../utilities/constants/Constants";
import { UnauthorizedError } from "../Error";
import { UserDAL } from "../../dals/User";
import ServerResponse from "../../utilities/response/Response";
import { User } from "../../models/User";
import { Op } from "sequelize";
import { NextFunction } from "express";

const getUserIp = (req: any) => {
  const rawIp =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.ip ||
    req.connection?.remoteAddress ||
    "";

  // Remove IPv6 prefix if present
  return rawIp.replace(/^::ffff:/, "");
};

export const VerifyJWT = async (auth: string): Promise<any> => {
  if (!auth || auth.split(" ").length !== 2) {
    throw new UnauthorizedError("Invalid Authorization Header");
  }

  const token = auth.split(" ")[1];

  return new Promise((resolve, reject) => {
    jwt.verify(token, env.AUTH_KEY, (err: any, decoded: any) => {
      if (err)
        return reject(
          new UnauthorizedError(
            "Your session has expired, please sign in again"
          )
        );
      resolve(decoded);
    });
  });
};

export const AuthenticateUser = async (
  request: any,
  response: any,
  next: any
) => {
  const startTime = new Date();

  try {
    const authHeader = request.headers["authorization"];
    if (!authHeader) {
      return ServerResponse(
        request,
        response,
        401,
        null,
        "No token provided",
        startTime
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return ServerResponse(
        request,
        response,
        401,
        null,
        "Invalid authorization format",
        startTime
      );
    }

    const data: any = await VerifyJWT(token);

    const user = data.telegram_user_id
      ? await UserDAL.findOne({
          where: { telegram_user_id: data.telegram_user_id },
        })
      : await UserDAL.findOne({ where: { id: data.id } });

    if (!user) {
      return ServerResponse(
        request,
        response,
        401,
        null,
        "Invalid token",
        startTime
      );
    }

    if (user.status !== UserStatus.ACTIVE) {
      return ServerResponse(
        request,
        response,
        401,
        [
          "User account has been deactivated! Please contact System Administrators",
        ],
        "User Inactive",
        startTime
      );
    }

    const userData = user.toJSON();
    delete userData.password;
    delete userData.last_used_key;

    userData.ip_address = getUserIp(request);
    request.user = userData;

    next();
  } catch (error) {
    return ServerResponse(
      request,
      response,
      401,
      error,
      "Authorization Error",
      startTime
    );
  }
};

export const AuthorizeAccess = (allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    const startTime = new Date();
    try {
      if (!req.user || !allowedRoles.includes(req.user.role.toLowerCase())) {
        return ServerResponse(
          req,
          res,
          403,
          null,
          "Unauthorized Access",
          startTime
        );
      }
      next();
    } catch (error) {
      return ServerResponse(
        req,
        res,
        403,
        error,
        "Unauthorized Access",
        startTime
      );
    }
  };
};

export const GlobalAuthOptionsNew = (
  user: User,
  options: any,
  include: any,
  where?: any,
  paranoid?: boolean
) => {
  if (!options) options = {};
  if (!options.order) options.order = [["createdAt", "DESC"]];

  if (include) {
    options.include = options.include
      ? [...options.include, include]
      : [include];
  }

  if (where) {
    options.where = options.where
      ? { [Op.and]: [options.where, where] }
      : where;
  }

  // Exclude soft-deleted records by default unless paranoid is explicitly passed
  const finalParanoid = paranoid !== undefined ? paranoid : true;

  return { options, paranoid: finalParanoid };
};

export const AuthenticatePossibleUser = (req: any, res: any, next: any) => {
  try {
    const startTime = new Date();
    const token = req.headers["authorization"];
    if (token) {
      VerifyJWT(token)
        .then((data) => {
          UserDAL.findOne({
            where: {
              id: data.id,
            },
          })
            .then((user) => {
              if (user) {
                if (user.status === UserStatus.ACTIVE) {
                  let userData = user.toJSON();
                  userData.ip_address = getUserIp(req);
                  req.user = userData;
                  next();
                } else {
                  ServerResponse(
                    req,
                    res,
                    401,
                    [
                      "User account has been deactivated! Please contact System Administrators",
                    ],
                    "User Inactive",
                    startTime
                  );
                }
              } else {
                ServerResponse(req, res, 401, null, "Invalid Token", startTime);
              }
            })
            .catch((error) => {
              ServerResponse(req, res, 401, error, "Invalid Token", startTime);
            });
        })
        .catch((error) => {
          ServerResponse(
            req,
            res,
            401,
            error,
            "Authorization Error",
            startTime
          );
        });
    } else {
      next();
    }
  } catch (e) {
    res
      .status(500)
      .send({ status: 500, data: null, message: "Internal Server Error" });
  }
};
