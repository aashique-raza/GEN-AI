// * This helper runs the model call and measures useful debug information.
// * Keep debug logic separate so CLI file does not become messy.

export async function runModelCallWithDebug({ model, messages }) {
  // * Start timer before model call.
  const startTime = Date.now();

  // * Actual LangChain model call.
  // ! model.invoke() returns AIMessage, not plain string.
  const response = await model.invoke(messages);

  // * End timer after model response.
  const endTime = Date.now();

  // * Calculate latency in milliseconds.
  const latencyMs = endTime - startTime;

  // * Build debug object.
  // * Some providers may return different metadata shapes, so use fallback.
  const debugInfo = {
    latencyMs,

    // * Answer length in characters.
    contentLength: String(response.content || "").length,

    // * Provider/model-level response data if available.
    responseMetadata: response.response_metadata || {},

    // * Token usage data if provider returns it.
    usageMetadata: response.usage_metadata || {},
  };

  // * Return both final response and debug info.
  return {
    response,
    debugInfo,
  };
}