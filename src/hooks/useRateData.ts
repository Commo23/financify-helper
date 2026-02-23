import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRateData } from "@/lib/api/rates";
import { useCallback } from "react";

export function useRateData(index: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["rateData", index],
    queryFn: () => fetchRateData(index, false),
    staleTime: 1000 * 60 * 30, // 30 minutes (matches cache duration)
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: !!index,
  });

  const forceRefresh = useCallback(() => {
    queryClient.fetchQuery({
      queryKey: ["rateData", index],
      queryFn: () => fetchRateData(index, true),
    });
  }, [queryClient, index]);

  return {
    ...query,
    forceRefresh,
  };
}
