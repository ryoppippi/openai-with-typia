import type { ResponseFormatJSONSchema } from "openai/resources/shared.mjs";
import type * as typia from "typia";

/**
 * Converts a TypeScript type to OpenAI JSON Schema
 */
export function typiaJsonToOpenAIJsonSchema(
  jsonSchema: typia.IJsonApplication.IV3_1,
  strict?: boolean | null,
): ResponseFormatJSONSchema.JSONSchema {
  const { schemas } = jsonSchema.components;

  if (schemas == null) {
    throw new Error("json_schema.components.schemas is null");
  }

  const name = Object.keys(schemas).at(0);

  if (name == null) {
    throw new Error("name is null");
  }

  const targetSchema = schemas[name];

  return {
    name,
    schema: targetSchema as Record<string, unknown>,
    description: targetSchema.description,
    strict,
  };
}

type Params = Parameters<typeof typiaJsonToOpenAIJsonSchema>;

export function typiaJsonToOpenAIResponse(
  ...params: Params
): ResponseFormatJSONSchema {
  return {
    type: "json_schema",
    json_schema: typiaJsonToOpenAIJsonSchema(...params),
  };
}
