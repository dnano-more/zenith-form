/**
 * Zenith Form — Comprehensive Field Validation Test Suite & Submission Payload Generator
 * Tests positive paths, negative paths, boundary values, empty required fields, special characters, and edge cases.
 */

// Server-side Validator Implementation (packages/services/response/validator.ts)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./()0-9]{6,20}$/;

function isEmpty(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

function validateSingleField(field, rawValue) {
  const isMissing = isEmpty(rawValue);

  if (isMissing) {
    return field.required ? "This field is required" : null;
  }

  const validation = field.validation || {};
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
      const date = new Date(rawValue);
      if (Number.isNaN(date.getTime())) return "Must be a valid date";
      return null;
    }

    case "checkbox": {
      if (typeof rawValue !== "boolean") return "Must be true or false";
      return null;
    }

    case "single_select": {
      const options = field.options || [];
      if (typeof rawValue !== "string" || !options.includes(rawValue)) {
        return "Must be one of the provided options";
      }
      return null;
    }

    case "multi_select": {
      const options = field.options || [];
      if (!Array.isArray(rawValue) || !rawValue.every((v) => options.includes(v))) {
        return "Must be a list of the provided options";
      }
      return null;
    }

    default:
      return "Unsupported field type";
  }
}

function validateAnswers(fields, answers) {
  const errors = [];
  const cleanedAnswers = {};
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

// Full suite of 10 Form Field Definitions covering every input type in Zenith Form
const allFormFields = [
  {
    id: "f_short_text",
    type: "short_text",
    label: "Full Name",
    placeholder: "e.g. Jane Doe",
    required: true,
    validation: { minLength: 2, maxLength: 50 },
  },
  {
    id: "f_long_text",
    type: "long_text",
    label: "Project Description & Goals",
    placeholder: "Describe your project...",
    required: true,
    validation: { minLength: 10, maxLength: 500 },
  },
  {
    id: "f_email",
    type: "email",
    label: "Work Email Address",
    placeholder: "jane@company.com",
    required: true,
    validation: {},
  },
  {
    id: "f_phone",
    type: "phone",
    label: "Direct Phone Number",
    placeholder: "+1 (555) 019-2834",
    required: true,
    validation: {},
  },
  {
    id: "f_number",
    type: "number",
    label: "Team Size",
    placeholder: "e.g. 15",
    required: true,
    validation: { min: 1, max: 1000 },
  },
  {
    id: "f_date",
    type: "date",
    label: "Target Completion Date",
    placeholder: "YYYY-MM-DD",
    required: true,
    validation: {},
  },
  {
    id: "f_checkbox",
    type: "checkbox",
    label: "Accept Service Level Agreement",
    placeholder: "I accept terms",
    required: true,
    validation: {},
  },
  {
    id: "f_rating",
    type: "rating",
    label: "Urgency Rating (1-5)",
    placeholder: "Select score",
    required: true,
    validation: { min: 1, max: 5 },
  },
  {
    id: "f_single_select",
    type: "single_select",
    label: "Deployment Environment",
    placeholder: "Choose environment",
    required: true,
    options: ["Production", "Staging", "Development"],
    validation: {},
  },
  {
    id: "f_multi_select",
    type: "multi_select",
    label: "Required Cloud Providers",
    placeholder: "Select providers",
    required: true,
    options: ["AWS", "Google Cloud", "Azure", "Vercel", "Cloudflare"],
    validation: {},
  },
];

// Comprehensive Validation Test Cases (6 categories x 10 field types)
const testCases = [
  // 1. SHORT TEXT
  {
    id: "ST-01",
    category: "Positive Path",
    fieldType: "short_text",
    label: "Short Text Valid Input",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 50 } },
    input: "Jane Doe",
    shouldPass: true,
  },
  {
    id: "ST-02",
    category: "Boundary Value",
    fieldType: "short_text",
    label: "Short Text Min Length Boundary (2 chars)",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 50 } },
    input: "Ab",
    shouldPass: true,
  },
  {
    id: "ST-03",
    category: "Boundary Value",
    fieldType: "short_text",
    label: "Short Text Max Length Boundary (50 chars)",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 50 } },
    input: "A".repeat(50),
    shouldPass: true,
  },
  {
    id: "ST-04",
    category: "Negative Path",
    fieldType: "short_text",
    label: "Short Text Too Short (1 char)",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 50 } },
    input: "A",
    shouldPass: false,
    expectedError: "Minimum length is 2 characters",
  },
  {
    id: "ST-05",
    category: "Negative Path",
    fieldType: "short_text",
    label: "Short Text Exceeds Max (51 chars)",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 50 } },
    input: "A".repeat(51),
    shouldPass: false,
    expectedError: "Maximum length is 50 characters",
  },
  {
    id: "ST-06",
    category: "Empty Required",
    fieldType: "short_text",
    label: "Short Text Empty String",
    fieldConfig: { required: true },
    input: "",
    shouldPass: false,
    expectedError: "This field is required",
  },
  {
    id: "ST-07",
    category: "Empty Required",
    fieldType: "short_text",
    label: "Short Text Whitespace Only",
    fieldConfig: { required: true },
    input: "      ",
    shouldPass: false,
    expectedError: "This field is required",
  },
  {
    id: "ST-08",
    category: "Special Characters",
    fieldType: "short_text",
    label: "Short Text XSS Injection Tags",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 100 } },
    input: "<script>alert('XSS')</script>",
    shouldPass: true,
  },
  {
    id: "ST-09",
    category: "Special Characters",
    fieldType: "short_text",
    label: "Short Text Unicode / Multi-Language",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 50 } },
    input: "Zenith Form 🚀 日本語 🎉",
    shouldPass: true,
  },
  {
    id: "ST-10",
    category: "Edge Case",
    fieldType: "short_text",
    label: "Short Text Numeric Non-String Input",
    fieldConfig: { required: true },
    input: 12345,
    shouldPass: false,
    expectedError: "Must be text",
  },

  // 2. LONG TEXT
  {
    id: "LT-01",
    category: "Positive Path",
    fieldType: "long_text",
    label: "Long Text Multi-line Paragraph",
    fieldConfig: { required: true, validation: { minLength: 10 } },
    input: "High-performance enterprise form builder application.\nSupporting dynamic validation and TRPC API endpoints.",
    shouldPass: true,
  },
  {
    id: "LT-02",
    category: "Negative Path",
    fieldType: "long_text",
    label: "Long Text Below Min Length",
    fieldConfig: { required: true, validation: { minLength: 20 } },
    input: "Short note",
    shouldPass: false,
    expectedError: "Minimum length is 20 characters",
  },
  {
    id: "LT-03",
    category: "Special Characters",
    fieldType: "long_text",
    label: "Long Text SQL Sequences & Symbols",
    fieldConfig: { required: true, validation: { minLength: 5 } },
    input: "SELECT * FROM forms WHERE id = '1' OR '1'='1'; -- !@#$%^&*()",
    shouldPass: true,
  },
  {
    id: "LT-04",
    category: "Empty Required",
    fieldType: "long_text",
    label: "Long Text Null Input Optional",
    fieldConfig: { required: false },
    input: null,
    shouldPass: true,
  },

  // 3. EMAIL
  {
    id: "EM-01",
    category: "Positive Path",
    fieldType: "email",
    label: "Email Standard Format",
    fieldConfig: { required: true },
    input: "jane.doe@zenithform.io",
    shouldPass: true,
  },
  {
    id: "EM-02",
    category: "Positive Path",
    fieldType: "email",
    label: "Email Subdomains & Plus Addressing",
    fieldConfig: { required: true },
    input: "user+testing@sub.domain.co.uk",
    shouldPass: true,
  },
  {
    id: "EM-03",
    category: "Negative Path",
    fieldType: "email",
    label: "Email Missing TLD Domain",
    fieldConfig: { required: true },
    input: "user@domain",
    shouldPass: false,
    expectedError: "Must be a valid email address",
  },
  {
    id: "EM-04",
    category: "Negative Path",
    fieldType: "email",
    label: "Email Missing Username",
    fieldConfig: { required: true },
    input: "@domain.com",
    shouldPass: false,
    expectedError: "Must be a valid email address",
  },
  {
    id: "EM-05",
    category: "Negative Path",
    fieldType: "email",
    label: "Email Plain String",
    fieldConfig: { required: true },
    input: "notanemailaddress",
    shouldPass: false,
    expectedError: "Must be a valid email address",
  },
  {
    id: "EM-06",
    category: "Empty Required",
    fieldType: "email",
    label: "Email Empty Required String",
    fieldConfig: { required: true },
    input: "",
    shouldPass: false,
    expectedError: "This field is required",
  },

  // 4. PHONE
  {
    id: "PH-01",
    category: "Positive Path",
    fieldType: "phone",
    label: "Phone E.164 International Format",
    fieldConfig: { required: true },
    input: "+1 (555) 019-2834",
    shouldPass: true,
  },
  {
    id: "PH-02",
    category: "Positive Path",
    fieldType: "phone",
    label: "Phone Plain Digits with Country Code",
    fieldConfig: { required: true },
    input: "+919876543210",
    shouldPass: true,
  },
  {
    id: "PH-03",
    category: "Negative Path",
    fieldType: "phone",
    label: "Phone Alphabetic String",
    fieldConfig: { required: true },
    input: "+1 (555) CALL-ME",
    shouldPass: false,
    expectedError: "Must be a valid phone number",
  },
  {
    id: "PH-04",
    category: "Boundary Value",
    fieldType: "phone",
    label: "Phone Too Short (3 digits)",
    fieldConfig: { required: true },
    input: "123",
    shouldPass: false,
    expectedError: "Must be a valid phone number",
  },

  // 5. NUMBER
  {
    id: "NUM-01",
    category: "Positive Path",
    fieldType: "number",
    label: "Number Integer Input",
    fieldConfig: { required: true, validation: { min: 1, max: 1000 } },
    input: 15,
    shouldPass: true,
  },
  {
    id: "NUM-02",
    category: "Positive Path",
    fieldType: "number",
    label: "Number String Numeric Coercion ('42')",
    fieldConfig: { required: true, validation: { min: 1, max: 1000 } },
    input: "42",
    shouldPass: true,
  },
  {
    id: "NUM-03",
    category: "Boundary Value",
    fieldType: "number",
    label: "Number Min Boundary (1)",
    fieldConfig: { required: true, validation: { min: 1, max: 1000 } },
    input: 1,
    shouldPass: true,
  },
  {
    id: "NUM-04",
    category: "Boundary Value",
    fieldType: "number",
    label: "Number Max Boundary (1000)",
    fieldConfig: { required: true, validation: { min: 1, max: 1000 } },
    input: 1000,
    shouldPass: true,
  },
  {
    id: "NUM-05",
    category: "Negative Path",
    fieldType: "number",
    label: "Number Below Min (0 < 1)",
    fieldConfig: { required: true, validation: { min: 1, max: 1000 } },
    input: 0,
    shouldPass: false,
    expectedError: "Value must be at least 1",
  },
  {
    id: "NUM-06",
    category: "Negative Path",
    fieldType: "number",
    label: "Number Above Max (1001 > 1000)",
    fieldConfig: { required: true, validation: { min: 1, max: 1000 } },
    input: 1001,
    shouldPass: false,
    expectedError: "Value must be at most 1000",
  },
  {
    id: "NUM-07",
    category: "Negative Path",
    fieldType: "number",
    label: "Number Non-Numeric String ('abc')",
    fieldConfig: { required: true },
    input: "abc",
    shouldPass: false,
    expectedError: "Must be a number",
  },
  {
    id: "NUM-08",
    category: "Edge Case",
    fieldType: "number",
    label: "Number Floating Point Precision (3.14)",
    fieldConfig: { required: true, validation: { min: 1, max: 10 } },
    input: 3.14159,
    shouldPass: true,
  },

  // 6. DATE
  {
    id: "DT-01",
    category: "Positive Path",
    fieldType: "date",
    label: "Date ISO Format (YYYY-MM-DD)",
    fieldConfig: { required: true },
    input: "2026-08-09",
    shouldPass: true,
  },
  {
    id: "DT-02",
    category: "Edge Case",
    fieldType: "date",
    label: "Date Leap Year Valid (2024-02-29)",
    fieldConfig: { required: true },
    input: "2024-02-29",
    shouldPass: true,
  },
  {
    id: "DT-03",
    category: "Negative Path",
    fieldType: "date",
    label: "Date Malformed String ('invalid')",
    fieldConfig: { required: true },
    input: "invalid-date-string",
    shouldPass: false,
    expectedError: "Must be a valid date",
  },
  {
    id: "DT-04",
    category: "Empty Required",
    fieldType: "date",
    label: "Date Empty Required String",
    fieldConfig: { required: true },
    input: "",
    shouldPass: false,
    expectedError: "This field is required",
  },

  // 7. CHECKBOX
  {
    id: "CB-01",
    category: "Positive Path",
    fieldType: "checkbox",
    label: "Checkbox True (Checked)",
    fieldConfig: { required: true },
    input: true,
    shouldPass: true,
  },
  {
    id: "CB-02",
    category: "Positive Path",
    fieldType: "checkbox",
    label: "Checkbox False Optional",
    fieldConfig: { required: false },
    input: false,
    shouldPass: true,
  },
  {
    id: "CB-03",
    category: "Negative Path",
    fieldType: "checkbox",
    label: "Checkbox String Non-Boolean ('yes')",
    fieldConfig: { required: true },
    input: "yes",
    shouldPass: false,
    expectedError: "Must be true or false",
  },
  {
    id: "CB-04",
    category: "Empty Required",
    fieldType: "checkbox",
    label: "Checkbox Null Required",
    fieldConfig: { required: true },
    input: null,
    shouldPass: false,
    expectedError: "This field is required",
  },

  // 8. RATING
  {
    id: "RT-01",
    category: "Positive Path",
    fieldType: "rating",
    label: "Rating Valid Score (5)",
    fieldConfig: { required: true, validation: { min: 1, max: 5 } },
    input: 5,
    shouldPass: true,
  },
  {
    id: "RT-02",
    category: "Boundary Value",
    fieldType: "rating",
    label: "Rating Min Star Boundary (1)",
    fieldConfig: { required: true, validation: { min: 1, max: 5 } },
    input: 1,
    shouldPass: true,
  },
  {
    id: "RT-03",
    category: "Negative Path",
    fieldType: "rating",
    label: "Rating Out of Bounds (0 < 1)",
    fieldConfig: { required: true, validation: { min: 1, max: 5 } },
    input: 0,
    shouldPass: false,
    expectedError: "Value must be at least 1",
  },
  {
    id: "RT-04",
    category: "Negative Path",
    fieldType: "rating",
    label: "Rating Out of Bounds (6 > 5)",
    fieldConfig: { required: true, validation: { min: 1, max: 5 } },
    input: 6,
    shouldPass: false,
    expectedError: "Value must be at most 5",
  },

  // 9. SINGLE SELECT
  {
    id: "SS-01",
    category: "Positive Path",
    fieldType: "single_select",
    label: "Single Select Valid Option ('Production')",
    fieldConfig: { required: true, options: ["Production", "Staging", "Development"] },
    input: "Production",
    shouldPass: true,
  },
  {
    id: "SS-02",
    category: "Negative Path",
    fieldType: "single_select",
    label: "Single Select Invalid Option ('Sandbox')",
    fieldConfig: { required: true, options: ["Production", "Staging", "Development"] },
    input: "Sandbox",
    shouldPass: false,
    expectedError: "Must be one of the provided options",
  },
  {
    id: "SS-03",
    category: "Empty Required",
    fieldType: "single_select",
    label: "Single Select Empty Required",
    fieldConfig: { required: true, options: ["Production", "Staging"] },
    input: "",
    shouldPass: false,
    expectedError: "This field is required",
  },

  // 10. MULTI SELECT
  {
    id: "MS-01",
    category: "Positive Path",
    fieldType: "multi_select",
    label: "Multi Select Multiple Valid Options",
    fieldConfig: { required: true, options: ["AWS", "Google Cloud", "Azure", "Vercel"] },
    input: ["AWS", "Vercel"],
    shouldPass: true,
  },
  {
    id: "MS-02",
    category: "Boundary Value",
    fieldType: "multi_select",
    label: "Multi Select All Options",
    fieldConfig: { required: true, options: ["AWS", "Google Cloud"] },
    input: ["AWS", "Google Cloud"],
    shouldPass: true,
  },
  {
    id: "MS-03",
    category: "Negative Path",
    fieldType: "multi_select",
    label: "Multi Select Contains Invalid Option ('Oracle')",
    fieldConfig: { required: true, options: ["AWS", "Google Cloud"] },
    input: ["AWS", "Oracle"],
    shouldPass: false,
    expectedError: "Must be a list of the provided options",
  },
  {
    id: "MS-04",
    category: "Negative Path",
    fieldType: "multi_select",
    label: "Multi Select Non-Array Input ('AWS')",
    fieldConfig: { required: true, options: ["AWS", "Google Cloud"] },
    input: "AWS",
    shouldPass: false,
    expectedError: "Must be a list of the provided options",
  },
  {
    id: "MS-05",
    category: "Empty Required",
    fieldType: "multi_select",
    label: "Multi Select Empty Array Required",
    fieldConfig: { required: true, options: ["AWS", "Google Cloud"] },
    input: [],
    shouldPass: false,
    expectedError: "This field is required",
  },
];

