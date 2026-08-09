import type { SelectField, FieldValidationRules } from "@repo/database/schema";

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
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./()0-9]{6,20}$/;

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

function validateSingleField(field: SelectField, rawValue: unknown): string | null {
  const isMissing = isEmpty(rawValue);

  if (isMissing) {
    return field.required ? "This field is required" : null;
  }

  const validation = (field.validation ?? {}) as FieldValidationRules;
  const strVal = typeof rawValue === "string" ? rawValue.trim() : String(rawValue ?? "");

  // Flexible Regex pattern validation (if configured by form creator)
  if (validation.pattern) {
    try {
      const reg = new RegExp(validation.pattern);
      if (!reg.test(strVal)) {
        return validation.errorMessage || "Invalid input format";
      }
    } catch {
      // Ignore invalid regex syntax safely
    }
  }

  // Min / Max length checks
  if (validation.minLength !== undefined && strVal.length < validation.minLength) {
    return validation.errorMessage || `Minimum length is ${validation.minLength} characters`;
  }

  if (validation.maxLength !== undefined && strVal.length > validation.maxLength) {
    return validation.errorMessage || `Maximum length is ${validation.maxLength} characters`;
  }

  switch (field.type) {
    case "short_text":
    case "long_text": {
      if (typeof rawValue !== "string") return "Must be text";
      return null;
    }

    case "email": {
      if (typeof rawValue !== "string" || !EMAIL_REGEX.test(rawValue)) {
        return validation.errorMessage || "Must be a valid email address";
      }
      return null;
    }

    case "phone": {
      if (typeof rawValue !== "string" || (!PHONE_REGEX.test(rawValue) && !validation.pattern)) {
        return validation.errorMessage || "Must be a valid phone number";
      }
      return null;
    }

    case "number":
    case "rating": {
      const num = typeof rawValue === "number" ? rawValue : Number(rawValue);
      if (Number.isNaN(num)) return "Must be a number";

      if (validation.min !== undefined && num < validation.min) {
        return validation.errorMessage || `Value must be at least ${validation.min}`;
      }
      if (validation.max !== undefined && num > validation.max) {
        return validation.errorMessage || `Value must be at most ${validation.max}`;
      }

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

  for (const answerFieldId of Object.keys(answers)) {
    if (!fieldIdSet.has(answerFieldId)) {
      errors.push({ fieldId: answerFieldId, message: "This field does not belong to this form" });
    }
  }

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