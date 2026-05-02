import { sendSuccess, sendError } from "../utils/sendResponse.js";
import { validateChatInput } from "../utils/scopeGuard.js";
import {
  classifyStudentMessage,
  generateBiharBoardAnswer,
  REFUSAL_MESSAGE,
} from "../services/gemini.service.js";

export const askQuestion = async (req, res, next) => {
  try {
    const { classLevel, message, history = [] } = req.body;

    const validation = validateChatInput({
      classLevel,
      message,
    });

    if (!validation.isValid) {
      return sendError(res, 400, validation.message);
    }

    const safeHistory = Array.isArray(history) ? history.slice(-6) : [];

    const classification = await classifyStudentMessage({
      classLevel,
      message,
      history: safeHistory,
    });

    if (!classification.isAllowed) {
      return sendError(res, 400, REFUSAL_MESSAGE, {
        reason: classification.reason,
      });
    }

    const answer = await generateBiharBoardAnswer({
      classLevel,
      message,
      history: safeHistory,
      classification,
    });

    return sendSuccess(res, 200, "Answer generated successfully", {
      classLevel,
      subject: classification.subject,
      topic: classification.topic,
      userMessage: message,
      answer,
    });
  } catch (error) {
    next(error);
  }
};