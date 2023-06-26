import { Config } from "./config";
import { ChatRole, Message } from "./lib/chatgpt";
import {
  MessageType,
  getMessageTemplate,
  DEFAULT_SYSTEM_MESSAGE,
  DEFAULT_MESSAGE_TYPE,
} from "./messageTemplate";

type Context = {
  messages: Message[];
  messageType: MessageType;
};

type ChatMap = Map<number, Context>;

export class ChatMemory {
  private static _instance: ChatMemory;
  private _config = Config.Instance;
  private _messages: ChatMap = new Map();
  private constructor() {
    console.debug("ChatMemory initialized");
  }

  private _dropOverflowMessage(userId: number): Message[] {
    const messageType = this.getMessageType(userId);
    const messages: Message[] = this._messages.get(userId)?.messages || [];

    if (messages.length >= (this._config.defaultMessageCount + 1) * 2 + 1) {
      this._messages.set(userId, {
        messageType,
        messages: [
          messages[0],
          ...messages.slice(-this._config.defaultMessageCount * 2),
        ],
      });
    }

    return this._messages.get(userId)?.messages || [];
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public getMessageType(userId: number): MessageType {
    return this._messages.get(userId)?.messageType || DEFAULT_MESSAGE_TYPE;
  }

  public setMessageType(userId: number, messageType: MessageType) {
    this._messages.set(userId, {
      messageType,
      messages: [
        {
          content: getMessageTemplate(messageType).systemMessage,
          role: ChatRole.System,
        },
      ],
    });
  }

  public getMessages(userId: number): Message[] {
    if (!this._messages.get(userId)) {
      this.clear(userId);
    }
    return this._messages.get(userId)?.messages || [];
  }

  public add(role: ChatRole, userId: number, content: string) {
    const messageType = this.getMessageType(userId);
    this._messages.set(userId, {
      messageType,
      messages: [
        ...this.getMessages(userId),
        {
          content,
          role,
        },
      ],
    });
    this._dropOverflowMessage(userId);
  }

  public clear(userId: number) {
    this._messages.set(userId, {
      messageType: this.getMessageType(userId),
      messages: [],
    });
    this.add(ChatRole.System, userId, DEFAULT_SYSTEM_MESSAGE);
  }
}
