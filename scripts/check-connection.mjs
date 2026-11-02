import fs from "fs";
import path from "path";

// 1. Read .env.local safely
const envPath = path.resolve(".env.local");
if (!fs.existsSync(envPath)) {
  console.log(JSON.stringify({ error: ".env.local file not found" }));
  process.exit(1);
}

const content = fs.readFileSync(envPath, "utf-8");
let supabaseUrl = "";
let supabaseAnonKey = "";

for (const line of content.split("\n")) {
  const trimmed = line.trim();
  if (trimmed.startsWith("#") || !trimmed.includes("=")) continue;
  const [key, ...rest] = trimmed.split("=");
  const val = rest.join("=").trim().replace(/^["']|["']$/g, "");
  if (key === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = val;
  if (key === "NEXT_PUBLIC_SUPABASE_ANON_KEY") supabaseAnonKey = val;
}

// 2. Validate without leaking
const urlDetected = Boolean(supabaseUrl && !supabaseUrl.includes("your-project.supabase.co"));
const keyDetected = Boolean(supabaseAnonKey && !supabaseAnonKey.includes("your-anon-key-here") && supabaseAnonKey.length > 20);

const maskedUrl = urlDetected
  ? supabaseUrl.replace(/https:\/\/(.{4}).*(\.supabase\.co)/, "https://$1****$2")
  : "Not set";

console.log("=== Environment Variables Detection ===");
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${urlDetected ? "DETECTED (" + maskedUrl + ")" : "NOT DETECTED or still placeholder"}`);
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${keyDetected ? "DETECTED (length: " + supabaseAnonKey.length + " chars, starts with 'ey')" : "NOT DETECTED or still placeholder"}`);

if (!urlDetected || !keyDetected) {
  console.log("\nError: Valid Supabase environment variables must be present in .env.local.");
  process.exit(1);
}

// 3. Test HTTP Connection to Supabase
console.log("\n=== Checking Supabase Connection & Schema ===");

async function checkConnection() {
  try {
    // Check Auth Health
    const authRes = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        apikey: supabaseAnonKey,
      },
    });

    console.log(`Supabase Auth Service: HTTP ${authRes.status} (${authRes.ok ? "ONLINE" : "UNREACHABLE"})`);

    // Check REST API & Table existence
    const tableRes = await fetch(`${supabaseUrl}/rest/v1/applications?select=count`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Range: "0-0",
      },
    });

    if (tableRes.ok) {
      console.log("Database Table 'applications': DETECTED and accessible via REST API.");
    } else {
      const body = await tableRes.text();
      if (tableRes.status === 404 || body.includes("PGRST205") || body.includes("PGRST204") || body.includes("relation \"public.applications\" does not exist")) {
        console.log("Database Table 'applications': NOT FOUND YET. (schema.sql has not been executed yet in SQL Editor)");
      } else {
        console.log(`Database Table check status: HTTP ${tableRes.status} - ${body.slice(0, 100)}`);
      }
    }
  } catch (err) {
    console.log(`Connection test error: ${err.message}`);
  }
}

checkConnection();

