import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as messagesService from "../services/messagesService";

export function useMessages(contactId: string) {
  return useQuery({
    queryKey: ["messages", contactId],
    queryFn: () => messagesService.fetchMessages(contactId),
    refetchInterval: 8000,
  });
}

export function useSendMessage(contactId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => messagesService.sendMessage(contactId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", contactId] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}

export function useSendAudioMessage(contactId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (blob: Blob) => messagesService.sendAudioMessage(contactId, blob),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", contactId] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
}
