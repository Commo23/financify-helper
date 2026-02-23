import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

const NETWORK_ERROR_HINT =
  "Impossible de joindre Supabase. Vérifiez votre connexion internet et que le projet Supabase est actif (dashboard.supabase.com → projet non en pause).";

function wrapNetworkError(error: unknown): string {
  const message =
    error instanceof Error
      ? error.message
      : typeof (error as { message?: string })?.message === "string"
        ? (error as { message: string }).message
        : String(error);
  const isNetworkError =
    message.includes("Failed to send") ||
    message.includes("ERR_NAME_NOT_RESOLVED") ||
    message.includes("fetch") ||
    message.includes("network");
  return isNetworkError ? NETWORK_ERROR_HINT : message;
}

export interface CountryBondData {
  country: string;
  countrySlug: string;
  currency: string;
  rating: string;
  yield10Y: number | null;
  bankRate: number | null;
  spreadVsBund: number | null;
  spreadVsTNote: number | null;
  spreadVsBankRate: number | null;
}

export interface BondYieldData {
  maturity: string;
  maturityYears: number;
  yield: number | null;
  chg1M: number | null;
  chg6M: number | null;
  chg12M: number | null;
  price: number | null;
  priceChg1M: number | null;
  priceChg6M: number | null;
  priceChg12M: number | null;
  capitalGrowth: number | null;
  lastUpdate: string;
}

export interface CountriesResponse {
  success: boolean;
  data?: CountryBondData[];
  error?: string;
  scrapedAt?: string;
}

export interface CountryYieldsResponse {
  success: boolean;
  country?: string;
  currency?: string;
  data?: BondYieldData[];
  error?: string;
  scrapedAt?: string;
}

export async function fetchAllCountries(): Promise<CountriesResponse> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: "Supabase non configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY dans .env",
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke("scrape-bonds", {
      body: { type: "countries" },
    });

    if (error) {
      console.error("Error fetching countries:", error);
      return { success: false, error: wrapNetworkError(error) };
    }

    return data;
  } catch (err) {
    console.error("Error fetching countries:", err);
    return { success: false, error: wrapNetworkError(err) };
  }
}

export async function fetchCountryYields(countrySlug: string): Promise<CountryYieldsResponse> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: "Supabase non configuré. Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY dans .env",
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke("scrape-bonds", {
      body: { type: "country", country: countrySlug },
    });

    if (error) {
      console.error("Error fetching country yields:", error);
      return { success: false, error: wrapNetworkError(error) };
    }

    return data;
  } catch (err) {
    console.error("Error fetching country yields:", err);
    return { success: false, error: wrapNetworkError(err) };
  }
}
