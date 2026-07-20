import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as contactsService from "../services/contactsService";
import type { ContactDraft } from "../types/contact";

const CONTACTS_KEY = ["contacts"] as const;

export function useContacts() {
  return useQuery({
    queryKey: CONTACTS_KEY,
    queryFn: contactsService.fetchContacts,
    refetchInterval: 8000,
  });
}

export function useVerifyContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactsService.verifyContact,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}

export function useVerifyContacts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactsService.verifyContacts,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draft: ContactDraft) => contactsService.createContact(draft),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<ContactDraft> }) =>
      contactsService.updateContact(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactsService.deleteContact,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}

export function useSyncWhatsAppContacts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactsService.syncWhatsAppContacts,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}
