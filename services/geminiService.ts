
import { GoogleGenAI } from "@google/genai";
import { AIResponse } from "../types";

export class GeminiGISService {
  private ai: GoogleGenAI;

  constructor() {
    // Always use the process.env.API_KEY directly as a named parameter
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async queryBatangasMap(query: string, userLocation?: { latitude: number; longitude: number }): Promise<AIResponse> {
    try {
      const response = await this.ai.models.generateContent({
        // Maps grounding is only supported in Gemini 2.5 series models
        model: "gemini-2.5-flash",
        contents: `You are a professional GIS analyst and spatial database expert for Batangas Province, Philippines. 
                  Provide a detailed, technical yet accessible report on the following query: "${query}".
                  Focus on:
                  1. Current infrastructure status or geographical significance.
                  2. For tourism: current popularity and environmental protection status.
                  3. For industry: proximity to ports (Batangas Port) and transport hubs.
                  4. For hazards: specific risks (Taal volcanic, seismic, or coastal) and current alerts.
                  5. For heritage: architectural style and historical conservation notes.
                  Use real-world data grounded in Google Maps.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: userLocation ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude
              } : {
                latitude: 13.7565, // Batangas City Center
                longitude: 121.0583
              }
            }
          }
        },
      });

      // Directly access .text property from the response object
      const text = response.text || "No spatial intelligence data returned for this query.";
      const groundingLinks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      return {
        text,
        groundingLinks
      };
    } catch (error) {
      console.error("Gemini GIS Service Error:", error);
      throw error;
    }
  }
}

export const gisService = new GeminiGISService();
