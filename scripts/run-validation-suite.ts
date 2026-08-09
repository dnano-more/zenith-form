import { validateAnswers, type ValidationError } from "../packages/services/response/validator";
import type { SelectField } from "../packages/database/src/schema";

interface TestCase {
  id: string;
  category: "Positive Path" | "Negative Path" | "Boundary Value" | "Empty Required" | "Special Characters" | "Edge Case";
  fieldType: SelectField["type"];
  fieldLabel: string;
  description: string;
  fieldConfig: Partial<SelectField>;
  inputValue: unknown;
  shouldBeValid: boolean;
  expectedErrorSubstr?: string;
}

const mockFieldId = (type: string, index: number) => `field-${type}-${index}`;

// Generate standard test fields for each input type
const testFields: SelectField[] = [
  {
    id: "f_short_text",
    formId: "00000000-0000-0000-0000-000000000001",
    type: "short_text",
    label: "Full Name",
    placeholder: "John Doe",
    helpText: "Enter your full name",
    required: true,
    order: 0,
    options: null,
    validation: { minLength: 2, maxLength: 50 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "f_long_text",
    formId: "00000000-0000-0000-0000-000000000001",
    type: "long_text",
    label: "Bio / Comments",
    placeholder: "Tell us about yourself...",
    helpText: "Detailed description",
    required: false,
    order: 1,
    options: null,
    validation: { minLength: 10, maxLength: 500 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "f_email",
    formId: "00000000-0000-0000-0000-000000000001",
    type: "email",
    label: "Email Address",
    placeholder: "user@example.com",
    helpText: "Work email address",
    required: true,
    order: 2,
    options: null,
    validation: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "f_phone",
    formId: "00000000-0000-0000-0000-000000000001",
    type: "phone",
    label: "Phone Number",
    placeholder: "+1 (555) 000-0000",
    helpText: "Contact phone",
    required: true,
    order: 3,
    options: null,
    validation: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "f_number",
    formId: "00000000-0000-0000-0000-000000000001",
    type: "number",
    label: "Age",
    placeholder: "25",
    helpText: "Your age in years",
    required: true,
    order: 4,
    options: null,
    validation: { min: 18, max: 120 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "f_date",
    formId: "00000000-0000-0000-0000-000000000001",
    type: "date",
    label: "Start Date",
    placeholder: "YYYY-MM-DD",
    helpText: "Project launch date",
    required: true,
    order: 5,
    options: null,
    validation: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "f_checkbox",
    formId: "00000000-0000-0000-0000-000000000001",
    type: "checkbox",
    label: "Terms & Conditions",
    placeholder: "I accept the terms",
    helpText: "Required consent",
    required: true,
    order: 6,
    options: null,
    validation: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "f_rating",
    formId: "00000000-0000-0000-0000-000000000001",
    type: "rating",
    label: "Satisfaction Score",
    placeholder: "1-5 stars",
    helpText: "Rate your experience",
    required: true,
    order: 7,
    options: null,
    validation: { min: 1, max: 5 },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "f_single_select",
    formId: "00000000-0000-0000-0000-000000000001",
    type: "single_select",
    label: "Role",
    placeholder: "Select your role",
    helpText: "Primary job title",
    required: true,
    order: 8,
    options: ["Developer", "Designer", "Product Manager", "Other"],
    validation: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "f_multi_select",
    formId: "00000000-0000-0000-0000-000000000001",
    type: "multi_select",
    label: "Tech Stack",
    placeholder: "Select all that apply",
    helpText: "Technologies you use",
    required: true,
    order: 9,
    options: ["React", "Next.js", "TypeScript", "TailwindCSS", "Node.js", "PostgreSQL"],
    validation: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Comprehensive test suite covering all field types across 6 core validation scenarios
const testCases: TestCase[] = [
  // ==========================================
  // 1. SHORT TEXT FIELD TESTS
  // ==========================================
  {
    id: "ST-01",
    category: "Positive Path",
    fieldType: "short_text",
    fieldLabel: "Short Text Standard",
    description: "Valid standard string within min/max bounds",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 50 } },
    inputValue: "Alice Smith",
    shouldBeValid: true,
  },
  {
    id: "ST-02",
    category: "Boundary Value",
    fieldType: "short_text",
    fieldLabel: "Short Text Min Length Boundary",
    description: "Exact minLength boundary (2 characters)",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 50 } },
    inputValue: "Ab",
    shouldBeValid: true,
  },
  {
    id: "ST-03",
    category: "Boundary Value",
    fieldType: "short_text",
    fieldLabel: "Short Text Max Length Boundary",
    description: "Exact maxLength boundary (50 characters)",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 50 } },
    inputValue: "A".repeat(50),
    shouldBeValid: true,
  },
  {
    id: "ST-04",
    category: "Negative Path",
    fieldType: "short_text",
    fieldLabel: "Short Text Too Short",
    description: "String length shorter than minLength (1 char)",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 50 } },
    inputValue: "A",
    shouldBeValid: false,
    expectedErrorSubstr: "Minimum length is 2 characters",
  },
  {
    id: "ST-05",
    category: "Negative Path",
    fieldType: "short_text",
    fieldLabel: "Short Text Exceeds Max Length",
    description: "String length longer than maxLength (51 chars)",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 50 } },
    inputValue: "A".repeat(51),
    shouldBeValid: false,
    expectedErrorSubstr: "Maximum length is 50 characters",
  },
  {
    id: "ST-06",
    category: "Empty Required",
    fieldType: "short_text",
    fieldLabel: "Short Text Empty String",
    description: "Empty string on required field",
    fieldConfig: { required: true },
    inputValue: "",
    shouldBeValid: false,
    expectedErrorSubstr: "This field is required",
  },
  {
    id: "ST-07",
    category: "Empty Required",
    fieldType: "short_text",
    fieldLabel: "Short Text Whitespace Only",
    description: "Whitespace string on required field",
    fieldConfig: { required: true },
    inputValue: "     ",
    shouldBeValid: false,
    expectedErrorSubstr: "This field is required",
  },
  {
    id: "ST-08",
    category: "Special Characters",
    fieldType: "short_text",
    fieldLabel: "Short Text XSS Vectors",
    description: "HTML script injection tags",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 100 } },
    inputValue: "<script>alert('XSS')</script>",
    shouldBeValid: true, // System sanitizes / handles strings safely
  },
  {
    id: "ST-09",
    category: "Special Characters",
    fieldType: "short_text",
    fieldLabel: "Short Text Unicode & Emojis",
    description: "International Unicode characters and emojis",
    fieldConfig: { required: true, validation: { minLength: 2, maxLength: 50 } },
    inputValue: "Zenith Form 🚀 日本語 🎉",
    shouldBeValid: true,
  },
  {
    id: "ST-10",
    category: "Edge Case",
    fieldType: "short_text",
    fieldLabel: "Short Text Non-string Type",
    description: "Passing a number value to short_text field",
    fieldConfig: { required: true },
    inputValue: 12345,
    shouldBeValid: false,
    expectedErrorSubstr: "Must be text",
  },

  // ==========================================
  // 2. LONG TEXT FIELD TESTS
  // ==========================================
  {
    id: "LT-01",
    category: "Positive Path",
    fieldType: "long_text",
    fieldLabel: "Long Text Paragraph",
    description: "Multi-line text input",
    fieldConfig: { required: true, validation: { minLength: 10 } },
    inputValue: "This is a detailed feedback text spanning multiple lines.\nLine 2.\nLine 3.",
    shouldBeValid: true,
  },
  {
    id: "LT-02",
    category: "Negative Path",
    fieldType: "long_text",
    fieldLabel: "Long Text Below Min Length",
    description: "Fails min length threshold",
    fieldConfig: { required: true, validation: { minLength: 20 } },
    inputValue: "Too short",
    shouldBeValid: false,
    expectedErrorSubstr: "Minimum length is 20 characters",
  },
  {
    id: "LT-03",
    category: "Empty Required",
    fieldType: "long_text",
    fieldLabel: "Long Text Null Value",
    description: "Null passed to optional vs required field",
    fieldConfig: { required: false },
    inputValue: null,
    shouldBeValid: true,
  },
  {
    id: "LT-04",
    category: "Special Characters",
    fieldType: "long_text",
    fieldLabel: "Long Text SQL & Special Chars",
    description: "SQL escape sequences and special symbols",
    fieldConfig: { required: true, validation: { minLength: 5 } },
    inputValue: "SELECT * FROM users WHERE '1'='1'; -- !@#$%^&*()_+",
    shouldBeValid: true,
  },

  // ==========================================
  // 3. EMAIL FIELD TESTS
  // ==========================================
  {
    id: "EM-01",
    category: "Positive Path",
    fieldType: "email",
    fieldLabel: "Email Standard",
    description: "Standard RFC compliant email",
    fieldConfig: { required: true },
    inputValue: "developer.zenith@company.io",
    shouldBeValid: true,
  },
  {
    id: "EM-02",
    category: "Positive Path",
    fieldType: "email",
    fieldLabel: "Email Subdomains & Tags",
    description: "Plus addressing and subdomains",
    fieldConfig: { required: true },
    inputValue: "user+test-suite@subdomain.example.co.uk",
    shouldBeValid: true,
  },
  {
    id: "EM-03",
    category: "Negative Path",
    fieldType: "email",
    fieldLabel: "Email Missing Domain",
    description: "Email missing domain suffix",
    fieldConfig: { required: true },
    inputValue: "user@domain",
    shouldBeValid: false,
    expectedErrorSubstr: "Must be a valid email address",
  },
  {
    id: "EM-04",
    category: "Negative Path",
    fieldType: "email",
    fieldLabel: "Email Missing Username",
    description: "Email missing username part",
    fieldConfig: { required: true },
    inputValue: "@example.com",
    shouldBeValid: false,
    expectedErrorSubstr: "Must be a valid email address",
  },
  {
    id: "EM-05",
    category: "Negative Path",
    fieldType: "email",
    fieldLabel: "Email Plain String",
    description: "Invalid plain text non-email",
    fieldConfig: { required: true },
    inputValue: "not-an-email-address",
    shouldBeValid: false,
    expectedErrorSubstr: "Must be a valid email address",
  },
  {
    id: "EM-06",
    category: "Empty Required",
    fieldType: "email",
    fieldLabel: "Email Empty Required",
    description: "Empty email on required field",
    fieldConfig: { required: true },
    inputValue: "",
    shouldBeValid: false,
    expectedErrorSubstr: "This field is required",
  },

  // ==========================================
  // 4. PHONE FIELD TESTS
  // ==========================================
  {
    id: "PH-01",
    category: "Positive Path",
    fieldType: "phone",
    fieldLabel: "Phone International Format",
    description: "E.164 international phone number (+1 555 123 4567)",
    fieldConfig: { required: true },
    inputValue: "+1 (555) 123-4567",
    shouldBeValid: true,
  },
  {
    id: "PH-02",
    category: "Positive Path",
    fieldType: "phone",
    fieldLabel: "Phone Plain Digits",
    description: "Standard digits only phone number",
    fieldConfig: { required: true },
    inputValue: "+919876543210",
    shouldBeValid: true,
  },
  {
    id: "PH-03",
    category: "Negative Path",
    fieldType: "phone",
    fieldLabel: "Phone Alphabetic String",
    description: "Contains invalid alphabetic characters",
    fieldConfig: { required: true },
    inputValue: "+1 (555) CALL-ME",
    shouldBeValid: false,
    expectedErrorSubstr: "Must be a valid phone number",
  },
  {
    id: "PH-04",
    category: "Boundary Value",
    fieldType: "phone",
    fieldLabel: "Phone Too Short",
    description: "Fewer digits than min limit (3 digits)",
    fieldConfig: { required: true },
    inputValue: "123",
    shouldBeValid: false,
    expectedErrorSubstr: "Must be a valid phone number",
  },
  {
    id: "PH-05",
    category: "Empty Required",
    fieldType: "phone",
    fieldLabel: "Phone Empty Required",
    description: "Empty string for required phone",
    fieldConfig: { required: true },
    inputValue: "",
    shouldBeValid: false,
    expectedErrorSubstr: "This field is required",
  },

  // ==========================================
  // 5. NUMBER FIELD TESTS
  // ==========================================
  {
    id: "NUM-01",
    category: "Positive Path",
    fieldType: "number",
    fieldLabel: "Number Integer",
    description: "Valid integer within bounds",
    fieldConfig: { required: true, validation: { min: 18, max: 120 } },
    inputValue: 25,
    shouldBeValid: true,
  },
  {
    id: "NUM-02",
    category: "Positive Path",
    fieldType: "number",
    fieldLabel: "Number String Coercion",
    description: "Valid numeric string ('42')",
    fieldConfig: { required: true, validation: { min: 18, max: 120 } },
    inputValue: "42",
    shouldBeValid: true,
  },
  {
    id: "NUM-03",
    category: "Boundary Value",
    fieldType: "number",
    fieldLabel: "Number Min Boundary",
    description: "Exact min value (18)",
    fieldConfig: { required: true, validation: { min: 18, max: 120 } },
    inputValue: 18,
    shouldBeValid: true,
  },
  {
    id: "NUM-04",
    category: "Boundary Value",
    fieldType: "number",
    fieldLabel: "Number Max Boundary",
    description: "Exact max value (120)",
    fieldConfig: { required: true, validation: { min: 18, max: 120 } },
    inputValue: 120,
    shouldBeValid: true,
  },
  {
    id: "NUM-05",
    category: "Negative Path",
    fieldType: "number",
    fieldLabel: "Number Below Min",
    description: "Value lower than min threshold (17 < 18)",
    fieldConfig: { required: true, validation: { min: 18, max: 120 } },
    inputValue: 17,
    shouldBeValid: false,
    expectedErrorSubstr: "Value must be at least 18",
  },
  {
    id: "NUM-06",
    category: "Negative Path",
    fieldType: "number",
    fieldLabel: "Number Above Max",
    description: "Value higher than max threshold (121 > 120)",
    fieldConfig: { required: true, validation: { min: 18, max: 120 } },
    inputValue: 121,
    shouldBeValid: false,
    expectedErrorSubstr: "Value must be at most 120",
  },
  {
    id: "NUM-07",
    category: "Negative Path",
    fieldType: "number",
    fieldLabel: "Number Invalid NaN String",
    description: "Non-numeric string ('abc')",
    fieldConfig: { required: true },
    inputValue: "invalid_number",
    shouldBeValid: false,
    expectedErrorSubstr: "Must be a number",
  },
  {
    id: "NUM-08",
    category: "Edge Case",
    fieldType: "number",
    fieldLabel: "Number Zero Value",
    description: "Zero value on allowed number field",
    fieldConfig: { required: true, validation: { min: 0, max: 10 } },
    inputValue: 0,
    shouldBeValid: true,
  },

  // ==========================================
  // 6. DATE FIELD TESTS
  // ==========================================
  {
    id: "DT-01",
    category: "Positive Path",
    fieldType: "date",
    fieldLabel: "Date Standard ISO",
    description: "Standard ISO date string (YYYY-MM-DD)",
    fieldConfig: { required: true },
    inputValue: "2026-08-09",
    shouldBeValid: true,
  },
  {
    id: "DT-02",
    category: "Edge Case",
    fieldType: "date",
    fieldLabel: "Date Leap Year",
    description: "Valid leap year date (2024-02-29)",
    fieldConfig: { required: true },
    inputValue: "2024-02-29",
    shouldBeValid: true,
  },
  {
    id: "DT-03",
    category: "Negative Path",
    fieldType: "date",
    fieldLabel: "Date Invalid String",
    description: "Malformed non-date string",
    fieldConfig: { required: true },
    inputValue: "not-a-date",
    shouldBeValid: false,
    expectedErrorSubstr: "Must be a valid date",
  },
  {
    id: "DT-04",
    category: "Empty Required",
    fieldType: "date",
    fieldLabel: "Date Empty Required",
    description: "Empty date string on required field",
    fieldConfig: { required: true },
    inputValue: "",
    shouldBeValid: false,
    expectedErrorSubstr: "This field is required",
  },

  // ==========================================
  // 7. CHECKBOX FIELD TESTS
  // ==========================================
  {
    id: "CB-01",
    category: "Positive Path",
    fieldType: "checkbox",
    fieldLabel: "Checkbox Checked (True)",
    description: "Checked boolean true",
    fieldConfig: { required: true },
    inputValue: true,
    shouldBeValid: true,
  },
  {
    id: "CB-02",
    category: "Positive Path",
    fieldType: "checkbox",
    fieldLabel: "Checkbox Unchecked Optional",
    description: "Unchecked boolean false on optional checkbox",
    fieldConfig: { required: false },
    inputValue: false,
    shouldBeValid: true,
  },
  {
    id: "CB-03",
    category: "Negative Path",
    fieldType: "checkbox",
    fieldLabel: "Checkbox Non-boolean Input",
    description: "String 'yes' instead of boolean true",
    fieldConfig: { required: true },
    inputValue: "yes",
    shouldBeValid: false,
    expectedErrorSubstr: "Must be true or false",
  },
  {
    id: "CB-04",
    category: "Empty Required",
    fieldType: "checkbox",
    fieldLabel: "Checkbox Null Required",
    description: "Null passed for required checkbox",
    fieldConfig: { required: true },
    inputValue: null,
    shouldBeValid: false,
    expectedErrorSubstr: "This field is required",
  },

  // ==========================================
  // 8. RATING FIELD TESTS
  // ==========================================
  {
    id: "RT-01",
    category: "Positive Path",
    fieldType: "rating",
    fieldLabel: "Rating Standard Score",
    description: "Valid 5-star rating (Score 4)",
    fieldConfig: { required: true, validation: { min: 1, max: 5 } },
    inputValue: 4,
    shouldBeValid: true,
  },
  {
    id: "RT-02",
    category: "Boundary Value",
    fieldType: "rating",
    fieldLabel: "Rating Min Star (1)",
    description: "Min 1-star boundary",
    fieldConfig: { required: true, validation: { min: 1, max: 5 } },
    inputValue: 1,
    shouldBeValid: true,
  },
  {
    id: "RT-03",
    category: "Boundary Value",
    fieldType: "rating",
    fieldLabel: "Rating Max Star (5)",
    description: "Max 5-star boundary",
    fieldConfig: { required: true, validation: { min: 1, max: 5 } },
    inputValue: 5,
    shouldBeValid: true,
  },
  {
    id: "RT-04",
    category: "Negative Path",
    fieldType: "rating",
    fieldLabel: "Rating Zero (Below Min)",
    description: "0 star rating when min is 1",
    fieldConfig: { required: true, validation: { min: 1, max: 5 } },
    inputValue: 0,
    shouldBeValid: false,
    expectedErrorSubstr: "Value must be at least 1",
  },
  {
    id: "RT-05",
    category: "Negative Path",
    fieldType: "rating",
    fieldLabel: "Rating Exceeds Max (6)",
    description: "6 star rating when max is 5",
    fieldConfig: { required: true, validation: { min: 1, max: 5 } },
    inputValue: 6,
    shouldBeValid: false,
    expectedErrorSubstr: "Value must be at most 5",
  },

  // ==========================================
  // 9. SINGLE SELECT FIELD TESTS
  // ==========================================
  {
    id: "SS-01",
    category: "Positive Path",
    fieldType: "single_select",
    fieldLabel: "Single Select Valid Choice",
    description: "Option from configured list ('Developer')",
    fieldConfig: { required: true, options: ["Developer", "Designer", "Product Manager"] },
    inputValue: "Developer",
    shouldBeValid: true,
  },
  {
    id: "SS-02",
    category: "Negative Path",
    fieldType: "single_select",
    fieldLabel: "Single Select Invalid Choice",
    description: "Option not in options array ('Cyberpunk')",
    fieldConfig: { required: true, options: ["Developer", "Designer", "Product Manager"] },
    inputValue: "Cyberpunk",
    shouldBeValid: false,
    expectedErrorSubstr: "Must be one of the provided options",
  },
  {
    id: "SS-03",
    category: "Empty Required",
    fieldType: "single_select",
    fieldLabel: "Single Select Empty Required",
    description: "Empty selection string",
    fieldConfig: { required: true, options: ["Developer", "Designer"] },
    inputValue: "",
    shouldBeValid: false,
    expectedErrorSubstr: "This field is required",
  },

  // ==========================================
  // 10. MULTI SELECT FIELD TESTS
  // ==========================================
  {
    id: "MS-01",
    category: "Positive Path",
    fieldType: "multi_select",
    fieldLabel: "Multi Select Multiple Choices",
    description: "Subset of valid choices (['React', 'TypeScript'])",
    fieldConfig: { required: true, options: ["React", "Next.js", "TypeScript", "TailwindCSS"] },
    inputValue: ["React", "TypeScript"],
    shouldBeValid: true,
  },
  {
    id: "MS-02",
    category: "Boundary Value",
    fieldType: "multi_select",
    fieldLabel: "Multi Select All Options",
    description: "All available options selected",
    fieldConfig: { required: true, options: ["React", "Next.js", "TypeScript"] },
    inputValue: ["React", "Next.js", "TypeScript"],
    shouldBeValid: true,
  },
  {
    id: "MS-03",
    category: "Negative Path",
    fieldType: "multi_select",
    fieldLabel: "Multi Select Unlisted Choice Included",
    description: "Array containing an unlisted option (['React', 'Ruby'])",
    fieldConfig: { required: true, options: ["React", "Next.js", "TypeScript"] },
    inputValue: ["React", "Ruby"],
    shouldBeValid: false,
    expectedErrorSubstr: "Must be a list of the provided options",
  },
  {
    id: "MS-04",
    category: "Negative Path",
    fieldType: "multi_select",
    fieldLabel: "Multi Select Non-array Input",
    description: "Single string instead of array ('React')",
    fieldConfig: { required: true, options: ["React", "Next.js"] },
    inputValue: "React",
    shouldBeValid: false,
    expectedErrorSubstr: "Must be a list of the provided options",
  },
  {
    id: "MS-05",
    category: "Empty Required",
    fieldType: "multi_select",
    fieldLabel: "Multi Select Empty Array Required",
    description: "Empty array [] on required multi-select",
    fieldConfig: { required: true, options: ["React", "Next.js"] },
    inputValue: [],
    shouldBeValid: false,
    expectedErrorSubstr: "This field is required",
  },
];

