// QnA service for generating responses from JSON data

import qnaData from '../data/qna.json';

// Find matching answer from QnA data
export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    // Normalize the user message for comparison (lowercase, trim)
    const normalizedMessage = userMessage.toLowerCase().trim();
    
    // Search for exact or partial match in questions
    const matchedQnA = qnaData.find(item => {
      const normalizedQuestion = item.question.toLowerCase().trim();
      // Check for exact match or if user message contains the question keywords
      return normalizedQuestion === normalizedMessage || 
             normalizedMessage.includes(normalizedQuestion) ||
             normalizedQuestion.includes(normalizedMessage);
    });

    if (matchedQnA) {
      return matchedQnA.answer;
    }

    // If no exact match, try to find partial matches
    const partialMatch = qnaData.find(item => {
      const questionWords = item.question.toLowerCase().split(/\s+/);
      const messageWords = normalizedMessage.split(/\s+/);
      // Check if at least 2 words from question match
      const matchingWords = questionWords.filter(word => 
        messageWords.some(msgWord => msgWord.includes(word) || word.includes(msgWord))
      );
      return matchingWords.length >= 2;
    });

    if (partialMatch) {
      return partialMatch.answer;
    }

    // Default response if no match found
    return "I'm sorry, I don't have an answer for that question in my knowledge base. Please try asking about React, JavaScript, HTML, CSS, programming concepts, or web development topics.";
  } catch (error) {
    console.error("Error generating response from QnA data:", error);
    return "Sorry, I encountered an error while processing your question. Please try again.";
  }
};

