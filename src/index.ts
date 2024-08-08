import { join } from "node:path";
import typia from "typia";
import OpenAI from "openai";
import { typiaResponseFormat } from "@ryoppippi/typiautil/openai";

import type { Output } from "./type";

/** このfile からの相対パスから絶対パスを生成 */
function relativePath(...path: string[]) {
  return join(import.meta.dirname, ...path);
}

const inputText = await Bun.file(relativePath("..", "input.txt")).text();

const client = new OpenAI({
  apiKey: typia.assert<string>(process.env.OPENAI_API_KEY),
});

const prompt =
  `これから与えられるテキストを読み込み、その内容を解析し、formatにしたがって出力してください。 `;

console.log("start chat");

const chat = await client.beta.chat.completions.parse({
  stream: false,
  response_format: typiaResponseFormat({
    jsonSchema: typia.json.application<[Output]>(),
    validate: typia.createValidate<Output>(),
}),
  messages: [
    {
      role: "system",
      content: prompt,
    },
    {
      role: "user",
      content: inputText,
    },
  ],
  model: "gpt-4o-mini",
});

const res = chat.choices.at(0)?.message.parsed

/** parse res as JSON */
const json = typia.assert<Output>(res);

console.log(json);

await Bun.write(
  Bun.file("./result.json"),
  JSON.stringify(json, null, 2),
);
