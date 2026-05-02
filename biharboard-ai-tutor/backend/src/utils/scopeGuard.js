const allowedClassLevels = ["10", "12"];

const blockedKeywords = [
  "react",
  "node",
  "express",
  "mongodb",
  "javascript",
  "python",
  "coding",
  "programming",
  "movie",
  "song",
  "politics",
  "election",
  "job",
  "resume",
  "salary",
  "gym",
  "diet",
  "crypto",
  "trading",
  "stock",
  "instagram",
  "youtube",
];

export const validateChatInput = ({ classLevel, message }) => {
  if (!classLevel || !message) {
    return {
      isValid: false,
      message: "classLevel and message are required",
    };
  }

  const normalizedClass = String(classLevel).trim();
  const normalizedMessage = message.trim().toLowerCase();

  if (!allowedClassLevels.includes(normalizedClass)) {
    return {
      isValid: false,
      message: "Only Class 10 and Class 12 are supported",
    };
  }

  if (!normalizedMessage) {
    return {
      isValid: false,
      message: "Message cannot be empty",
    };
  }

  const hasBlockedKeyword = blockedKeywords.some((keyword) =>
    normalizedMessage.includes(keyword)
  );

  if (hasBlockedKeyword) {
    return {
      isValid: false,
      message:
        "Sorry, I can only answer Class 10 and Class 12 Bihar Board syllabus, exam, and book-related questions.",
    };
  }

  return {
    isValid: true,
    message: "Valid input",
  };
};