import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY_STORAGE = "pmtoolkit_gemini_key";

export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || "";
}

export function setApiKey(key) {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE);
  }
}

export function hasApiKey() {
  return !!getApiKey();
}

// Abort controller for cancelling in-flight requests
let _currentAbort = null;

export function cancelCurrentRequest() {
  if (_currentAbort) {
    _currentAbort.abort();
    _currentAbort = null;
  }
}

function createAbortController() {
  cancelCurrentRequest();
  _currentAbort = new AbortController();
  return _currentAbort;
}

function getModel(systemInstruction) {
  const key = getApiKey();
  if (!key) throw new Error("No Gemini API key configured. Please add your API key to continue.");
  const genAI = new GoogleGenerativeAI(key);
  const config = { model: "gemini-3.1-flash-lite" };
  if (systemInstruction) config.systemInstruction = systemInstruction;
  return genAI.getGenerativeModel(config);
}

function cleanJSON(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  return cleaned;
}

// Retry wrapper with exponential backoff for rate-limit (429) errors
async function withRetry(fn, signal, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (signal?.aborted) throw new DOMException("Request cancelled", "AbortError");
    try {
      return await fn();
    } catch (err) {
      if (err.name === "AbortError") throw err;
      const msg = err?.message || "";
      const is429 = msg.includes("429") || msg.includes("quota") || msg.includes("rate") || msg.includes("Resource has been exhausted");
      if (!is429 || attempt === maxRetries) throw err;

      // Parse retry delay from error if available, otherwise use exponential backoff
      let waitSec = Math.min(15 * Math.pow(2, attempt), 120);
      const match = msg.match(/retry in ([\d.]+)/i);
      if (match) waitSec = Math.ceil(parseFloat(match[1])) + 2;

      // Dispatch a custom event so UI can show countdown
      window.dispatchEvent(new CustomEvent("api-retry", { detail: { waitSec, attempt: attempt + 1, maxRetries } }));
      // Cancellable sleep
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, waitSec * 1000);
        signal?.addEventListener("abort", () => { clearTimeout(timer); reject(new DOMException("Request cancelled", "AbortError")); }, { once: true });
      });
    }
  }
}

// Generate content with auto-retry and JSON parsing
async function generateJSON(prompt, systemInstruction) {
  const model = getModel(systemInstruction);
  const controller = createAbortController();
  const signal = controller.signal;
  try {
    return await withRetry(async () => {
      const result = await model.generateContent(prompt, { signal });
      return JSON.parse(cleanJSON(result.response.text()));
    }, signal);
  } finally {
    if (_currentAbort === controller) _currentAbort = null;
  }
}

export async function generatePRD(idea, domain, targetUsers) {
  const systemInstruction = "You are a senior AI Product Manager at a top tech company.";
  const prompt = `Generate a comprehensive PRD (Product Requirements Document) for the following product idea.

Product Idea: ${idea}
Domain: ${domain}
Target Users: ${targetUsers}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "title": "Product name",
  "elevator_pitch": "One-liner pitch (max 20 words)",
  "problem_statement": "What problem does this solve (2-3 sentences)",
  "target_audience": ["audience segment 1", "audience segment 2", "audience segment 3"],
  "goals": [
    {"goal": "Goal description", "metric": "How to measure it", "target": "Specific target value"}
  ],
  "features": [
    {"name": "Feature name", "description": "What it does", "priority": "P0|P1|P2", "effort": "Low|Medium|High"}
  ],
  "success_metrics": [
    {"metric": "Metric name", "current_baseline": "Current value or N/A", "target": "Target value", "timeframe": "e.g. 6 months"}
  ],
  "risks": [
    {"risk": "Risk description", "impact": "High|Medium|Low", "mitigation": "How to mitigate"}
  ],
  "technical_considerations": ["consideration 1", "consideration 2"],
  "go_to_market": {
    "strategy": "GTM strategy description",
    "channels": ["channel 1", "channel 2"],
    "timeline": "Launch timeline"
  },
  "competitive_landscape": [
    {"competitor": "Name", "strength": "Their advantage", "our_edge": "Our differentiation"}
  ]
}

Include 4-5 goals, 6-8 features, 4-5 success metrics, 4-5 risks, 3-4 technical considerations, 3 channels, and 2-3 competitors. Be specific with numbers and realistic targets.`;

  return generateJSON(prompt, systemInstruction);
}

