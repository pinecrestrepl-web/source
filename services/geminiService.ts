
import { GoogleGenAI, Type } from "@google/genai";

// Ensure the API_KEY is available in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateJobDescription = async (serviceType: string): Promise<string> => {
  if (!API_KEY) return `Detailed check required for: ${serviceType}.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a brief, professional job description for a service ticket about "${serviceType}". The description should be suitable for a technician to understand the task. Be concise and clear. For example, for "Leaky pipe", you could write "Investigate and repair water leakage from a pipe. Location and specific pipe to be identified on-site."`,
       config: {
        temperature: 0.5,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating job description:", error);
    return `Standard service call for: ${serviceType}. Please diagnose and report findings.`;
  }
};

export const analyzeFeedbackForRating = async (feedback: string): Promise<number> => {
    if (!API_KEY) return 3; // Return a neutral rating if API is not available

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the sentiment of the following customer feedback and return a single integer star rating from 1 to 5. 1 is very negative, 5 is very positive. Only return the number. Feedback: "${feedback}"`,
            config: {
                temperature: 0.1,
            }
        });

        const ratingText = response.text.trim();
        const rating = parseInt(ratingText, 10);

        if (!isNaN(rating) && rating >= 1 && rating <= 5) {
            return rating;
        }
        return 3; // Default neutral rating
    } catch (error) {
        console.error("Error analyzing feedback:", error);
        return 3; // Return neutral on error
    }
};

export const generateTechnicianSummary = async (completedJobs: number, averageRating: number, specialty: string): Promise<string> => {
    if (!API_KEY) return "An experienced and reliable technician.";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Create a short, positive, professional summary for a technician specializing in ${specialty}. They have completed ${completedJobs} jobs with an average rating of ${averageRating.toFixed(1)} out of 5. Highlight their experience and reliability.`,
            config: {
                temperature: 0.6,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating technician summary:", error);
        return `A skilled ${specialty} specialist with a strong track record.`;
    }
};
