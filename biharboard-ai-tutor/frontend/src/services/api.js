/**
 * API Service for BiharBoard AI Tutor
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export async function sendChatMessage(classLevel, message, history) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        classLevel,
        message,
        history, // Format: [{ role: 'user', text: '...' }, { role: 'assistant', text: '...' }]
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Chat API Error:', error);
    return {
      success: false,
      message: 'Network error. Please make sure the backend is running.',
      errors: { reason: 'Connection error' },
    };
  }
}