export async function parsePRDText(rawText) {
  const systemInstruction = "You are a senior AI Product Manager who excels at structuring product documents.";
  const prompt = `Parse the following PRD (Product Requirements Document) text into a structured JSON format. Extract as much information as you can. If certain fields are not mentioned, infer reasonable values from context.

PRD Text:
${rawText}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "title": "Product name",
  "elevator_pitch": "One-liner pitch (max 20 words)",
  "problem_statement": "What problem does this solve (2-3 sentences)",
  "target_audience": ["audience segment 1", "audience segment 2"],
  "goals": [
    {"goal": "Goal description", "metric": "How to measure it", "target": "Specific target value"}
  ],
  "features": [
    {"name": "Feature name", "description": "What it does", "priority": "P0|P1|P2", "effort": "Low|Medium|High"}
  ],
  "success_metrics": [
    {"metric": "Metric name", "current_baseline": "Current value or N/A", "target": "Target value", "timeframe": "e.g. 6 months"}
  ],
  "risks": [
    {"risk": "Risk description", "impact": "High|Medium|Low", "mitigation": "How to mitigate"}
  ],
  "technical_considerations": ["consideration 1", "consideration 2"],
  "go_to_market": {
    "strategy": "GTM strategy description",
    "channels": ["channel 1", "channel 2"],
    "timeline": "Launch timeline"
  },
  "competitive_landscape": [
    {"competitor": "Name", "strength": "Their advantage", "our_edge": "Our differentiation"}
  ]
}

Extract real data from the text. Fill in all arrays with at least 2-3 items each. If the PRD doesn't mention something, make a reasonable inference based on the product described.`;

  return generateJSON(prompt, systemInstruction);
}

export async function runPrioritization(features, framework) {
  const systemInstruction = "You are a product prioritization expert.";
  const prompt = `Score each feature using the ${framework} framework.

Features:
${JSON.stringify(features, null, 2)}

Framework: ${framework}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "framework": "${framework}",
  "scored_features": [
    {
      "name": "Feature name",
      "scores": { ${framework === "RICE" ? '"reach": 0, "impact": 0, "confidence": 0, "effort": 0, "total": 0' : framework === "ICE" ? '"impact": 0, "confidence": 0, "ease": 0, "total": 0' : '"must_have": true, "should_have": false, "could_have": false, "wont_have": false'} },
      "reasoning": "Why this score",
      "recommendation": "Build now | Build next | Consider later | Deprioritize"
    }
  ],
  "execution_order": ["Feature name in order of priority"],
  "summary": "2-3 sentence summary of prioritization rationale"
}

For RICE: Reach (1-10), Impact (1-5), Confidence (0.5-1.0), Effort (1-10, lower is easier). Total = (Reach * Impact * Confidence) / Effort.
For ICE: Impact (1-10), Confidence (1-10), Ease (1-10). Total = Impact * Confidence * Ease.
For MoSCoW: Categorize each feature.

Be realistic and opinionated.`;

  return generateJSON(prompt, systemInstruction);
}

