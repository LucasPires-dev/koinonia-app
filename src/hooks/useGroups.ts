import { useQuery } from "@tanstack/react-query";
import * as groupsService from "../services/groupsService";

export function useWhatsAppGroups() {
  return useQuery({
    queryKey: ["whatsapp-groups"],
    queryFn: groupsService.fetchWhatsAppGroups,
  });
}
