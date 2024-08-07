import type { ResponseFormatJSONSchema } from "openai/resources/shared.mjs"
import typia, { type tags } from "typia"

/**
* Converts a TypeScript type to OpenAI JSON Schema
*/
export function typiaToOpenAIJsonSchema<T>(json_schema: typia.IJsonApplication.IV3_1): ResponseFormatJSONSchema.JSONSchema{

  if(json_schema.components.schemas == null){
    throw new Error('json_schema.components.schemas is null')
  }

  const name = Object.keys(json_schema.components.schemas as Record<string,unknown>).at(0)


  typia.assertGuard<string>(name)

  return {
    name,

    schema: json_schema.components.schemas[name] as Record<string,unknown>,
  }
}