export async function simulateImpact(prd) {
  const systemInstruction = "You are a product analytics expert.";
  const prompt = `Based on this PRD, simulate the expected business impact over 12 months.

PRD Summary:
- Title: ${prd.title}
- Features: ${prd.features.map((f) => f.name).join(", ")}
- Goals: ${prd.goals.map((g) => g.goal).join(", ")}
- Success Metrics: ${prd.success_metrics.map((m) => m.metric + ": " + m.target).join(", ")}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "adoption_curve": [
    {"month": 1, "users": 0, "revenue": 0, "engagement_rate": 0},
    {"month": 2, "users": 0, "revenue": 0, "engagement_rate": 0},
    {"month": 3, "users": 0, "revenue": 0, "engagement_rate": 0},
    {"month": 4, "users": 0, "revenue": 0, "engagement_rate": 0},
    {"month": 5, "users": 0, "revenue": 0, "engagement_rate": 0},
    {"month": 6, "users": 0, "revenue": 0, "engagement_rate": 0},
    {"month": 7, "users": 0, "revenue": 0, "engagement_rate": 0},
    {"month": 8, "users": 0, "revenue": 0, "engagement_rate": 0},
    {"month": 9, "users": 0, "revenue": 0, "engagement_rate": 0},
    {"month": 10, "users": 0, "revenue": 0, "engagement_rate": 0},
    {"month": 11, "users": 0, "revenue": 0, "engagement_rate": 0},
    {"month": 12, "users": 0, "revenue": 0, "engagement_rate": 0}
  ],
  "roi_analysis": {
    "estimated_cost": "$X",
    "estimated_revenue_12m": "$X",
    "roi_percentage": "X%",
    "break_even_month": 0
  },
  "risk_adjusted_outcomes": {
    "best_case": "Description with numbers",
    "expected_case": "Description with numbers",
    "worst_case": "Description with numbers"
  },
  "key_assumptions": ["assumption 1", "assumption 2", "assumption 3"],
  "recommendation": "2-3 sentence executive recommendation"
}

Use realistic numbers. Users should be realistic for the domain. Revenue in USD. Engagement rate as percentage 0-100.`;

  return generateJSON(prompt, systemInstruction);
}

export async function generateStakeholderBrief(prd, prioritization, impact) {
  const systemInstruction = "You are a senior PM preparing a stakeholder brief for leadership.";
  const prompt = `Create a concise, executive-ready brief.

PRD: ${JSON.stringify(prd)}
Prioritization: ${JSON.stringify(prioritization)}
Impact Simulation: ${JSON.stringify(impact)}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "executive_summary": "3-4 sentence summary for C-suite",
  "problem_opportunity": "2-3 sentences on the problem/opportunity",
  "proposed_solution": "2-3 sentences on what we're building",
  "key_metrics": [
    {"metric": "Name", "target": "Target value", "timeframe": "When"}
  ],
  "resource_ask": {
    "team_size": "X engineers, Y designers",
    "timeline": "X months",
    "budget": "$X"
  },
  "risks_and_mitigations": [
    {"risk": "Risk", "mitigation": "Plan"}
  ],
  "next_steps": ["Step 1", "Step 2", "Step 3"],
  "decision_needed": "What decision you need from stakeholders"
}`;

  return generateJSON(prompt, systemInstruction);
}

export async function generatePersonas(prd) {
  const systemInstruction = "You are a UX research expert.";
  const prompt = `Based on this product, generate 3 detailed user personas with empathy maps.

Product: ${prd.title}
Problem: ${prd.problem_statement}
Target Audience: ${prd.target_audience.join(", ")}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "personas": [
    {
      "name": "Fictional name",
      "age": 30,
      "role": "Job title / role",
      "location": "City, Country",
      "bio": "2-3 sentence bio",
      "goals": ["goal 1", "goal 2", "goal 3"],
      "frustrations": ["pain 1", "pain 2", "pain 3"],
      "tech_savviness": "Low|Medium|High",
      "empathy_map": {
        "thinks": ["thought 1", "thought 2"],
        "feels": ["feeling 1", "feeling 2"],
        "says": ["quote 1", "quote 2"],
        "does": ["action 1", "action 2"]
      },
      "scenario": "A day-in-the-life scenario showing how they'd use this product (3-4 sentences)"
    }
  ]
}

Make each persona distinctly different — vary demographics, motivations, and tech comfort. Be specific and realistic.`;

  return generateJSON(prompt, systemInstruction);
}

