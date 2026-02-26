

## GenAI Chat Assistant with RAG — Implementation Plan

### 1. Knowledge Base Setup
- Create a `docs.json` file with 5–10 company FAQ/policy documents (HR policies, leave policy, IT support, onboarding, expense reimbursement, remote work policy, code of conduct, etc.)
- Build an edge function to chunk documents into 300–500 token segments
- Generate embeddings for each chunk using an embeddings model
- Store embeddings and chunks in-memory within the edge function (simple vector store)

### 2. RAG Backend (Supabase Edge Functions)
- **`/functions/v1/embed`** — Processes `docs.json`, chunks documents, generates embeddings, and stores them
- **`/functions/v1/chat`** — The main POST endpoint (`/api/chat` equivalent):
  - Accepts `{ message, sessionId }` from the frontend
  - Generates an embedding for the user's query
  - Performs cosine similarity search against stored document embeddings
  - Retrieves top 3 most relevant chunks
  - Applies a similarity threshold — returns fallback if score is too low
  - Constructs a grounded prompt with: system instructions, retrieved context, conversation history (last 5 messages), and user question
  - Calls Lovable AI (Gemini) with low temperature (0.2) for grounded responses
  - Streams the response back with token-by-token SSE
  - Logs similarity scores and token usage
  - Handles API failures, timeouts, rate limits (429/402) with structured JSON errors

### 3. Conversation Context Management
- Store conversation history per session (using sessionId from localStorage)
- Maintain last 5 message pairs in the prompt
- Ensure document grounding takes priority over conversation context in the prompt design

### 4. Chat Interface (Frontend)
- Clean chat UI with:
  - Message input field + send button
  - Message bubbles for user (right) and assistant (left)
  - Loading/typing indicator while streaming
  - Auto-scroll to latest message
  - Markdown rendering for assistant responses
  - Timestamps on messages
- "New Chat" button to reset session
- Session persistence via localStorage sessionId
- Error toasts for rate limits, API failures
- Responsive design (mobile-friendly)

### 5. Design & UX
- Clean, professional look with the existing shadcn/ui components
- Dark/light mode support
- Subtle animations for message appearance
- Source attribution — show which document chunks were used for the answer

