#!/usr/bin/env node
/**
 * CRM Seed Script
 * Creates: 50 leads, 10 contacts, 20 deals, 4 roles, 2 API tokens
 * Usage: node seed.js
 */

const BASE_URL = "http://localhost:8080/api/v1";
const EMAIL = "himanshu@shipmymeds.com";
const PASSWORD = "1234567890";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function api(method, path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `${method} ${path} → ${res.status}: ${JSON.stringify(json)}`,
    );
  }
  return json;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFloat(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}
function futureDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
}

// ── Seed Data ────────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Sai",
  "Arjun",
  "Rahul",
  "Priya",
  "Anjali",
  "Sneha",
  "Neha",
  "Riya",
  "Pooja",
  "Rohit",
  "Amit",
  "Vikram",
  "Karan",
  "Deepak",
  "Sunita",
  "Meera",
  "Kavya",
];
const LAST_NAMES = [
  "Sharma",
  "Gupta",
  "Patel",
  "Singh",
  "Kumar",
  "Verma",
  "Joshi",
  "Mehta",
  "Nair",
  "Reddy",
  "Bose",
  "Das",
  "Jain",
  "Chowdhury",
  "Pillai",
];
const COMPANIES = [
  "TechNova",
  "CloudBase",
  "Infovista",
  "DataPeak",
  "SwiftSoft",
  "NexGen",
  "BrightOps",
  "ClearPath",
  "Momentum",
  "Pinnacle",
  "Vertex",
  "Synapse",
  "Orion",
  "Catalyst",
  "Fusion",
];
const POSITIONS = [
  "CEO",
  "CTO",
  "VP Sales",
  "Sales Manager",
  "Account Executive",
  "Business Dev",
  "Marketing Head",
  "Product Manager",
  "Operations Lead",
  "Director",
];
const SOURCES = [
  "website",
  "referral",
  "cold_call",
  "social_media",
  "event",
  "email_campaign",
  "partner",
];
const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
];
const DEAL_STAGES = [
  "prospecting",
  "qualification",
  "proposal",
  "negotiation",
  "closed_won",
  "closed_lost",
];
const LEAD_TAGS = [
  "hot",
  "warm",
  "cold",
  "enterprise",
  "smb",
  "priority",
  "follow-up",
  "demo-scheduled",
];
const PERMISSIONS = [
  "leads.view",
  "leads.create",
  "leads.edit",
  "leads.delete",
  "contacts.view",
  "contacts.create",
  "contacts.edit",
  "deals.view",
  "deals.create",
  "deals.edit",
  "analytics.view",
  "roles.view",
];

