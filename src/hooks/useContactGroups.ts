import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as contactGroupService from "../services/contactGroupService";
import type { ContactGroupDraft } from "../types/contactGroup";

const CONTACT_GROUPS_KEY = ["contact-groups"] as const;

export function useContactGroups() {
  return useQuery({
    queryKey: CONTACT_GROUPS_KEY,
    queryFn: contactGroupService.fetchContactGroups,
  });
}

export function useCreateContactGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draft: ContactGroupDraft) => contactGroupService.createContactGroup(draft),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACT_GROUPS_KEY }),
  });
}

export function useUpdateContactGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<ContactGroupDraft> }) =>
      contactGroupService.updateContactGroup(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACT_GROUPS_KEY }),
  });
}

export function useDeleteContactGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactGroupService.deleteContactGroup(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CONTACT_GROUPS_KEY }),
  });
}
