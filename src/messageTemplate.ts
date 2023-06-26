type MessageTemplate = {
  systemMessage: string;
  format: string;
};

export enum MessageType {
  YiJing,
}

export function getMessageTemplate(messageType: MessageType): MessageTemplate {
  switch (messageType) {
    case MessageType.YiJing:
      return {
        systemMessage: "你現在是一位精通易經及其卦象的超級算命師",
        format: `
          針對下面的卦象和問題提出解釋：
          """
          {}
          """

          請關注幾個點：
          1. 此卦是什麼意思？
          2. 此卦對這件事情的吉凶？
          3. 此卦有麼相關的典故？
          4. 此卦是在說這個問題未來會是什麼走向，並用此卦相針對問題解釋？

          你需要回傳的格式是：
          - 卦象： '...'
          - 吉凶： '...'
          - 卦象意思： '...'
          - 典故： '...'
          - 解釋： '...'
        `,
      };
  }
}

export function insertTextToFormat(
  messageType: MessageType,
  message: string
): string {
  return getMessageTemplate(messageType).format.replace("{}", message);
}

export const DEFAULT_MESSAGE_TYPE = MessageType.YiJing;
export const DEFAULT_SYSTEM_MESSAGE =
  getMessageTemplate(DEFAULT_MESSAGE_TYPE).systemMessage;