export async function generateUserStories(prd) {
  const systemInstruction = "You are an agile product expert.";
  const prompt = `Generate user stories with acceptance criteria for this product.

Product: ${prd.title}
Features: ${JSON.stringify(prd.features)}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "epics": [
    {
      "epic_name": "Epic name",
      "description": "What this epic covers",
      "stories": [
        {
          "id": "US-001",
          "story": "As a [user type], I want to [action] so that [benefit]",
          "priority": "P0|P1|P2",
          "points": 3,
          "acceptance_criteria": [
            "Given [context], when [action], then [result]",
            "Given [context], when [action], then [result]"
          ],
          "edge_cases": ["edge case 1"]
        }
      ]
    }
  ],
  "total_points": 0,
  "estimated_sprints": 0,
  "velocity_assumption": "X points per sprint"
}

Generate 3-4 epics with 3-4 stories each. Use Fibonacci points (1,2,3,5,8,13). Include realistic edge cases.`;

  return generateJSON(prompt, systemInstruction);
}

export async function generateSprintPlan(prd, stories) {
  const systemInstruction = "You are an engineering manager.";
  const prompt = `Create a sprint-by-sprint execution plan.

Product: ${prd.title}
User Stories: ${JSON.stringify(stories)}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "sprints": [
    {
      "sprint_number": 1,
      "name": "Sprint name / theme",
      "goal": "Sprint goal",
      "duration_weeks": 2,
      "stories": ["US-001", "US-002"],
      "deliverables": ["deliverable 1", "deliverable 2"],
      "risks": "Key risk for this sprint",
      "milestone": "What's achieved by end of sprint"
    }
  ],
  "total_duration_weeks": 0,
  "phases": [
    {
      "phase": "Phase name (e.g. Foundation, Core Features, Polish, Launch)",
      "sprints": [1, 2],
      "color": "#8b5cf6"
    }
  ],
  "dependencies": [
    {"from": "Sprint 1", "to": "Sprint 2", "reason": "Why this dependency exists"}
  ],
  "launch_checklist": ["item 1", "item 2", "item 3", "item 4", "item 5"]
}

Plan 5-8 sprints. Group them into 3-4 phases. Be realistic about velocity.`;

  return generateJSON(prompt, systemInstruction);
}

export async function designExperiments(prd) {
  const systemInstruction = "You are a growth/experimentation PM.";
  const prompt = `Design A/B experiments for this product.

Product: ${prd.title}
Features: ${prd.features.map(f => f.name).join(", ")}
Metrics: ${prd.success_metrics.map(m => m.metric).join(", ")}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "experiments": [
    {
      "id": "EXP-001",
      "name": "Experiment name",
      "hypothesis": "If we [change], then [metric] will [improve/decrease] by [X%] because [reason]",
      "type": "A/B Test|Multivariate|Feature Flag|Holdout",
      "primary_metric": "Metric name",
      "secondary_metrics": ["metric 1", "metric 2"],
      "control": "What the control group sees",
      "variant": "What the variant group sees",
      "sample_size": "X users per group",
      "duration": "X weeks",
      "expected_lift": "X%",
      "confidence_level": "95%",
      "guardrail_metrics": ["metric that should NOT degrade"],
      "decision_criteria": "Ship if X, iterate if Y, kill if Z"
    }
  ],
  "experiment_roadmap": [
    {"quarter": "Q1", "experiments": ["EXP-001", "EXP-002"]},
    {"quarter": "Q2", "experiments": ["EXP-003"]}
  ],
  "culture_notes": "2-3 sentences on building experimentation culture"
}

Design 4-5 experiments. Be specific with hypotheses and sample sizes. Mix quick wins and strategic bets.`;

  return generateJSON(prompt, systemInstruction);
}

