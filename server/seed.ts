// Seed script to populate initial resources
import { db } from "./db";
import { resources } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  const defaultResources = [
    {
      title: "Digital Safety Course",
      description: "Learn how to secure your accounts, spot phishing, and lock down your privacy settings.",
      category: "education",
      actionText: "Start Learning",
      icon: "BookOpen",
      link: "#",
    },
    {
      title: "Regional Directory",
      description: "Find NGOs, shelters, and legal aid tailored to your location and language.",
      category: "support",
      actionText: "Find Help",
      icon: "Globe",
      link: "#",
    },
    {
      title: "Psychological Support",
      description: "Connect with counselors specializing in digital trauma and cyberbullying recovery.",
      category: "support",
      actionText: "Connect Now",
      icon: "UserCheck",
      link: "#",
    },
    {
      title: "Emergency Hotline",
      description: "24/7 crisis support for immediate danger or severe harassment.",
      category: "emergency",
      actionText: "Call Now",
      icon: "Phone",
      link: "tel:911",
    },
  ];

  // Check if resources already exist
  const existing = await db.select().from(resources);
  
  if (existing.length === 0) {
    await db.insert(resources).values(defaultResources);
    console.log(`✅ Seeded ${defaultResources.length} resources`);
  } else {
    console.log(`ℹ️ Resources already exist (${existing.length} found)`);
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
