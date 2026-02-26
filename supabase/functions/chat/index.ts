import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── Knowledge Base (embedded at deploy time) ──────────────────────────
const docs = [
  {
    id: "leave-policy",
    title: "Leave Policy",
    content:
      "All full-time employees are entitled to 20 days of paid annual leave per calendar year. Leave accrues on a monthly basis at the rate of 1.67 days per month. Unused leave can be carried forward up to a maximum of 5 days into the next calendar year. Leave requests must be submitted at least 2 weeks in advance through the HR portal. Manager approval is required for all leave requests. Sick leave is provided at 10 days per year and does not require advance notice but requires a medical certificate for absences exceeding 2 consecutive days. Maternity leave is 26 weeks paid and paternity leave is 2 weeks paid. Bereavement leave of up to 5 days is available for immediate family members.",
  },
  {
    id: "remote-work-policy",
    title: "Remote Work Policy",
    content:
      "Employees may work remotely up to 3 days per week with manager approval. A formal remote work agreement must be signed before starting remote work. Employees must maintain a dedicated workspace with reliable internet connectivity of at least 25 Mbps. Core working hours are 10:00 AM to 4:00 PM in the employee's local time zone during which they must be available for meetings and communication. Remote workers must use the company VPN for all work-related activities. Equipment including laptop, monitor, and headset will be provided by the company. A monthly stipend of $75 is provided for internet and home office expenses. Remote work privileges may be revoked if performance standards are not met.",
  },
  {
    id: "expense-reimbursement",
    title: "Expense Reimbursement Policy",
    content:
      "Business expenses must be submitted within 30 days of incurrence through the expense management system. All expenses above $50 require prior manager approval. Receipts are mandatory for all expenses above $25. Travel expenses including airfare, hotel, and meals are reimbursable when pre-approved. Economy class airfare is standard for domestic flights; business class may be approved for international flights exceeding 6 hours. Hotel expenses are capped at $200 per night for domestic travel and $300 for international travel. Meal expenses are reimbursable up to $60 per day during business travel. Mileage reimbursement for personal vehicle use is $0.655 per mile. Reimbursements are processed within 10 business days of approval.",
  },
  {
    id: "it-support",
    title: "IT Support & Security Guidelines",
    content:
      "IT support is available Monday through Friday, 8:00 AM to 8:00 PM via the IT helpdesk portal, email at itsupport@company.com, or phone at extension 4357. For critical issues outside business hours, an on-call engineer can be reached through the emergency hotline. All employees must use multi-factor authentication for all company systems. Passwords must be at least 12 characters with a mix of uppercase, lowercase, numbers, and special characters, and must be changed every 90 days. Company devices must have full-disk encryption enabled. Personal devices may not be used to access company data without MDM enrollment. Software installations require IT approval. Phishing attempts should be reported immediately to security@company.com. VPN must be used when accessing company resources from outside the office network.",
  },
  {
    id: "onboarding",
    title: "Employee Onboarding Process",
    content:
      "New employee onboarding is a 2-week structured program. Day 1 includes orientation, ID badge issuance, IT equipment setup, and HR paperwork completion. Week 1 covers company culture sessions, team introductions, system access setup, and mandatory compliance training. Week 2 focuses on role-specific training, shadowing sessions, and goal-setting with the direct manager. All new employees are assigned a buddy from their team for the first 90 days. Required documents include signed offer letter, government-issued ID, tax forms, banking details for direct deposit, and emergency contact information. Benefits enrollment must be completed within the first 30 days. A 90-day check-in meeting with HR and the manager is scheduled to review progress and address any concerns.",
  },
  {
    id: "code-of-conduct",
    title: "Code of Conduct",
    content:
      "All employees are expected to maintain the highest standards of professional conduct. Discrimination, harassment, or bullying of any kind is strictly prohibited and will result in disciplinary action up to and including termination. Conflicts of interest must be disclosed to HR and the employee's manager. Company property and resources must be used for business purposes only. Confidential information must not be shared outside the organization without proper authorization. Social media posts about the company must comply with the social media policy. Gifts from vendors or clients exceeding $100 in value must be reported to the compliance team. Violations of the code of conduct should be reported through the anonymous ethics hotline or directly to HR. The company maintains a strict zero-tolerance policy for retaliation against whistleblowers.",
  },
  {
    id: "performance-review",
    title: "Performance Review Process",
    content:
      "Performance reviews are conducted bi-annually in June and December. The review process includes self-assessment, peer feedback from at least 2 colleagues, and manager evaluation. Goals are set at the beginning of each review cycle using the SMART framework. Performance is rated on a 5-point scale: Exceptional, Exceeds Expectations, Meets Expectations, Needs Improvement, and Unsatisfactory. Employees rated 'Needs Improvement' or below are placed on a Performance Improvement Plan (PIP) with a 90-day timeline. Annual compensation adjustments are based on performance ratings and market benchmarks. Promotion eligibility requires at least 12 months in the current role and a rating of 'Exceeds Expectations' or above in the most recent review cycle. Employees may request a mid-cycle feedback session with their manager at any time.",
  },
  {
    id: "health-benefits",
    title: "Health & Wellness Benefits",
    content:
      "The company offers comprehensive health insurance covering medical, dental, and vision care. Employees can choose from three plan tiers: Basic, Standard, and Premium. The company covers 80% of the premium for individual coverage and 60% for dependent coverage. A Health Savings Account (HSA) is available with Standard and Premium plans, with a company contribution of $500 per year. Mental health services are covered including up to 12 therapy sessions per year. An Employee Assistance Program (EAP) provides 24/7 confidential counseling. A gym membership reimbursement of up to $50 per month is available. Annual health screenings and flu vaccinations are provided on-site at no cost. Wellness programs include yoga classes, meditation sessions, and ergonomic assessments.",
  },
  {
    id: "data-privacy",
    title: "Data Privacy & Handling Policy",
    content:
      "All employees must comply with applicable data protection regulations including GDPR and CCPA. Personal data must be collected only for specified, legitimate purposes and with appropriate consent. Data must be classified as Public, Internal, Confidential, or Restricted. Confidential and Restricted data must be encrypted both in transit and at rest. Access to personal data is granted on a need-to-know basis and must be reviewed quarterly. Data retention periods must be defined for all data types and adhered to strictly. Data breaches must be reported to the Data Protection Officer within 24 hours of discovery. Employees must complete annual data privacy training. Third-party data processors must be vetted and must sign data processing agreements. Employees handling EU resident data must be familiar with data subject rights including the right to access, rectification, and erasure.",
  },
  {
    id: "training-development",
    title: "Training & Professional Development",
    content:
      "The company allocates an annual learning budget of $2,000 per employee for professional development. This covers courses, certifications, conferences, and workshops. Employees must submit a learning plan for manager approval at the start of each fiscal year. Time off for approved training is provided up to 5 days per year. The company maintains partnerships with online learning platforms including LinkedIn Learning and Coursera, providing free access to all employees. Internal knowledge-sharing sessions are held monthly. Mentorship programs are available for employees at all levels. Tuition reimbursement of up to $5,250 per year is available for degree programs relevant to the employee's role. Certification exam fees are fully reimbursed upon passing. Employees must share key learnings from external training with their team within 2 weeks of completion.",
  },
];

