import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const ERROR_MESSAGE = "ChatGPT 發生錯誤，請稍後再試。";

export enum ChatRole {
  System = "system",
  User = "user",
}

export type Message = {
  role: string;
  content: string;
};

function mapMessagesToChatCompletionRequestMessages(
  messages: Message[]
): ChatCompletionRequestMessage[] {
  return messages.map((message) => message as ChatCompletionRequestMessage);
}

export async function callOpenAI(
  apiKey: string,
  messages: Message[]
): Promise<string> {
  try {
    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: mapMessagesToChatCompletionRequestMessages(messages),
    });

    return response?.data?.choices?.[0]?.message?.content || ERROR_MESSAGE;
  } catch (e: any) {
    console.log(e?.response?.data);
    return ERROR_MESSAGE;
  }
}
