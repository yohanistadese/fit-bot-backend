import { Response } from "express";
import { env } from "../../config";
import LogService, {
  filter,
  RequestAttributes,
  ResponseAttributes,
} from "../../services/Log/Log.service";
import { TelegramBot } from "../telegram/Telegram";

type CriticalErrorStatusCode = 500;
const CriticalErrorStatusCodes = [500];
type ErrorStatusCode = 400 | 401 | 404 | 403 | 429 | 500;
const ErrorStatusCodes = [400, 401, 404, 403, 500];
type SuccessStatusCode = 200 | 201 | 300;
const SuccessStatusCodes = [200, 201, 300];

type ResponseObject = {
  status: SuccessStatusCode | ErrorStatusCode;
  message?: string;
  data: any;
  error: any;
};

const ServerResponse = async (
  req: any,
  res: Response,
  status: SuccessStatusCode | ErrorStatusCode,
  data: any,
  message: string,
  start_time: Date,
  type = "json"
) => {
  const request_url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const { id, first_name, last_name } = req.user || {};

  try {
    const responseObj: ResponseObject = {
      status,
      message,
      data: SuccessStatusCodes.includes(status) ? data : undefined,
      error: ErrorStatusCodes.includes(status)
        ? !env.PRODUCTION && status === 500
          ? { timestamp: new Date(), errors: ["Something Went Wrong"] }
          : data
        : undefined,
    };

    if (type === "json") {
      res.status(status).json(responseObj);
    } else if (type === "view") {
      res.render(message || "welcome", data);
    } else {
      res.status(status).json(responseObj);
    }
  } catch (e) {
    console.log(e);
    await TelegramBot.sendJsonMessage({
      error: e,
      time: new Date().toString(),
      from: {
        id: id ?? "Unknown User",
        name: id
          ? `${first_name ?? ""} ${last_name ?? ""}`.trim()
          : "Unknown User",
      },
      environment: env.NODE_ENV,
    });
  }

  if (SuccessStatusCodes.includes(status)) {
    LogService.LogRequest(
      { ...req, url: request_url },
      res,
      start_time,
      new Date()
    );
  } else if (ErrorStatusCodes.includes(status)) {
    LogService.LogRequestError(
      { data, message },
      filter({ ...req, url: request_url }, RequestAttributes),
      new Date()
    );

    await TelegramBot.sendJsonMessage(
      {
        request: filter({ ...req, url: request_url }, RequestAttributes),
        response: filter(res, ResponseAttributes),
        from: {
          id: id ?? "Unknown User",
          name: id
            ? `${first_name ?? ""} ${last_name ?? ""}`.trim()
            : "Unknown User",
        },
        environment: env.NODE_ENV,
        start_time,
        data,
        message,
        time: new Date(),
      },
      status
    );
  }
};

export default ServerResponse;