// ── Text Chunking ─────────────────────────────────────────────────────
interface Chunk {
  docId: string;
  docTitle: string;
  text: string;
  embedding: number[];
}

function chunkText(text: string, maxTokens = 400, overlap = 50): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let i = 0;
  while (i < words.length) {
    const slice = words.slice(i, i + maxTokens);
    chunks.push(slice.join(" "));
    i += maxTokens - overlap;
  }
  return chunks;
}

// ── Simple TF-IDF-style Embedding (bag of words normalized) ───────────
// We use a deterministic word-frequency vector approach for embeddings
// since we don't have access to a real embeddings API in-edge.
// This is sufficient for keyword/semantic-keyword matching on structured docs.

let vocabulary: string[] = [];
let chunkStore: Chunk[] = [];
let initialized = false;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function buildVocabulary(allTexts: string[]) {
  const freq = new Map<string, number>();
  for (const text of allTexts) {
    const tokens = new Set(tokenize(text));
    for (const t of tokens) {
      freq.set(t, (freq.get(t) || 0) + 1);
    }
  }
  // Keep top 500 most common terms as vocabulary
  vocabulary = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 500)
    .map(([word]) => word);
}

function embed(text: string): number[] {
  const tokens = tokenize(text);
  const tf = new Map<string, number>();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) || 0) + 1);
  }
  const vec = vocabulary.map((word) => (tf.get(word) || 0) / Math.max(tokens.length, 1));
  // Normalize
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return mag > 0 ? vec.map((v) => v / mag) : vec;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot; // vectors are already normalized
}

function initializeKnowledgeBase() {
  if (initialized) return;

  const allChunkTexts: string[] = [];
  const rawChunks: { docId: string; docTitle: string; text: string }[] = [];

  for (const doc of docs) {
    const chunks = chunkText(doc.content);
    for (const chunk of chunks) {
      rawChunks.push({ docId: doc.id, docTitle: doc.title, text: chunk });
      allChunkTexts.push(chunk);
    }
  }

  buildVocabulary(allChunkTexts);

  chunkStore = rawChunks.map((c) => ({
    ...c,
    embedding: embed(c.text),
  }));

  initialized = true;
  console.log(`Knowledge base initialized: ${chunkStore.length} chunks, vocabulary size: ${vocabulary.length}`);
}

