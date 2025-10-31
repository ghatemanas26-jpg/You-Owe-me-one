import { GoogleGenAI, Type } from "@google/genai";
import type { YouTubeContent } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateYouTubeContent(topic: string): Promise<YouTubeContent> {
  try {
    const prompt = `
      For a YouTube video about "${topic}", generate a JSON object with the following structure:
      1. "titles": An array of 3 unique, click-worthy, and SEO-optimized titles that are likely to rank high on YouTube search.
      2. "description": A detailed, SEO-friendly description for the video, including relevant keywords and 3-5 hashtags at the end.
      3. "tags": An array of 10-15 relevant SEO tags.
      4. "seoScore": An integer score from 0 to 100 representing the overall SEO potential of the generated content.
      5. "scoreJustification": A brief, 1-2 sentence explanation for the given SEO score.
      6. "keywordAnalysis": A short analysis of the main keywords, simulating insights from SEO tools, focusing on search volume, competition, and relevance.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'An array of 3 catchy, SEO-friendly titles for the YouTube video.'
            },
            description: {
              type: Type.STRING,
              description: 'A detailed, SEO-friendly description including hashtags.'
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'An array of 10-15 relevant SEO tags.'
            },
            seoScore: {
                type: Type.INTEGER,
                description: 'An integer SEO score from 0 to 100.'
            },
            scoreJustification: {
                type: Type.STRING,
                description: 'A brief justification for the SEO score.'
            },
            keywordAnalysis: {
                type: Type.STRING,
                description: 'An analysis of the primary keywords.'
            }
          },
          required: ['titles', 'description', 'tags', 'seoScore', 'scoreJustification', 'keywordAnalysis'],
        },
      },
    });

    const parsedResponse = JSON.parse(response.text);
    return parsedResponse as YouTubeContent;
  } catch (error) {
    console.error("Error generating YouTube content:", error);
    throw new Error("Failed to generate text content. Please try again.");
  }
}

export async function generateThumbnail(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '16:9',
        },
    });
    
    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error("No image was generated.");
    }

  } catch (error) {
    console.error("Error generating thumbnail:", error);
    throw new Error("Failed to generate thumbnail image. Please try again.");
  }
}
