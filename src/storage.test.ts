import { Config } from "./config";
import { ChatMemory } from "./storage";
import { ChatRole } from "./lib/chatgpt";
import * as dotenv from "dotenv";

describe("ChatMemory", () => {
  const chatMemory = ChatMemory.Instance;
  const config = Config.Instance;
  const userId = 1;
  const sysMessage = config.defaultSystemMessage;
  const userMessage = "User message";

  beforeAll(() => {
    dotenv.config({ path: ".env.test" });
  });

  it("should have default messages", () => {
    expect(chatMemory.getMessages(userId)).toEqual([
      { content: sysMessage, role: ChatRole.System },
    ]);
  });

  it("should have default message when clear", () => {
    chatMemory.clear(userId);
    expect(chatMemory.getMessages(userId)).toEqual([
      { content: sysMessage, role: ChatRole.System },
    ]);
  });

  it("should add messages", () => {
    chatMemory.clear(userId);
    chatMemory.add(ChatRole.User, userId, userMessage);
    expect(chatMemory.getMessages(userId)).toEqual([
      { content: sysMessage, role: ChatRole.System },
      { content: userMessage, role: ChatRole.User },
    ]);
  });
});
