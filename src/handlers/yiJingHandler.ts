import { insertTextToFormat, MessageType } from "../messageTemplate";

function puGua(): number {
  const gua = Math.floor(Math.random() * 64) + 1;
  return gua;
}

export function formatQuestion(messageType: MessageType, text: string): string {
  const gua = puGua();
  const guaAndQuestion = `卦象：第${gua}卦\n問題：${text}\n`;
  return insertTextToFormat(messageType, guaAndQuestion);
}