function randomName() {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}
function randomEmail(name) {
  const slug = name
    .toLowerCase()
    .replace(/\s+/, ".")
    .replace(/[^a-z.]/g, "");
  const domains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "company.io",
    "corp.in",
    "biz.co",
  ];
  return `${slug}${rand(1, 99)}@${pick(domains)}`;
}
function randomPhone() {
  return `+91${rand(7000000000, 9999999999)}`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🚀  CRM Seed Script starting…\n");

  // 1. Login
  console.log("🔑  Logging in…");
  const { data: authData } = await api("POST", "/auth/login", {
    email: EMAIL,
    password: PASSWORD,
  });
  const token = authData?.token;
  if (!token) throw new Error("Login failed — no token returned");
  console.log(`✅  Logged in. Token: ${token.slice(0, 20)}…\n`);

  // ── 2. Roles ────────────────────────────────────────────────────────────────
  console.log("🎭  Creating 4 roles…");
  const roleDefs = [
    { name: "Super Admin", permissions: PERMISSIONS },
    {
      name: "Sales Manager",
      permissions: [
        "leads.view",
        "leads.create",
        "leads.edit",
        "deals.view",
        "deals.create",
        "deals.edit",
        "contacts.view",
        "contacts.create",
        "analytics.view",
      ],
    },
    {
      name: "Sales Rep",
      permissions: [
        "leads.view",
        "leads.create",
        "contacts.view",
        "contacts.create",
        "deals.view",
        "deals.create",
      ],
    },
    {
      name: "Analyst",
      permissions: [
        "leads.view",
        "contacts.view",
        "deals.view",
        "analytics.view",
      ],
    },
  ];
  const roleIds = [];
  for (const role of roleDefs) {
    try {
      const res = await api("POST", "/roles", role, token);
      const id = res.data?._id || res.data?.id || res._id || res.id;
      roleIds.push(id);
      console.log(`  ✔  Role: ${role.name}`);
    } catch (e) {
      console.warn(`  ⚠  Role "${role.name}" skipped: ${e.message}`);
    }
  }
  console.log(`\n✅  Roles done (${roleIds.length}/4)\n`);

  // ── 3. Contacts ──────────────────────────────────────────────────────────────
  console.log("👤  Creating 10 contacts…");
  const contactIds = [];
  for (let i = 0; i < 10; i++) {
    const name = randomName();
    const body = {
      name,
      email: randomEmail(name),
      phone: randomPhone(),
      company: pick(COMPANIES),
      position: pick(POSITIONS),
      tags: [pick(LEAD_TAGS), pick(LEAD_TAGS)].filter(
        (v, idx, a) => a.indexOf(v) === idx,
      ),
      notes: `Contacted via ${pick(SOURCES)}. Potential ${pick(["enterprise", "SMB", "startup"])} client.`,
    };
    try {
      const res = await api("POST", "/contacts", body, token);
      const id = res.data?._id || res.data?.id || res._id || res.id;
      contactIds.push(id);
      console.log(`  ✔  Contact ${i + 1}: ${name}`);
    } catch (e) {
      console.warn(`  ⚠  Contact ${i + 1} skipped: ${e.message}`);
    }
  }
  console.log(`\n✅  Contacts done (${contactIds.length}/10)\n`);

  // ── 4. Leads ─────────────────────────────────────────────────────────────────
  console.log("📋  Creating 50 leads…");
  const leadIds = [];
  const leadTitles = [
    "Enterprise Software Deal",
    "Cloud Migration Project",
    "Security Audit Contract",
    "ERP Implementation",
    "CRM Rollout",
    "Digital Transformation",
    "Data Analytics Platform",
    "Mobile App Development",
    "Web Redesign Project",
    "IoT Integration",
    "AI Chatbot Setup",
    "Managed Services Agreement",
    "Annual Support Contract",
    "SaaS Subscription Upgrade",
    "Marketing Automation",
    "HR System Overhaul",
    "Finance Module License",
    "Compliance Reporting Tool",
    "Logistics Software Deal",
    "Healthcare Platform",
    "E-commerce Solution",
    "Supply Chain Optimization",
    "Customer Portal Build",
    "Partner Portal Setup",
    "API Integration Services",
    "DevOps Consulting",
    "Infrastructure Audit",
    "Network Upgrade",
    "Cybersecurity Training",
    "Backup & Recovery",
    "Multi-site Rollout",
    "Staff Augmentation",
    "Product Launch Campaign",
    "Brand Identity Project",
    "SEO & Analytics Package",
    "Performance Optimization",
    "Database Migration",
    "Legacy Modernization",
    "Payment Gateway Integration",
    "Reporting Dashboard",
    "Inventory Management",
    "Field Service Software",
    "Reservation System",
    "Event Management Tool",
    "Learning Management System",
    "Customer Onboarding Flow",
    "Automated Billing Setup",
    "Predictive Analytics",
    "Document Management",
    "Workflow Automation",
  ];
  for (let i = 0; i < 50; i++) {
    const body = {
      title:
        leadTitles[i % leadTitles.length] +
        (i >= leadTitles.length
          ? ` ${Math.floor(i / leadTitles.length) + 1}`
          : ""),
      status: pick(LEAD_STATUSES),
      value: randFloat(5000, 250000),
      source: pick(SOURCES),
      tags: [pick(LEAD_TAGS), pick(LEAD_TAGS)].filter(
        (v, idx, a) => a.indexOf(v) === idx,
      ),
      notes: `Lead generated via ${pick(SOURCES)}. Decision maker: ${randomName()}.`,
      expected_close_date: futureDate(rand(15, 120)),
      ...(contactIds.length ? { contact_id: pick(contactIds) } : {}),
    };
    try {
      const res = await api("POST", "/leads", body, token);
      const id = res.data?._id || res.data?.id || res._id || res.id;
      leadIds.push(id);
      if ((i + 1) % 10 === 0) console.log(`  ✔  Leads created: ${i + 1}/50`);
    } catch (e) {
      console.warn(`  ⚠  Lead ${i + 1} skipped: ${e.message}`);
    }
  }
  console.log(`\n✅  Leads done (${leadIds.length}/50)\n`);

  // ── 5. Deals ─────────────────────────────────────────────────────────────────
  console.log("💼  Creating 20 deals…");
  const dealIds = [];
  const dealTitles = [
    "Enterprise License Renewal",
    "Cloud Services Contract",
    "Managed Support Deal",
    "Professional Services Engagement",
    "Platform Expansion Package",
    "Annual SaaS Agreement",
    "Consulting Retainer",
    "Implementation Project",
    "Technology Partnership",
    "Digital Upgrade Bundle",
    "Security Suite Contract",
    "Analytics Premium Plan",
    "Dedicated Account Package",
    "Growth Plan Upgrade",
    "Custom Development Deal",
    "Infrastructure Services",
    "Multi-year Support Agreement",
    "Training & Certification Bundle",
    "Integration Services Deal",
    "Premium Onboarding Package",
  ];
  for (let i = 0; i < 20; i++) {
    const stage = pick(DEAL_STAGES);
    const body = {
      title: dealTitles[i],
      stage,
      amount: randFloat(10000, 500000),
      currency: "INR",
      probability: rand(10, 95),
      expected_close_date: futureDate(rand(7, 90)),
      notes: `Deal sourced from ${pick(SOURCES)}. ${pick(["High priority.", "Follow up next week.", "Awaiting proposal approval.", "In final negotiations.", "Demo completed."])}`,
      ...(contactIds.length ? { contact_id: pick(contactIds) } : {}),
      ...(leadIds.length ? { lead_id: pick(leadIds) } : {}),
    };
    try {
      const res = await api("POST", "/deals", body, token);
      const id = res.data?._id || res.data?.id || res._id || res.id;
      dealIds.push(id);
      console.log(`  ✔  Deal ${i + 1}: ${dealTitles[i]} [${stage}]`);
    } catch (e) {
      console.warn(`  ⚠  Deal ${i + 1} skipped: ${e.message}`);
    }
  }
  console.log(`\n✅  Deals done (${dealIds.length}/20)\n`);

  // ── 6. API Tokens ────────────────────────────────────────────────────────────
  console.log("🔐  Creating 2 API tokens…");
  const tokenDefs = [
    { name: "CI/CD Pipeline Token" },
    { name: "Analytics Integration Token" },
  ];
  for (const t of tokenDefs) {
    try {
      const res = await api("POST", "/tokens", t, token);
      const plain =
        res.data?.plain_text_token || res.data?.token || "(see response)";
      console.log(`  ✔  Token: ${t.name} → ${String(plain).slice(0, 30)}…`);
    } catch (e) {
      console.warn(`  ⚠  Token "${t.name}" skipped: ${e.message}`);
    }
  }
  console.log("\n✅  API tokens done\n");

  // ── Summary ──────────────────────────────────────────────────────────────────
  console.log("━".repeat(50));
  console.log("✅  Seed complete!");
  console.log(`   Roles:        ${roleIds.length}`);
  console.log(`   Contacts:     ${contactIds.length}`);
  console.log(`   Leads:        ${leadIds.length}`);
  console.log(`   Deals:        ${dealIds.length}`);
  console.log("   API Tokens:   2");
  console.log("━".repeat(50));
}

main().catch((err) => {
  console.error("\n❌  Seed failed:", err.message);
  process.exit(1);
});
