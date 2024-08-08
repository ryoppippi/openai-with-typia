import { zodResponseFormat } from "openai/helpers/zod";

import { join } from "node:path";
import { $ } from 'bun'
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

const jsonSchema= typia.json.application<[Output]>();
const chat = await client.beta.chat.completions.parse({
  stream: false,
  response_format: typiaResponseFormat({
    jsonSchema,
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

await $`echo ${JSON.stringify(jsonSchema, null, 2)} > schema.json`
await $`echo ${JSON.stringify(json, null, 2)} > result.json`
