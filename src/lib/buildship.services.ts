import { EmergencyAnalysis } from "./gemini.service";
import toast from "react-hot-toast";

// Updated URL format
const BUILDSHIP_ENDPOINT = "https://uxnw8j.buildship.run/disasterAgent-41fe18f9b3ee";

export async function analyzeThroughBuildship(callData: {
  summary: string;
  transcript: string;
  status: string;
  id?: string;
}): Promise<EmergencyAnalysis> {
  console.log("Starting Buildship analysis for call:", callData.summary);

  try {
    const response = await fetch(BUILDSHIP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        CallData: {
          summary: callData.summary,
          transcript: callData.transcript || "",
          status: callData.status,
          callId: callData.id || "unknown"
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Buildship API error: ${response.status}`);
    }

    const analysis = await response.json();
    console.log("Successfully received Buildship response:", analysis);
    return analysis as EmergencyAnalysis;
  } catch (error) {
    console.error("Error in Buildship analysis:", error);
    toast.error(
      "Buildship API error. Falling back to Gemini analysis.",
      {
        duration: 5000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
      }
    );
    throw error;
  }
}