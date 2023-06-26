export class Config {
  private static _instance: Config;
  private constructor() {
    console.debug("Config initialized");
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public get botToken(): string {
    if (!process.env.BOT_TOKEN) throw new Error("Missing BOT_TOKEN");
    return process.env.BOT_TOKEN;
  }

  public get defaultSystemMessage(): string {
    return process.env.DEFAULT_SYSTEM_MESSAGE || "系統訊息";
  }

  public get defaultMessageCount(): number {
    if (!process.env.DEFAULT_MESSAGE_COUNT)
      throw new Error("Missing DEFAULT_MESSAGE_COUNT");
    return parseInt(process.env.DEFAULT_MESSAGE_COUNT);
  }

  public get chatGPTApiKey(): string {
    if (!process.env.CHAT_GPT_API_KEY)
      throw new Error("Missing CHAT_GPT_API_KEY");
    return process.env.CHAT_GPT_API_KEY;
  }
}
