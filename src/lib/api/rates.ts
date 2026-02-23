import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { RateResponse } from "@/lib/rateIndices";
import { getCachedRateData, setCachedRateData } from "@/lib/dataCache";

const NETWORK_ERROR_HINT =
  "Impossible de joindre Supabase. Vérifiez votre connexion internet et que le projet Supabase est actif (dashboard.supabase.com → projet non en pause).";

export async function fetchRateData(index: string, forceRefresh = false): Promise<RateResponse> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: "Supabase non configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY dans .env",
    };
  }

  if (!forceRefresh) {
    const cached = getCachedRateData(index);
    if (cached) {
      console.log(`Using cached rate data for ${index}`);
      return cached;
    }
  }

  try {
    console.log(`Fetching fresh rate data for ${index}`);
    const { data, error } = await supabase.functions.invoke("scrape-rates", {
      body: { index },
    });

    if (error) {
      console.error("Error fetching rate data:", error);
      const isNetworkError =
        error.message?.includes("Failed to send") ||
        error.message?.includes("fetch") ||
        error.message?.includes("network");
      return {
        success: false,
        error: isNetworkError ? NETWORK_ERROR_HINT : error.message,
      };
    }

    const response = data as RateResponse;
    if (response.success && response.data) {
      setCachedRateData(index, response);
    }

    return response;
  } catch (err) {
    console.error("Error calling edge function:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    const isNetworkError =
      message.includes("Failed to send") ||
      message.includes("ERR_NAME_NOT_RESOLVED") ||
      message.includes("fetch") ||
      message.includes("network");
    return {
      success: false,
      error: isNetworkError ? NETWORK_ERROR_HINT : message,
    };
  }
}
