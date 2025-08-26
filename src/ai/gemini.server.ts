// src/ai/gemini.server.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { UserProfile } from '../contexts/AppContext';

console.log("API Key Loaded:", import.meta.env.VITE_GEMINI_API_KEY);


// Make sure to set your GEMINI_API_KEY in your environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY!);

// src/ai/gemini.server.ts

async function run(prompt: string) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = await response.text();

        // --- THIS IS THE FIX ---
        // Clean the response to ensure it's valid JSON
        const startIndex = text.indexOf('{');
        const endIndex = text.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1) {
            text = text.substring(startIndex, endIndex + 1);
        }
        // --------------------

        console.log("Cleaned AI Response:", text); // For debugging
        return JSON.parse(text);

    } catch (error) {
        console.error("Error generating or parsing content:", error);
        return {
            error: "Failed to process the AI's response.",
            message: "The AI model's response was not in the expected format. Please try again."
        };
    }
}


export async function generateRoadmapWithGemini(user: UserProfile): Promise<any> {
    const prompt = `
        Based on the following user profile, create a personalized 4-week career roadmap.
        The user's long-term goal is: "${user.goals.longTermGoal}".
        The user's skills are: ${user.skills.map(s => s.name).join(', ')}.
        The user's interests are: ${user.goals.interests.join(', ')}.

        Please generate a JSON object with the following structure:
        {
          "title": "Your AI Roadmap to Becoming a [User's Long-Term Goal]",
          "focus": "A 4-week plan focusing on key skills.",
          "weeks": [
            {
              "week": 1,
              "title": "Week 1: [Skill/Topic]",
              "focus": "Description of the week's focus.",
              "tasks": [
                {"id": "task-1-1", "title": "Task 1", "description": "Description of the task.", "completed": false},
                {"id": "task-1-2", "title": "Task 2", "description": "Description of the task.", "completed": false}
              ]
            },
            ... (3 more weeks)
          ]
        }
    `;

    return run(prompt);
}

export async function analyzeResumeWithGemini(resumeText: string): Promise<any> {
    const prompt = `
        Analyze the following resume text and provide feedback.
        Resume: "${resumeText}"

        Please generate a JSON object with the following structure:
        {
          "score": 85, // A score from 0-100
          "strengths": ["Strength 1", "Strength 2"],
          "weaknesses": ["Weakness 1", "Weakness 2"],
          "suggestions": [
            {
              "category": "Keyword Optimization",
              "priority": "high",
              "items": ["Suggestion 1", "Suggestion 2"]
            },
            ... (other categories)
          ]
        }
    `;

    return run(prompt);
}

export async function getInterviewResponseWithGemini(question: string, previousMessages: any[]): Promise<any> {
    const prompt = `
        You are an AI interviewer. Your current question is "${question}".
        The conversation history is: ${JSON.stringify(previousMessages)}.

        Please generate a concise and relevant follow-up or the next question based on the conversation. Return a JSON object with the following structure:
        {
          "response": "Your response here."
        }
    `;
    return run(prompt);
}