export interface ShepherdsToolkitEvent {
  id: string;
  title: string;
  description: string;
  eventType: string;
  location: string;
  startDatetime: string;
  endDatetime: string;
  allDay: boolean;
  color: string;
}

export interface ShepherdsToolkitWriting {
  id: string;
  title: string;
  authorName: string;
  baseText: string;
  theme: string;
  status: string;
  type: string;
  preachedDate: string | null;
  createdAt: string;
  updatedAt: string;
  tagList: string[];
}
