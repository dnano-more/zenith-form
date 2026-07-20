import type { SelectField } from "@repo/database/schema";

export interface ValidationError {
  fieldId: string;
  message: string;
}

export interface ValidateAnswersResult {
  valid: boolean;
  errors: ValidationError[];
  cleanedAnswers: Record<string, unknown>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

function validateSingleField(field: SelectField, rawValue: unknown): string | null {
  const isMissing = isEmpty(rawValue);

  if (isMissing) {
    return field.required ? "This field is required" : null; // optional + missing = OK
  }

  switch (field.type) {
    case "short_text":
    case "long_text": {
      if (typeof rawValue !== "string") return "Must be text";
      return null;
    }

    case "email": {
      if (typeof rawValue !== "string" || !EMAIL_REGEX.test(rawValue)) {
        return "Must be a valid email address";
      }
      return null;
    }

    case "number":
    case "rating": {
      const num = typeof rawValue === "number" ? rawValue : Number(rawValue);
      if (Number.isNaN(num)) return "Must be a number";
      return null;
    }

    case "date": {
      const date = new Date(rawValue as string);
      if (Number.isNaN(date.getTime())) return "Must be a valid date";
      return null;
    }

    case "checkbox": {
      if (typeof rawValue !== "boolean") return "Must be true or false";
      return null;
    }

    case "single_select": {
      const options = field.options ?? [];
      if (typeof rawValue !== "string" || !options.includes(rawValue)) {
        return "Must be one of the provided options";
      }
      return null;
    }

    case "multi_select": {
      const options = field.options ?? [];
      if (!Array.isArray(rawValue) || !rawValue.every((v) => options.includes(v))) {
        return "Must be a list of the provided options";
      }
      return null;
    }

    default:
      return "Unsupported field type";
  }
}

export function validateAnswers(
  fields: SelectField[],
  answers: Record<string, unknown>,
): ValidateAnswersResult {
  const errors: ValidationError[] = [];
  const cleanedAnswers: Record<string, unknown> = {};

  const fieldIdSet = new Set(fields.map((f) => f.id));

  // Reject unknown field IDs — koi bhi extra/random key answers mein na aaye
  for (const answerFieldId of Object.keys(answers)) {
    if (!fieldIdSet.has(answerFieldId)) {
      errors.push({ fieldId: answerFieldId, message: "This field does not belong to this form" });
    }
  }

  // Har known field ko validate karo
  for (const field of fields) {
    const rawValue = answers[field.id];
    const error = validateSingleField(field, rawValue);

    if (error) {
      errors.push({ fieldId: field.id, message: error });
    } else if (!isEmpty(rawValue)) {
      cleanedAnswers[field.id] = rawValue;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    cleanedAnswers,
  };
}