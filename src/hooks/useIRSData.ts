import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchIRSRates } from "@/lib/api/irs";
import { IRSResponse } from "@/lib/irsIndices";
import { useCallback } from "react";

export function useIRSData(currency: string) {
  const queryClient = useQueryClient();

  const query = useQuery<IRSResponse>({
    queryKey: ["irs-rates", currency],
    queryFn: () => fetchIRSRates(currency, false),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    enabled: !!currency,
  });

  const forceRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ["irs-rates", currency],
      queryFn: () => fetchIRSRates(currency, true),
    });
  }, [queryClient, currency]);

  return {
    ...query,
    forceRefresh,
  };
}