function searchSimilar(query: string, topK = 3, threshold = 0.1): { chunk: Chunk; score: number }[] {
  const queryEmb = embed(query);
  const scored = chunkStore
    .map((chunk) => ({ chunk, score: cosineSimilarity(queryEmb, chunk.embedding) }))
    .sort((a, b) => b.score - a.score);

  console.log(`Top similarity scores: ${scored.slice(0, 5).map((s) => `${s.chunk.docTitle}: ${s.score.toFixed(4)}`).join(", ")}`);

  return scored.filter((s) => s.score >= threshold).slice(0, topK);
}

// ── Conversation Store (in-memory per instance) ───────────────────────
const conversations = new Map<string, { role: string; content: string }[]>();

// ── Main Handler ──────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    initializeKnowledgeBase();

    const { message, sessionId } = await req.json();
    if (!message || !sessionId) {
      return new Response(JSON.stringify({ error: "message and sessionId are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get/create conversation history
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }
    const history = conversations.get(sessionId)!;

    // Search knowledge base
    const results = searchSimilar(message, 3, 0.08);
    const hasRelevantContext = results.length > 0;

    // Build context string
    let contextBlock = "";
    const sources: { title: string; id: string; score: number }[] = [];

    if (hasRelevantContext) {
      contextBlock = results
        .map((r, i) => {
          sources.push({ title: r.chunk.docTitle, id: r.chunk.docId, score: r.score });
          return `[Source ${i + 1}: ${r.chunk.docTitle}]\n${r.chunk.text}`;
        })
        .join("\n\n");
    }

    // Build system prompt
    const systemPrompt = `You are a helpful company assistant that answers employee questions about company policies, benefits, and procedures. You must be accurate, professional, and concise.

${
  hasRelevantContext
    ? `IMPORTANT: Base your answer ONLY on the following company documents. If the information to answer the question is not in these documents, say so clearly.

--- RETRIEVED DOCUMENTS ---\n${contextBlock}\n--- END DOCUMENTS ---`
    : `No relevant company documents were found for this query. Let the user know that you couldn't find specific policy information for their question, and suggest they contact HR directly for assistance. Do NOT make up policy information.`
}

Guidelines:
- Answer based strictly on the provided documents
- If the documents don't contain the answer, say "I don't have specific information about that in our company policies. Please contact HR at hr@company.com for assistance."
- Be concise but thorough
- Use bullet points for lists
- Cite which policy document you're referencing in your answer`;

    // Build messages array with last 5 conversation pairs
    const recentHistory = history.slice(-10); // last 5 pairs = 10 messages
    const messages = [
      { role: "system", content: systemPrompt },
      ...recentHistory,
      { role: "user", content: message },
    ];

    console.log(`Session ${sessionId}: query="${message.substring(0, 50)}...", sources=${sources.length}, history=${recentHistory.length} msgs`);

    // Call Lovable AI with streaming
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        stream: true,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service quota exceeded. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Store user message in history
    history.push({ role: "user", content: message });

    // Create a transform stream that captures the full response for history
    const reader = response.body!.getReader();
    let fullAssistantResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        // First, send sources metadata as a custom SSE event
        if (sources.length > 0) {
          const sourcesEvent = `data: ${JSON.stringify({ sources })}\n\n`;
          controller.enqueue(new TextEncoder().encode(sourcesEvent));
        }

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            let newlineIndex: number;
            while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
              const line = buffer.slice(0, newlineIndex);
              buffer = buffer.slice(newlineIndex + 1);

              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6).trim();
                if (jsonStr === "[DONE]") {
                  controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
                  continue;
                }
                try {
                  const parsed = JSON.parse(jsonStr);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    fullAssistantResponse += content;
                  }
                } catch {
                  // pass through
                }
              }

              // Forward the original line
              controller.enqueue(new TextEncoder().encode(line + "\n"));
            }
          }

          // Flush remaining buffer
          if (buffer.trim()) {
            controller.enqueue(new TextEncoder().encode(buffer));
          }
        } catch (e) {
          console.error("Stream error:", e);
        } finally {
          // Store assistant response in history
          if (fullAssistantResponse) {
            history.push({ role: "assistant", content: fullAssistantResponse });
          }
          // Keep only last 10 messages (5 pairs)
          while (history.length > 10) {
            history.shift();
          }
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
