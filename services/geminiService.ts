
import { GoogleGenAI, Type } from "@google/genai";
import { StatisticsData, AccidentHotspot, VehicleType, RoadType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function fetchAccidentInsights(query: string = "Latest fatal accident hotspots and statistics in Malaysia for 2024-2025 including DOSM data") {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the most recent data regarding fatal road accidents in Malaysia. 
      Focus on hotspots (specific roads/regions), vehicle types (motorcycles are usually highest), and road types (toll highways vs federal roads).
      Provide a comprehensive analysis based on the latest available data from DOSM (Department of Statistics Malaysia) and news reports.
      
      User Query: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No data retrieved.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Reference",
      uri: chunk.web?.uri || "#"
    })) || [];

    return { text, sources };
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    throw error;
  }
}

export async function getStructuredAccidentData(): Promise<{ hotspots: AccidentHotspot[], stats: StatisticsData }> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate structured data representing a realistic distribution of fatal accidents in Malaysia across hotspots, vehicle types, road types, and timeframes (weekly, monthly, annual). Base this on 2024 trends.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hotspots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  latitude: { type: Type.NUMBER },
                  longitude: { type: Type.NUMBER },
                  fatalities: { type: Type.INTEGER },
                  vehicleTypes: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  },
                  roadType: { type: Type.STRING },
                  year: { type: Type.INTEGER }
                },
                required: ["id", "name", "latitude", "longitude", "fatalities", "vehicleTypes", "roadType", "year"]
              }
            },
            stats: {
              type: Type.OBJECT,
              properties: {
                weekly: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } } } },
                monthly: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } } } },
                annual: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } } } },
                byVehicle: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } } } },
                byRoad: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, value: { type: Type.NUMBER } } } }
              },
              required: ["weekly", "monthly", "annual", "byVehicle", "byRoad"]
            }
          },
          required: ["hotspots", "stats"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return data;
  } catch (error) {
    console.error("Error getting structured data:", error);
    // Fallback or retry logic can be added here
    throw error;
  }
}