// Helper to create dummy SelectField with override
function createTestField(base: SelectField, configOverride?: Partial<SelectField>): SelectField {
  return {
    ...base,
    ...configOverride,
    validation: {
      ...(base.validation ?? {}),
      ...(configOverride?.validation ?? {}),
    },
  };
}

async function runTestSuite() {
  console.log("==========================================================================");
  console.log("🚀 ZENITH FORM — COMPREHENSIVE FIELD VALIDATION TEST SUITE");
  console.log("==========================================================================\n");

  let passCount = 0;
  let failCount = 0;

  const resultsTable: Array<{
    ID: string;
    Category: string;
    Type: string;
    Label: string;
    Result: string;
    Note: string;
  }> = [];

  for (const tc of testCases) {
    const baseField = testFields.find((f) => f.type === tc.fieldType);
    if (!baseField) {
      console.error(`❌ Base field not found for type: ${tc.fieldType}`);
      continue;
    }

    const testField = createTestField(baseField, tc.fieldConfig);
    const answersPayload = { [testField.id]: tc.inputValue };

    const { valid, errors } = validateAnswers([testField], answersPayload);
    const fieldError = errors.find((e) => e.fieldId === testField.id);

    let isSuccess = false;
    let note = "";

    if (tc.shouldBeValid) {
      if (valid && !fieldError) {
        isSuccess = true;
        note = "Passed validation as expected";
      } else {
        isSuccess = false;
        note = `Expected valid, but got error: "${fieldError?.message}"`;
      }
    } else {
      if (!valid && fieldError) {
        if (tc.expectedErrorSubstr && !fieldError.message.includes(tc.expectedErrorSubstr)) {
          isSuccess = false;
          note = `Failed with unexpected error message: "${fieldError.message}" (expected "${tc.expectedErrorSubstr}")`;
        } else {
          isSuccess = true;
          note = `Rejected correctly: "${fieldError.message}"`;
        }
      } else {
        isSuccess = false;
        note = "Expected validation error, but input was accepted as valid!";
      }
    }

    if (isSuccess) {
      passCount++;
    } else {
      failCount++;
    }

    resultsTable.push({
      ID: tc.id,
      Category: tc.category,
      Type: tc.fieldType,
      Label: tc.fieldLabel,
      Result: isSuccess ? "✅ PASS" : "❌ FAIL",
      Note: note,
    });
  }

  console.table(resultsTable);

  console.log("\n--------------------------------------------------------------------------");
  console.log(`TEST SUITE SUMMARY: Total: ${testCases.length} | Passed: ${passCount} | Failed: ${failCount}`);
  console.log("--------------------------------------------------------------------------\n");

  // ==========================================================================
  // FINAL FORM SUBMISSION & STATE PAYLOAD OUTPUT
  // ==========================================================================
  console.log("==========================================================================");
  console.log("📝 EXECUTING FULL FORM SUBMISSION WITH VALID POSITIVE PATH PAYLOAD");
  console.log("==========================================================================\n");

  const fullValidFormPayload: Record<string, unknown> = {
    f_short_text: "Alexander Hamilton",
    f_long_text: "Building resilient microservices architecture with robust validation layers and modern web APIs.",
    f_email: "alexander.hamilton@zenithform.io",
    f_phone: "+1 (555) 839-2041",
    f_number: 32,
    f_date: "2026-08-09",
    f_checkbox: true,
    f_rating: 5,
    f_single_select: "Developer",
    f_multi_select: ["React", "Next.js", "TypeScript", "TailwindCSS"],
  };

  const finalValidationResult = validateAnswers(testFields, fullValidFormPayload);

  console.log("FINAL SUBMISSION VALIDATION STATUS:", finalValidationResult.valid ? "✅ VALID" : "❌ INVALID");
  if (!finalValidationResult.valid) {
    console.error("Submission Errors:", finalValidationResult.errors);
  }

  console.log("\n📦 FINAL FORM STATE PAYLOAD UPON SUBMISSION:");
  console.log(JSON.stringify(finalValidationResult.cleanedAnswers, null, 2));
  console.log("\n==========================================================================");
}

runTestSuite().catch(console.error);