export async function analyzeMetricsFramework(prd) {
  const systemInstruction = "You are a product analytics lead.";
  const prompt = `Build a North Star metrics framework for this product.

Product: ${prd.title}
Goals: ${prd.goals.map(g => g.goal).join(", ")}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "north_star": {
    "metric": "The one metric that matters most",
    "definition": "Exact definition of how to calculate it",
    "current": "N/A or baseline",
    "target_6m": "6 month target",
    "target_12m": "12 month target",
    "why": "Why this is the North Star"
  },
  "input_metrics": [
    {
      "metric": "Input metric name",
      "relationship": "How it drives the North Star",
      "owner": "Team that owns this",
      "cadence": "Daily|Weekly|Monthly"
    }
  ],
  "pirate_metrics": {
    "acquisition": {"metric": "metric name", "target": "value", "channel": "primary channel"},
    "activation": {"metric": "metric name", "target": "value", "trigger": "aha moment"},
    "retention": {"metric": "metric name", "target": "value", "cohort": "Day 1/7/30"},
    "revenue": {"metric": "metric name", "target": "value", "model": "pricing model"},
    "referral": {"metric": "metric name", "target": "value", "mechanism": "how referrals work"}
  },
  "dashboard_layout": [
    {"section": "Section name", "metrics": ["metric 1", "metric 2"], "chart_type": "line|bar|number|funnel"}
  ],
  "alert_rules": [
    {"metric": "metric name", "condition": "drops below X%", "severity": "Critical|Warning", "action": "What to do"}
  ]
}

Include 4-5 input metrics, 4-5 dashboard sections, and 3-4 alert rules.`;

  return generateJSON(prompt, systemInstruction);
}

export async function analyzePricing(prd) {
  const systemInstruction = "You are a monetization strategist.";
  const prompt = `Design a pricing strategy for this product.

Product: ${prd.title}
Problem: ${prd.problem_statement}
Target: ${prd.target_audience.join(", ")}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "pricing_model": "Freemium|Subscription|Usage-based|Tiered|Marketplace Commission|One-time",
  "rationale": "Why this model fits (2-3 sentences)",
  "tiers": [
    {
      "name": "Tier name",
      "price": "$X/mo",
      "target_segment": "Who this is for",
      "features": ["feature 1", "feature 2", "feature 3"],
      "limits": "Any usage limits",
      "expected_mix": "X% of users"
    }
  ],
  "unit_economics": {
    "cac": "$X",
    "ltv": "$X",
    "ltv_cac_ratio": "X:1",
    "payback_months": 0,
    "gross_margin": "X%"
  },
  "competitive_pricing": [
    {"competitor": "Name", "price": "$X/mo", "positioning": "How we compare"}
  ],
  "pricing_experiments": [
    {"test": "What to test", "hypothesis": "Expected outcome", "risk": "Downside risk"}
  ],
  "revenue_projection": [
    {"month": 3, "mrr": "$X"},
    {"month": 6, "mrr": "$X"},
    {"month": 12, "mrr": "$X"}
  ]
}

Include 3-4 tiers, 2-3 competitors, and 2-3 pricing experiments. Be specific with dollar amounts.`;

  return generateJSON(prompt, systemInstruction);
}

export async function mapStakeholders(prd) {
  const systemInstruction = "You are a PM lead managing cross-functional stakeholders.";
  const prompt = `Map stakeholders for this product launch.

Product: ${prd.title}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "stakeholders": [
    {
      "name": "Role / Title (not a real person name)",
      "team": "Engineering|Design|Marketing|Sales|Legal|Finance|Leadership|Support|Data",
      "power": 1,
      "interest": 1,
      "strategy": "Manage closely|Keep satisfied|Keep informed|Monitor",
      "communication": "How often and how to communicate",
      "key_concern": "Their primary concern about this product",
      "how_to_win": "How to get their buy-in"
    }
  ],
  "raci_matrix": [
    {
      "activity": "Activity name",
      "responsible": "Role",
      "accountable": "Role",
      "consulted": ["Role"],
      "informed": ["Role"]
    }
  ],
  "communication_plan": [
    {"audience": "Who", "channel": "Slack|Email|Meeting|Doc", "frequency": "How often", "content": "What to share"}
  ]
}

Power and Interest are 1-10 scale. Include 8-10 stakeholders across different teams. 5-6 RACI activities. 4-5 communication items.`;

  return generateJSON(prompt, systemInstruction);
}

