import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as groupsService from "../services/groupsService";

export function useWhatsAppGroups() {
  return useQuery({
    queryKey: ["whatsapp-groups"],
    queryFn: groupsService.fetchWhatsAppGroups,
  });
}

export function useGroupThreads() {
  return useQuery({
    queryKey: ["whatsapp-group-threads"],
    queryFn: groupsService.fetchGroupThreads,
    refetchInterval: 8000,
  });
}

export function useGroupMessages(groupId: string | undefined) {
  return useQuery({
    queryKey: ["group-messages", groupId],
    queryFn: () => groupsService.fetchGroupMessages(groupId as string),
    enabled: Boolean(groupId),
    refetchInterval: 8000,
  });
}

export function useSendGroupMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: groupsService.sendGroupMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-messages"] });
      queryClient.invalidateQueries({ queryKey: ["whatsapp-group-threads"] });
    },
  });
}
