// * In-memory conversation history.
// * This stores current CLI session messages only.
// ! App restart hote hi ye memory clear ho jayegi.

// * Stores messages in LangChain-compatible role/content format.
const conversationHistory = [];

// * Add user message to history.
export function addUserMessage(content) {
  conversationHistory.push({
    role: "user",
    content,
  });
}

// * Add AI message to history.
export function addAIMessage(content) {
  conversationHistory.push({
    role: "assistant",
    content,
  });
}

// * Return all saved conversation messages.
export function getConversationHistory() {
  return conversationHistory;
}

// * Clear full conversation history.
export function clearConversationHistory() {
  conversationHistory.length = 0;
}

// * Get short stats for debugging.
export function getConversationHistoryStats() {
  return {
    totalMessages: conversationHistory.length,
    userMessages: conversationHistory.filter((msg) => msg.role === "user").length,
    aiMessages: conversationHistory.filter((msg) => msg.role === "assistant").length,
  };
}