export async function scoreResume(resumeText) {
  const systemInstruction = "You are a senior PM hiring manager at a FAANG company.";
  const prompt = `Score and evaluate this resume for Product Management roles.

Resume Text:
${resumeText}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "overall_score": 78,
  "grade": "A|B+|B|B-|C+|C|D",
  "summary": "2-3 sentence overall assessment",
  "categories": [
    {
      "name": "Product Impact & Metrics",
      "score": 85,
      "feedback": "What's good and what's missing",
      "suggestions": ["specific improvement 1", "specific improvement 2"]
    },
    {
      "name": "Technical Depth",
      "score": 70,
      "feedback": "Assessment",
      "suggestions": ["suggestion 1"]
    },
    {
      "name": "Leadership & Cross-functional",
      "score": 75,
      "feedback": "Assessment",
      "suggestions": ["suggestion 1"]
    },
    {
      "name": "Strategy & Vision",
      "score": 65,
      "feedback": "Assessment",
      "suggestions": ["suggestion 1"]
    },
    {
      "name": "Communication & Clarity",
      "score": 80,
      "feedback": "Assessment of how well the resume reads",
      "suggestions": ["suggestion 1"]
    },
    {
      "name": "ATS Optimization",
      "score": 60,
      "feedback": "Keywords, formatting, ATS compatibility",
      "suggestions": ["suggestion 1"]
    }
  ],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "critical_gaps": ["gap 1", "gap 2"],
  "keywords_missing": ["keyword 1", "keyword 2", "keyword 3", "keyword 4"],
  "rewrite_bullets": [
    {
      "original": "Original bullet from resume",
      "improved": "Rewritten with metrics and impact"
    }
  ],
  "target_companies": ["Company 1 and why", "Company 2 and why", "Company 3 and why"],
  "action_plan": [
    {"priority": "P0", "action": "Most important thing to fix", "effort": "Low|Medium|High"},
    {"priority": "P1", "action": "Second priority", "effort": "Low|Medium|High"}
  ]
}

Score 0-100 for each category. Be brutally honest but constructive. Rewrite 2-3 weak bullets. Suggest 4-5 action items.`;

  return generateJSON(prompt, systemInstruction);
}

export async function evaluateLinkedIn(profileText) {
  const systemInstruction = "You are a PM career coach who has reviewed 10,000+ LinkedIn profiles.";
  const prompt = `Evaluate this LinkedIn profile for PM positioning.

LinkedIn Profile Text:
${profileText}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "overall_score": 72,
  "headline_score": 65,
  "current_headline": "Their current headline or N/A",
  "suggested_headlines": ["Option 1", "Option 2", "Option 3"],
  "about_section": {
    "score": 70,
    "has_about": true,
    "feedback": "What's working and what's not",
    "suggested_rewrite": "A compelling 3-4 sentence About section rewrite"
  },
  "experience_score": 75,
  "experience_feedback": "Assessment of how experience is presented",
  "skills_analysis": {
    "present": ["skill 1", "skill 2"],
    "missing_critical": ["missing PM skill 1", "missing PM skill 2"],
    "recommended_add": ["skill to add 1", "skill to add 2", "skill to add 3"]
  },
  "content_strategy": {
    "should_post_about": ["topic 1", "topic 2", "topic 3"],
    "post_frequency": "X times per week",
    "engagement_tips": ["tip 1", "tip 2"]
  },
  "networking_tips": ["tip 1", "tip 2", "tip 3"],
  "profile_completion": {
    "missing_sections": ["section 1", "section 2"],
    "quick_wins": ["quick win 1", "quick win 2", "quick win 3"]
  },
  "competitive_positioning": "2-3 sentences on how they stand out vs other PMs",
  "action_plan": [
    {"priority": "P0", "action": "Do this first", "time": "15 min"},
    {"priority": "P1", "action": "Do this next", "time": "30 min"}
  ]
}

Be specific, actionable, and reference actual content from their profile. Score 0-100.`;

  return generateJSON(prompt, systemInstruction);
}

