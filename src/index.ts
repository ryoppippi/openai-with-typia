import { join } from "node:path";
import typia from "typia";
import OpenAI from "openai";
import { typiaJsonToOpenAIResponse } from "./utils";

import type { Output } from "./type";

/** このfile からの相対パスから絶対パスを生成 */
function relativePath(...path: string[]) {
  return join (import.meta.dirname, ...path)
}

const inputText = await Bun.file(relativePath('..', 'input.txt')).text()

const client = new OpenAI({
  apiKey: typia.assert<string>(process.env.OPENAI_API_KEY)
});

const prompt = `
これから与えられるテキストに対して、
必ずpromptに書かれたruleにそってdataを処理してください。
結果はformatに従ってJSONを出力してください。
formatはTypeScriptの型定義ですが、必ずJSONを出力してください。
`

console.log('start chat')
const chat = await client.chat.completions.create({
  stream: false,
  response_format: typiaJsonToOpenAIResponse(typia.json.application<[Output], "3.1">()),
  messages: [
    {
      role: "system",
      content: `
${prompt}
`,
    },
    {
      role: "user",
      content: inputText
    },
  ],
  model: "gpt-4o-mini",
 });

const res = chat.choices.at(0)?.message.content;

/** parse res as JSON */
const json = typia.json.validateParse<Output>(res as string)

console.log(json)

await Bun.write(
  Bun.file('./result.json'),
  JSON.stringify(json, null, 2)
)
