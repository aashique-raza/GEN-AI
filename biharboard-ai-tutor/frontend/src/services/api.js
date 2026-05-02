/**
 * API Service for BiharBoard AI Tutor
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getBestErrorMessage = (result) => {
  return (
    result?.errors?.studentMessage ||
    result?.errors?.reason ||
    result?.message ||
    "Something went wrong. Please try again."
  );

};

function getSafeErrorMessage(error) {
  const raw =
    error?.message ||
    error?.error?.message ||
    error?.response?.data?.message ||
    JSON.stringify(error);

  const text = String(raw).toLowerCase();

  if (
    text.includes('quota') ||
    text.includes('resource_exhausted') ||
    text.includes('429') ||
    text.includes('rate limit')
  ) {
    return 'AI service ki daily limit exceed ho gayi hai. Thodi der baad try karo ya API key/model change karo.';
  }

  if (text.includes('network') || text.includes('failed to fetch')) {
    return 'Network problem hai. Internet connection check karo aur dobara try karo.';
  }

  if (text.includes('500') || text.includes('internal')) {
    return 'Server side problem hai. Thodi der baad try karo.';
  }

  return 'Kuch technical problem aa gayi hai. Dobara try karo.';
}



export async function sendChatMessage(classLevel, message, history = []) {
  try {
    if (!classLevel) {
      return {
        success: false,
        message: "Please select Class 10 or Class 12 first.",
        displayMessage: "Please select Class 10 or Class 12 first.",
        errors: {
          reason: "Missing classLevel",
        },
      };
    }

    if (!message?.trim()) {
      return {
        success: false,
        message: "Message cannot be empty.",
        displayMessage: "Message cannot be empty.",
        errors: {
          reason: "Empty message",
        },
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classLevel,
        message: message.trim(),
        history: Array.isArray(history) ? history.slice(-6) : [],
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      const displayMessage = getBestErrorMessage(result);

      return {
        success: false,
        message: result.message || displayMessage,
        displayMessage,
        errors: result.errors || null,
        statusCode: response.status,
      };
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
      displayMessage: result.data?.answer || "",
      statusCode: response.status,
    };
  } catch (error) {
    console.error('Chat API Error:', error);

  return {
    success: false,
    message: getSafeErrorMessage(error),
  };
  }
}