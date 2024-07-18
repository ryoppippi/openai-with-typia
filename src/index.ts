import { join } from "node:path";
import typia, { type tags } from "typia"
import OpenAI from "openai";

import type { Output } from "./type"

/** このfile からの相対パスから絶対パスを生成 */
function relativePath(...path: string[]) {
  return join (import.meta.dirname, ...path)
}

const OutputTypeRawText = await Bun.file(relativePath('./type.ts')).text()
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
  response_format: { type: "json_object" },
  messages: [
    {
      role: "system",
      content: `
${prompt}
${OutputTypeRawText}
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

/** check if res is string */
typia.assertGuard<string>(res)

/** parse res as JSON */
const json = typia.json.assertParse<Output>(res)

console.log(json)

await Bun.write(
  Bun.file('./result.json'),
  JSON.stringify(json, null, 2)
)
