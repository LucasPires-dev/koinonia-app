import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as scheduledMessageService from "../services/scheduledMessageService";
import type { ScheduledMessageDraft } from "../types/scheduledMessage";

const SCHEDULED_MESSAGES_KEY = ["scheduled-messages"] as const;

export function useScheduledMessages(start: Date, end: Date) {
  const key = [
    ...SCHEDULED_MESSAGES_KEY,
    start.toISOString().slice(0, 10),
    end.toISOString().slice(0, 10),
  ] as const;
  return useQuery({
    queryKey: key,
    queryFn: () => scheduledMessageService.fetchScheduledMessages(start, end),
  });
}

export function useCreateScheduledMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ draft, files }: { draft: ScheduledMessageDraft; files: File[] }) =>
      scheduledMessageService.createScheduledMessage(draft, files),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SCHEDULED_MESSAGES_KEY }),
  });
}

export function useUpdateScheduledMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
      files,
      keepAttachmentIds,
    }: {
      id: string;
      patch: Partial<ScheduledMessageDraft>;
      files: File[];
      keepAttachmentIds: string[];
    }) => scheduledMessageService.updateScheduledMessage(id, patch, files, keepAttachmentIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SCHEDULED_MESSAGES_KEY }),
  });
}

export function useCancelScheduledMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scheduledMessageService.cancelScheduledMessage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SCHEDULED_MESSAGES_KEY }),
  });
}

export function useDeleteScheduledMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scheduledMessageService.deleteScheduledMessage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SCHEDULED_MESSAGES_KEY }),
  });
}
