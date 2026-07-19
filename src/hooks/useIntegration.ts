import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as integrationsService from "../services/integrationsService";

const INTEGRATION_KEY = ["integration"] as const;
const WHATSAPP_STATUS_KEY = ["whatsapp-status"] as const;

export function useIntegration() {
  return useQuery({ queryKey: INTEGRATION_KEY, queryFn: integrationsService.fetchIntegration });
}

export function useSaveIntegration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: integrationsService.saveIntegration,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: INTEGRATION_KEY }),
  });
}

export function useWhatsAppStatus(enabled: boolean) {
  return useQuery({
    queryKey: WHATSAPP_STATUS_KEY,
    queryFn: integrationsService.fetchWhatsAppStatus,
    enabled,
    refetchInterval: (query) => (query.state.data?.status === "connected" ? false : 4000),
  });
}

export function useConnectWhatsApp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: integrationsService.connectWhatsApp,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WHATSAPP_STATUS_KEY }),
  });
}