export async function generateProductTeardown(productName, productUrl) {
  const systemInstruction = "You are a top product strategist.";
  const prompt = `Generate a comprehensive product teardown analysis.

Product: ${productName}
${productUrl ? `URL/Context: ${productUrl}` : ""}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "product_name": "${productName}",
  "company": "Parent company",
  "category": "Product category",
  "summary": "2-3 sentence product overview",
  "business_model": {
    "type": "Freemium|Subscription|Marketplace|etc",
    "revenue_streams": ["stream 1", "stream 2"],
    "estimated_arr": "Estimated ARR range",
    "monetization_rating": 8
  },
  "user_experience": {
    "onboarding_score": 8,
    "onboarding_notes": "How onboarding works and what's good/bad",
    "core_loop": "Description of the core user loop",
    "ux_strengths": ["strength 1", "strength 2"],
    "ux_weaknesses": ["weakness 1", "weakness 2"],
    "aha_moment": "What the aha moment is"
  },
  "growth_engine": {
    "primary_channel": "Main growth channel",
    "growth_loops": ["loop 1", "loop 2"],
    "viral_mechanics": "How virality works (or doesn't)",
    "retention_hooks": ["hook 1", "hook 2"]
  },
  "competitive_moats": ["moat 1", "moat 2", "moat 3"],
  "what_id_change": [
    {
      "area": "Area to improve",
      "current_state": "How it works now",
      "proposed_change": "What I'd do differently",
      "expected_impact": "Why this matters"
    }
  ],
  "pm_lessons": ["Lesson 1 - what PMs can learn", "Lesson 2", "Lesson 3"],
  "rating": {
    "product_market_fit": 8,
    "execution": 7,
    "design": 8,
    "growth": 7,
    "overall": 7.5
  }
}

Be specific and opinionated. Include 3-4 things you'd change. Rate 1-10 scale.`;

  return generateJSON(prompt, systemInstruction);
}

export async function generateBattlecards(prd) {
  const systemInstruction = "You are a competitive intelligence analyst.";
  const prompt = `Create sales battlecards for this product vs its competitors.

Product: ${prd.title}
Problem: ${prd.problem_statement}
Competitors: ${prd.competitive_landscape?.map(c => c.competitor).join(", ") || "Unknown"}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "our_product": {
    "positioning": "One-line positioning statement",
    "key_differentiators": ["diff 1", "diff 2", "diff 3"],
    "ideal_customer": "Who we win with"
  },
  "battlecards": [
    {
      "competitor": "Competitor name",
      "their_positioning": "How they position themselves",
      "their_strengths": ["strength 1", "strength 2"],
      "their_weaknesses": ["weakness 1", "weakness 2"],
      "we_win_when": "Scenarios where we win",
      "we_lose_when": "Scenarios where we lose",
      "objection_handling": [
        {
          "objection": "Common objection from prospect",
          "response": "How to handle it"
        }
      ],
      "trap_questions": ["Question to ask that exposes their weakness"],
      "migration_talking_points": ["Why switching to us is easy/worth it"]
    }
  ],
  "feature_comparison": [
    {
      "feature": "Feature name",
      "us": "How we do it",
      "competitors": {"Competitor 1": "How they do it", "Competitor 2": "How they do it"}
    }
  ],
  "win_loss_patterns": {
    "common_win_reasons": ["reason 1", "reason 2"],
    "common_loss_reasons": ["reason 1", "reason 2"],
    "deal_killers": ["killer 1"]
  }
}

Generate battlecards for 2-3 competitors. Include 2-3 objections per competitor. 4-5 feature comparisons.`;

  return generateJSON(prompt, systemInstruction);
}

