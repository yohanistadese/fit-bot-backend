import request from "supertest";
import crypto from "crypto";
import { app } from "../src/app";
import { UserDAL } from "../src/dals/User";
import { env } from "../src/config";
import { initializeDatabase } from "../src/database/sequelize";

const botToken = env.TELEGRAM_BOT_TOKEN;
const testTelegramId = "123456789";

function generateInitData() {
  const data = {
    id: testTelegramId,
    first_name: "John",
    last_name: "Doe",
    username: "john_doe",
    auth_date: Math.floor(Date.now() / 1000).toString(),
  };

  const keys = Object.keys(data) as (keyof typeof data)[];

  const checkString = keys
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  return Object.entries({ ...data, hash })
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

describe("Telegram Login", () => {
  beforeAll(async () => {
    await initializeDatabase();
    await UserDAL.delete({
      where: { telegram_user_id: testTelegramId },
      force: true,
    });
  });

  it("should register and login via telegram", async () => {
    const initData = generateInitData();

    const res = await request(app)
      .post("/auth/telegram-login")
      .send({ initData })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.telegram_user_id).toBe(testTelegramId);
    expect(res.body.user.name).toBe("John Doe");
  });

  it("should login the same user again", async () => {
    const initData = generateInitData();

    const res = await request(app)
      .post("/auth/telegram-login")
      .send({ initData })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.telegram_user_id).toBe(testTelegramId);
  });
});
