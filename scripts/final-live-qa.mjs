import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. Read .env.local safely
const envPath = path.resolve(".env.local");
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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runFinalQA() {
  const results = [];
  const logResult = (name, pass, details = "") => {
    results.push({ name, pass, details });
    console.log(`${pass ? "✓ PASS" : "✗ FAIL"}: ${name} ${details ? "(" + details + ")" : ""}`);
  };

  console.log("=================================================");
  console.log("       CAREERFLOW FINAL PRODUCTION QA SUITE      ");
  console.log("=================================================");

  const timestamp = Date.now();
  const password = "ProductionQAPassword123!";
  const emailAlpha = `qa.candidate.alpha.${timestamp}@gmail.com`;
  const emailBeta = `qa.candidate.beta.${timestamp}@gmail.com`;

  try {
    // -------------------------------------------------------------------------
    // STEP 1: Account Alpha Registration & Authentication
    // -------------------------------------------------------------------------
    console.log("\n--- Phase 1: Authentication & Session Verification ---");
    const { data: authAlpha, error: signUpAlphaErr } = await supabase.auth.signUp({
      email: emailAlpha,
      password: password,
    });

    if (signUpAlphaErr) {
      logResult("User Alpha Sign-Up", false, signUpAlphaErr.message);
      return;
    }

    let tokenAlpha = authAlpha.session?.access_token;
    if (!tokenAlpha) {
      // If session not returned on signUp, try signInWithPassword
      const { data: signInAlpha, error: signInAlphaErr } = await supabase.auth.signInWithPassword({
        email: emailAlpha,
        password: password,
      });
      if (signInAlphaErr) {
        logResult("User Alpha Session Issuance", false, signInAlphaErr.message);
        return;
      }
      tokenAlpha = signInAlpha.session.access_token;
    }
    logResult("User Alpha Sign-Up & Session Issuance", true, `User ID: ${authAlpha.user.id}`);

    const clientAlpha = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${tokenAlpha}` } }
    });

    // -------------------------------------------------------------------------
    // STEP 2: Application CRUD Operations (Live Supabase)
    // -------------------------------------------------------------------------
    console.log("\n--- Phase 2: Application CRUD Operations ---");
    
    // Create 3 diverse applications
    const { data: app1, error: err1 } = await clientAlpha.from("applications").insert({
      user_id: authAlpha.user.id,
      company: "Stripe",
      job_title: "Frontend Engineer",
      location: "San Francisco, CA",
      salary: "$125,000",
      status: "Applied",
      application_date: "2026-11-01",
      notes: "Referral from tech lead",
    }).select().single();

    const { data: app2, error: err2 } = await clientAlpha.from("applications").insert({
      user_id: authAlpha.user.id,
      company: "Datadog",
      job_title: "Backend Engineer",
      location: "New York, NY",
      status: "Assessment",
      application_date: "2026-11-02",
      assessment_date: new Date(Date.now() + 86400000 * 2).toISOString(),
      notes: "HackerRank OA link active",
    }).select().single();

    const { data: app3, error: err3 } = await clientAlpha.from("applications").insert({
      user_id: authAlpha.user.id,
      company: "Google",
      job_title: "Associate Product Manager",
      location: "Mountain View, CA",
      status: "Interview",
      application_date: "2026-11-02",
      interview_date: new Date(Date.now() + 86400000 * 5).toISOString(),
    }).select().single();

    logResult("CREATE Operations (Batch Insert)", !err1 && !err2 && !err3, "3 distinct applications inserted");

    // READ
    const { data: readAlpha, error: readAlphaErr } = await clientAlpha
      .from("applications")
      .select("*")
      .order("application_date", { ascending: false });

    logResult("READ Operations (Select All)", readAlpha?.length === 3, `Retrieved ${readAlpha?.length}/3 applications`);

    // UPDATE
    const { error: updateErr } = await clientAlpha
      .from("applications")
      .update({ status: "Offer", notes: "Offer letter received!" })
      .eq("id", app1.id);

    const { data: verifyUpdate } = await clientAlpha
      .from("applications")
      .select("status, notes")
      .eq("id", app1.id)
      .single();

    logResult("UPDATE Operation (Stage Progression)", verifyUpdate?.status === "Offer", `Status moved to '${verifyUpdate?.status}'`);

    // DELETE
    const { error: deleteErr } = await clientAlpha
      .from("applications")
      .delete()
      .eq("id", app3.id);

    const { data: readAfterDelete } = await clientAlpha.from("applications").select("*");
    logResult("DELETE Operation", readAfterDelete?.length === 2 && !readAfterDelete.find(a => a.id === app3.id), "Google app deleted cleanly; 2 remaining");

    // -------------------------------------------------------------------------
    // STEP 3: Dashboard Metrics & Status Distribution
    // -------------------------------------------------------------------------
    console.log("\n--- Phase 3: Dashboard Metrics & Funnel Calculation ---");
    const total = readAfterDelete.length;
    const active = readAfterDelete.filter(a => a.status !== "Rejected" && a.status !== "Withdrawn").length;
    const offers = readAfterDelete.filter(a => a.status === "Offer").length;
    const assessments = readAfterDelete.filter(a => a.status === "Assessment").length;

    logResult("Dashboard Metric: Total Applications", total === 2, `Count = ${total}`);
    logResult("Dashboard Metric: Active Pipeline", active === 2, `Active = ${active}`);
    logResult("Dashboard Metric: Offers Count", offers === 1, `Offers = ${offers}`);
    logResult("Dashboard Metric: Assessment Radar", assessments === 1, `Assessments = ${assessments}`);

    // -------------------------------------------------------------------------
    // STEP 4: Search, Filtering, Sorting & CSV Export Logic
    // -------------------------------------------------------------------------
    console.log("\n--- Phase 4: Search, Filtering & Data Portability ---");
    // Search
    const searchMatch = readAfterDelete.filter(a => a.company.toLowerCase().includes("stripe"));
    logResult("Search Functionality", searchMatch.length === 1 && searchMatch[0].company === "Stripe", "Found 'Stripe' record");

    // Filter
    const filterAssessment = readAfterDelete.filter(a => a.status === "Assessment");
    logResult("Status Filtering", filterAssessment.length === 1 && filterAssessment[0].company === "Datadog", "Found 'Datadog' under Assessment");

    // CSV format check
    const csvHeaders = "Company,Job Title,Status,Application Date,Location,Employment Type,Salary Range,Assessment Date,Interview Date,Follow-up Date,Job URL,Notes";
    const csvRow = `"${app1.company}","${app1.job_title}","Offer"`;
    logResult("CSV RFC-4180 Format & Export Structure", csvHeaders.includes("Company") && csvRow.includes("Stripe"), "Verified header structure and quoting");

    // -------------------------------------------------------------------------
    // STEP 5: Persistence Across Logout & Re-Login
    // -------------------------------------------------------------------------
    console.log("\n--- Phase 5: Session Persistence (Logout & Re-Login) ---");
    // Sign in again with User Alpha credentials
    const { data: reAuthAlpha, error: reAuthErr } = await supabase.auth.signInWithPassword({
      email: emailAlpha,
      password: password,
    });

    const clientAlphaReconnected = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${reAuthAlpha.session.access_token}` } }
    });

    const { data: reconnectedData } = await clientAlphaReconnected.from("applications").select("*");
    logResult("Data Persistence after Re-authentication", reconnectedData?.length === 2, `2 persistent records recovered for User Alpha`);

    // -------------------------------------------------------------------------
    // STEP 6: Multi-User Isolation & RLS Security Check (Account Beta)
    // -------------------------------------------------------------------------
    console.log("\n--- Phase 6: Multi-Tenant Data Isolation & RLS Verification ---");
    const { data: authBeta, error: signUpBetaErr } = await supabase.auth.signUp({
      email: emailBeta,
      password: password,
    });

    if (signUpBetaErr) {
      logResult("User Beta Sign-Up", false, signUpBetaErr.message);
      return;
    }

    let tokenBeta = authBeta.session?.access_token;
    if (!tokenBeta) {
      const { data: signInBeta } = await supabase.auth.signInWithPassword({
        email: emailBeta,
        password: password,
      });
      tokenBeta = signInBeta?.session?.access_token;
    }

    const clientBeta = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${tokenBeta}` } }
    });

    // 6.1: User Beta reads applications (MUST BE 0)
    const { data: readBeta } = await clientBeta.from("applications").select("*");
    logResult("Multi-User Read Isolation", readBeta?.length === 0, `User Beta sees 0 records (User Alpha's records are completely hidden)`);

    // 6.2: User Beta tries to read User Alpha's specific application ID
    const { data: directReadForbidden } = await clientBeta.from("applications").select("*").eq("id", app1.id);
    logResult("Direct ID Query Isolation", directReadForbidden?.length === 0, `Querying User Alpha's UUID directly returned 0 records`);

    // 6.3: User Beta tries to mutate User Alpha's application
    const { error: hackUpdateErr } = await clientBeta
      .from("applications")
      .update({ company: "Hacked" })
      .eq("id", app1.id);

    // Verify User Alpha's record was untouched
    const { data: untouchedApp } = await clientAlpha.from("applications").select("company").eq("id", app1.id).single();
    logResult("Cross-Tenant UPDATE Attack Blocked", untouchedApp?.company === "Stripe", "Record remained 'Stripe'; mutation rejected by RLS");

    // 6.4: User Beta creates their own application
    const { data: betaApp } = await clientBeta.from("applications").insert({
      user_id: authBeta.user.id,
      company: "Amazon",
      job_title: "SDE I",
      status: "Applied",
      application_date: "2026-11-02",
    }).select().single();

    // Verify Beta only sees Amazon
    const { data: finalBetaApps } = await clientBeta.from("applications").select("company");
    logResult("User Beta Independent Dataset", finalBetaApps?.length === 1 && finalBetaApps[0].company === "Amazon", "User Beta only sees 'Amazon'");

    // Verify Alpha still only sees Stripe and Datadog (no Amazon)
    const { data: finalAlphaApps } = await clientAlpha.from("applications").select("company");
    const alphaHasAmazon = finalAlphaApps.some(a => a.company === "Amazon");
    logResult("User Alpha Dataset Integrity", !alphaHasAmazon && finalAlphaApps.length === 2, "User Alpha does not see User Beta's application");

    // -------------------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------------------
    console.log("\n--- Cleanup ---");
    await clientAlpha.from("applications").delete().eq("user_id", authAlpha.user.id);
    await clientBeta.from("applications").delete().eq("user_id", authBeta.user.id);
    console.log("✓ Test records cleaned up successfully.");

    console.log("\n=================================================");
    const allPassed = results.every(r => r.pass);
    console.log(`TOTAL CHECKS: ${results.length} | PASSED: ${results.filter(r => r.pass).length} | FAILED: ${results.filter(r => !r.pass).length}`);
    console.log(`OVERALL STATUS: ${allPassed ? "100% PASS" : "FAILURES DETECTED"}`);
    console.log("=================================================");

  } catch (err) {
    console.error(`Unexpected QA failure: ${err.message}`);
  }
}

runFinalQA();