function runSuite() {
  console.log("==========================================================================");
  console.log("🧪 ZENITH FORM — COMPREHENSIVE FIELD VALIDATION SUITE");
  console.log("==========================================================================\n");

  let passed = 0;
  let failed = 0;
  const tableRows = [];

  for (const tc of testCases) {
    const baseField = allFormFields.find((f) => f.type === tc.fieldType);
    const fieldDef = {
      ...baseField,
      ...tc.fieldConfig,
      id: `f_${tc.id}`,
      validation: {
        ...(baseField ? baseField.validation : {}),
        ...(tc.fieldConfig.validation || {}),
      },
    };

    const result = validateAnswers([fieldDef], { [fieldDef.id]: tc.input });
    const err = result.errors.find((e) => e.fieldId === fieldDef.id);

    let isSuccess = false;
    let note = "";

    if (tc.shouldPass) {
      if (result.valid && !err) {
        isSuccess = true;
        note = "Passed validation correctly";
      } else {
        isSuccess = false;
        note = `Unexpected failure: "${err ? err.message : "Unknown error"}"`;
      }
    } else {
      if (!result.valid && err) {
        if (tc.expectedError && !err.message.includes(tc.expectedError)) {
          isSuccess = false;
          note = `Failed with unexpected msg: "${err.message}" (expected "${tc.expectedError}")`;
        } else {
          isSuccess = true;
          note = `Rejected correctly: "${err.message}"`;
        }
      } else {
        isSuccess = false;
        note = "Expected rejection, but input was incorrectly accepted!";
      }
    }

    if (isSuccess) passed++;
    else failed++;

    tableRows.push({
      ID: tc.id,
      Category: tc.category,
      Type: tc.fieldType,
      Description: tc.label,
      Status: isSuccess ? "✅ PASS" : "❌ FAIL",
      Details: note,
    });
  }

  console.table(tableRows);

  console.log("\n--------------------------------------------------------------------------");
  console.log(`📊 SUITE RESULTS: Total: ${testCases.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log("--------------------------------------------------------------------------\n");

  // ==========================================================================
  // FINAL FORM SUBMISSION & STATE PAYLOAD OUTPUT
  // ==========================================================================
  console.log("==========================================================================");
  console.log("🚀 SUBMITTING FULL COMPREHENSIVE FORM PAYLOAD ACROSS ALL INPUT TYPES");
  console.log("==========================================================================\n");

  const submissionAnswersPayload = {
    f_short_text: "Jane Doe",
    f_long_text: "High-performance enterprise form builder application with automated dynamic validation.",
    f_email: "jane.doe@zenithform.io",
    f_phone: "+1 (555) 019-2834",
    f_number: 15,
    f_date: "2026-08-09",
    f_checkbox: true,
    f_rating: 5,
    f_single_select: "Production",
    f_multi_select: ["AWS", "Vercel", "Cloudflare"],
  };

  const finalResult = validateAnswers(allFormFields, submissionAnswersPayload);

  console.log(`Form Submission Validation Status: ${finalResult.valid ? "✅ VALID & PASSED" : "❌ FAILED"}`);
  if (!finalResult.valid) {
    console.error("Validation Errors:", finalResult.errors);
  }

  console.log("\n--------------------------------------------------------------------------");
  console.log("📦 FINAL FORM STATE PAYLOAD UPON SUBMISSION (Cleaned & Validated):");
  console.log("--------------------------------------------------------------------------");
  console.log(JSON.stringify(finalResult.cleanedAnswers, null, 2));
  console.log("==========================================================================\n");
}

runSuite();