export async function generateGTMPlaybook(prd) {
  const systemInstruction = "You are a go-to-market strategist who has launched 50+ products.";
  const prompt = `Create a comprehensive GTM playbook.

Product: ${prd.title}
Problem: ${prd.problem_statement}
Target: ${prd.target_audience.join(", ")}
Features: ${prd.features.map(f => f.name).join(", ")}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "launch_strategy": {
    "type": "Big Bang|Soft Launch|Beta|Phased Rollout",
    "rationale": "Why this approach",
    "target_date": "Relative timeline (e.g., T+12 weeks from development start)"
  },
  "positioning": {
    "statement": "For [target], who [need], [product] is a [category] that [benefit]. Unlike [alternative], we [differentiator].",
    "tagline": "Short catchy tagline",
    "elevator_pitch": "30-second pitch"
  },
  "messaging_matrix": [
    {
      "audience": "Audience segment",
      "pain_point": "Their key pain",
      "message": "Key message for them",
      "proof_point": "Evidence/social proof",
      "cta": "Call to action"
    }
  ],
  "channel_strategy": [
    {
      "channel": "Channel name",
      "objective": "What we want from this channel",
      "tactics": ["tactic 1", "tactic 2"],
      "budget": "$X",
      "expected_cac": "$X",
      "timeline": "When to start"
    }
  ],
  "launch_timeline": [
    {
      "week": "T-4 weeks",
      "phase": "Pre-launch",
      "activities": ["activity 1", "activity 2"],
      "owner": "Team/Role"
    }
  ],
  "launch_day_checklist": ["item 1", "item 2", "item 3", "item 4", "item 5", "item 6"],
  "success_metrics": {
    "day_1": {"metric": "value", "target": "number"},
    "week_1": {"metric": "value", "target": "number"},
    "month_1": {"metric": "value", "target": "number"},
    "quarter_1": {"metric": "value", "target": "number"}
  },
  "risk_mitigation": [
    {"risk": "What could go wrong", "likelihood": "High|Medium|Low", "mitigation": "How to handle it"}
  ]
}

Include 3-4 messaging rows, 4-5 channels, 6-8 timeline entries, and 3-4 risks.`;

  return generateJSON(prompt, systemInstruction);
}

export async function generateOKRs(prd) {
  const systemInstruction = "You are a VP of Product setting OKRs.";
  const prompt = `Generate cascading OKRs for this product.

Product: ${prd.title}
Goals: ${prd.goals.map(g => g.goal).join(", ")}
Metrics: ${prd.success_metrics.map(m => m.metric).join(", ")}

Return a JSON object with exactly this structure (no markdown, no code fences):
{
  "vision": "1-sentence product vision",
  "time_horizon": "Q1 2025 (or appropriate quarter)",
  "company_level": {
    "objective": "Company-level objective this product supports",
    "key_results": [
      {"kr": "Key result 1", "target": "Measurable target", "current": "Baseline"},
      {"kr": "Key result 2", "target": "Measurable target", "current": "Baseline"}
    ]
  },
  "product_team": [
    {
      "objective": "Product team objective",
      "key_results": [
        {"kr": "Key result", "target": "Target", "metric_type": "Leading|Lagging", "owner": "Role"},
        {"kr": "Key result", "target": "Target", "metric_type": "Leading|Lagging", "owner": "Role"}
      ]
    }
  ],
  "engineering_team": [
    {
      "objective": "Engineering objective",
      "key_results": [
        {"kr": "Key result", "target": "Target", "owner": "Role"}
      ]
    }
  ],
  "design_team": [
    {
      "objective": "Design objective",
      "key_results": [
        {"kr": "Key result", "target": "Target", "owner": "Role"}
      ]
    }
  ],
  "growth_team": [
    {
      "objective": "Growth objective",
      "key_results": [
        {"kr": "Key result", "target": "Target", "owner": "Role"}
      ]
    }
  ],
  "alignment_notes": "How these OKRs cascade and align (2-3 sentences)",
  "review_cadence": "How often to review and adjust",
  "anti_goals": ["What we are explicitly NOT doing this quarter"]
}

Generate 2-3 objectives per team level. Use specific, measurable targets. Mix leading and lagging indicators.`;

  return generateJSON(prompt, systemInstruction);
}

// Section-level regeneration: regenerate just one section of a module's output
export async function regenerateSection(moduleKey, sectionKey, currentData, prd) {
  const systemInstruction = "You are a senior AI Product Manager. Regenerate ONLY the requested section with fresh, improved content. Keep the same JSON structure.";
  const prompt = `You previously generated a ${moduleKey} module for the product "${prd?.title || "Unknown"}".

Here is the current full output (for context):
${JSON.stringify(currentData, null, 2)}

Now regenerate ONLY the "${sectionKey}" section/field. Return ONLY the JSON value for that field — not the entire object. Keep the same structure as the original value for "${sectionKey}" but generate fresh, improved content.

Important: Return valid JSON only. No markdown, no code fences. Just the raw JSON value for "${sectionKey}".`;

  return generateJSON(prompt, systemInstruction);
}
