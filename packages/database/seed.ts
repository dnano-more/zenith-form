import { db } from "./index";
import { usersTable, formsTable, formFieldsTable, formResponsesTable } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting Zenith Form Database Seed...");

  // 1. Ensure Demo Guest User exists
  const GUEST_EMAIL = "demo@zenithform.com";
  let [guestUser] = await db.select().from(usersTable).where(eq(usersTable.email, GUEST_EMAIL)).limit(1);

  if (!guestUser) {
    [guestUser] = await db
      .insert(usersTable)
      .values({
        fullName: "Demo Creator",
        email: GUEST_EMAIL,
        emailVerified: true,
      })
      .returning();
  }

  const creatorId = guestUser!.id;
  console.log(`👤 Using Creator User ID: ${creatorId}`);

  // 2. Create Sample Form 1: Customer Satisfaction Survey
  const [form1] = await db
    .insert(formsTable)
    .values({
      creatorId,
      title: "Customer Satisfaction Survey",
      description: "Help us improve our service by sharing your honest feedback.",
      slug: "customer-satisfaction-survey",
      theme: "default",
      visibility: "public",
      status: "published",
      publishedAt: new Date(),
    })
    .returning();

  if (form1) {
    const [field1] = await db.insert(formFieldsTable).values({
      formId: form1.id,
      type: "rating",
      label: "How satisfied are you with our overall product quality?",
      required: true,
      order: 0,
    }).returning();

    const [field2] = await db.insert(formFieldsTable).values({
      formId: form1.id,
      type: "single_select",
      label: "How often do you use our application?",
      required: true,
      order: 1,
      options: ["Daily", "Weekly", "Monthly", "Rarely"],
    }).returning();

    const [field3] = await db.insert(formFieldsTable).values({
      formId: form1.id,
      type: "long_text",
      label: "What features would you like us to build next?",
      placeholder: "Write your feature requests here...",
      required: false,
      order: 2,
    }).returning();

    // Fake responses
    if (field1 && field2 && field3) {
      await db.insert(formResponsesTable).values([
        {
          formId: form1.id,
          answers: { [field1.id]: 5, [field2.id]: "Daily", [field3.id]: "Dark mode customization and export to PDF" },
        },
        {
          formId: form1.id,
          answers: { [field1.id]: 4, [field2.id]: "Weekly", [field3.id]: "More template options" },
        },
      ]);
    }
  }

  // 3. Create Sample Form 2: Developer Tech Stack Poll
  const [form2] = await db
    .insert(formsTable)
    .values({
      creatorId,
      title: "Developer Tech Stack & Preference Poll",
      description: "A community poll exploring popular frontend frameworks and API tools.",
      slug: "developer-tech-stack-poll",
      theme: "dark",
      visibility: "public",
      status: "published",
      publishedAt: new Date(),
    })
    .returning();

  if (form2) {
    const [f1] = await db.insert(formFieldsTable).values({
      formId: form2.id,
      type: "multi_select",
      label: "Which web frameworks do you use in production?",
      required: true,
      order: 0,
      options: ["Next.js", "React", "Vue", "Svelte", "Express / Node"],
    }).returning();

    const [f2] = await db.insert(formFieldsTable).values({
      formId: form2.id,
      type: "short_text",
      label: "What is your primary programming language?",
      placeholder: "e.g. TypeScript, Python, Go",
      required: true,
      order: 1,
    }).returning();

    if (f1 && f2) {
      await db.insert(formResponsesTable).values([
        { formId: form2.id, answers: { [f1.id]: ["Next.js", "React", "Express / Node"], [f2.id]: "TypeScript" } },
        { formId: form2.id, answers: { [f1.id]: ["React", "Vue"], [f2.id]: "JavaScript" } },
      ]);
    }
  }

  console.log("✅ Seed completed successfully with 2 sample published forms & responses!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
