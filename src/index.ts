import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import * as express from "express";
import { Request, Response } from "express";

import { callOpenAI, ChatRole } from "./lib/chatgpt";
import { ChatMemory } from "./storage";
import { Config } from "./config";
import { MessageType } from "./messageTemplate";
import { BotCommand } from "telegraf/typings/core/types/typegram";
import * as yiJingHandler from "./handlers/yiJingHandler";

const commandList: BotCommand[] = [
  {
    command: "help",
    description: "顯示幫助",
  },
  {
    command: "pugua",
    description: "開始易經模式",
  },
];

async function server() {
  const app = express();
  const port = 3000;

  app.get("/health_check", (req: Request, res: Response) => {
    res.send("Hello, World!");
  });

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
}

async function main() {
  try {
    await server();

    const config = Config.Instance;
    const bot = new Telegraf(config.botToken);
    const chatStorage = ChatMemory.Instance;

    bot.telegram.setMyCommands(commandList);

    bot.command("help", async (ctx) => {
      await ctx.telegram.sendMessage(
        ctx.message.chat.id,
        "可以使用的功能：\n\n・輸入訊息直接開始占卜\n・/pugua\t開始易經模式\n"
      );
    });

    bot.command("pugua", async (ctx) => {
      chatStorage.setMessageType(ctx.message.chat.id, MessageType.YiJing);
      await ctx.telegram.sendMessage(ctx.message.chat.id, "開始易經模式");
    });

    bot.on(message("text"), async function (ctx) {
      const messageId = ctx.message.message_id;
      const chatId = ctx.message.chat.id;
      const text = ctx.message.text;

      const { message_id: replyMessageId } = await ctx.reply("...請稍候", {
        reply_to_message_id: messageId,
      });

      let formattedQuestion = "";
      const messageType = chatStorage.getMessageType(chatId);

      switch (messageType) {
        case MessageType.YiJing:
          formattedQuestion = yiJingHandler.formatQuestion(messageType, text);
          break;
      }
      chatStorage.add(ChatRole.User, chatId, formattedQuestion);

      const reply = await callOpenAI(
        Config.Instance.chatGPTApiKey,
        chatStorage.getMessages(chatId)
      );
      chatStorage.add(ChatRole.System, chatId, reply);

      await ctx.telegram.editMessageText(
        chatId,
        replyMessageId,
        undefined,
        reply
      );
    });

    bot.launch();
  } catch (error) {
    console.log(error);
  }
}

main();
