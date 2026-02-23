import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { IRSResponse } from "@/lib/irsIndices";
import { getCachedIRSData, setCachedIRSData } from "@/lib/dataCache";

const NETWORK_ERROR_HINT =
  "Impossible de joindre Supabase. Vérifiez votre connexion internet et que le projet Supabase est actif (dashboard.supabase.com → projet non en pause).";

export async function fetchIRSRates(currency: string, forceRefresh = false): Promise<IRSResponse> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: "Supabase non configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY dans .env",
    };
  }

  if (!forceRefresh) {
    const cached = getCachedIRSData(currency);
    if (cached) {
      console.log(`Using cached IRS data for ${currency}`);
      return cached;
    }
  }

  try {
    console.log(`Fetching fresh IRS data for ${currency}`);
    const { data, error } = await supabase.functions.invoke("scrape-irs", {
      body: { currency },
    });

    if (error) {
      console.error("Error fetching IRS rates:", error);
      const isNetworkError =
        error.message?.includes("Failed to send") ||
        error.message?.includes("fetch") ||
        error.message?.includes("network");
      return {
        success: false,
        error: isNetworkError ? NETWORK_ERROR_HINT : error.message,
      };
    }

    const response = data as IRSResponse;
    if (response.success && response.data) {
      setCachedIRSData(currency, response);
    }

    return response;
  } catch (err) {
    console.error("Error fetching IRS rates:", err);
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
