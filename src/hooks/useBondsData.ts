import { useQuery } from "@tanstack/react-query";
import { fetchAllCountries, fetchCountryYields } from "@/lib/api/bonds";

export function useCountriesBonds() {
  return useQuery({
    queryKey: ["bonds", "countries"],
    queryFn: fetchAllCountries,
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    enabled: false,
  });
}

export function useCountryYields(countrySlug: string) {
  return useQuery({
    queryKey: ["bonds", "country", countrySlug],
    queryFn: () => fetchCountryYields(countrySlug),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    enabled: !!countrySlug,
  });
}
