// MongoDB initialization script
// Creates the CRM database and indexes on first startup

db = db.getSiblingDB("crm_db");

// Ensure collections exist
db.createCollection("companies");
db.createCollection("users");
db.createCollection("roles");
db.createCollection("permissions");
db.createCollection("leads");
db.createCollection("contacts");
db.createCollection("deals");
db.createCollection("subscriptions");

// ── Indexes ──────────────────────────────────────────────────────────────────

// Users: unique email per company
db.users.createIndex({ company_id: 1, email: 1 }, { unique: true });
db.users.createIndex({ company_id: 1 });

// Leads
db.leads.createIndex({ company_id: 1, status: 1 });
db.leads.createIndex({ company_id: 1, assigned_to: 1 });
db.leads.createIndex({ company_id: 1, created_at: -1 });

// Contacts
db.contacts.createIndex({ company_id: 1 });
db.contacts.createIndex({ company_id: 1, email: 1 });

// Deals
db.deals.createIndex({ company_id: 1, stage: 1 });
db.deals.createIndex({ company_id: 1, closed_at: 1 });
db.deals.createIndex({ company_id: 1, assigned_to: 1 });

// Roles
db.roles.createIndex({ company_id: 1, name: 1 }, { unique: true });

// Subscriptions
db.subscriptions.createIndex({ company_id: 1 }, { unique: true });
db.subscriptions.createIndex({ expires_at: 1 });

print("CRM database initialized with indexes.");
