import axios from "axios";
import LogService from "../../services/Log/Log.service";
import { LogTypes } from "../constants/Constants";

class TelegramBot {
  private static token = process.env.TELEGRAM_BOT_TOKEN || "";
  private static chatId = process.env.TELEGRAM_CHANNEL_ID || "";
  private static errorChatId = process.env.TELEGRAM_ERROR_CHANNEL_ID || "";
  private static apiUrl = `https://api.telegram.org/bot${TelegramBot.token}/sendMessage`;

  static async sendJsonMessage(
    jsonData: any,
    status_code = 400
  ): Promise<void> {
    if (!TelegramBot.token) return;

    const formattedMessage = `\`\`\`\n${JSON.stringify(
      jsonData,
      null,
      4
    )}\n\`\`\``;
    const messages = TelegramBot.splitMessage(formattedMessage, 4096);

    const chatIds = [TelegramBot.chatId];
    if (status_code === 500) chatIds.push(TelegramBot.errorChatId);

    for (const part of messages) {
      for (const chatId of chatIds) {
        if (!chatId) continue;
        try {
          await axios.post(TelegramBot.apiUrl, {
            chat_id: chatId,
            text: part,
            parse_mode: "MarkdownV2",
          });
        } catch (error: any) {
          LogService.Log(LogTypes.ERROR, { error, time: new Date() });
        }
      }
    }
  }

  private static splitMessage(message: string, maxLength: number): string[] {
    const result: string[] = [];
    let start = 0;
    while (start < message.length) {
      result.push(message.slice(start, start + maxLength));
      start += maxLength;
    }
    return result;
  }
}

export { TelegramBot };
