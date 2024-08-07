import type { ResponseFormatJSONSchema } from "openai/resources/shared.mjs";
import type * as typia from "typia";

/**
 * Converts a TypeScript type to OpenAI JSON Schema
 */
export function typiaJsonToOpenAIJsonSchema(
  json_schema: typia.IJsonApplication.IV3_1,
): ResponseFormatJSONSchema.JSONSchema {
  const { schemas: _schemas } = json_schema.components;

  if (_schemas == null) {
    throw new Error("json_schema.components.schemas is null");
  }

  const schemas = _schemas as Record<string, Record<string, unknown>>;

  const name = Object.keys(schemas).at(0);

  if (name == null) {
    throw new Error("name is null");
  }

  return {
    name,
    schema: schemas[name],
  };
}

export function typiaJsonToOpenAIResponse(
  json_schema: typia.IJsonApplication.IV3_1,
): ResponseFormatJSONSchema {
  return {
    type: "json_schema",
    json_schema: typiaJsonToOpenAIJsonSchema(json_schema),
  };
}
