export interface Registration {
  id: string;
  eventId: string;
  registrationDate: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
}

export const mockRegistrations: Registration[] = [
  {
    id: "REG-10231",
    eventId: "EVT-2026-001",
    registrationDate: "2026-08-15T10:30:00Z",
    status: "Confirmed",
  },
  {
    id: "REG-10232",
    eventId: "EVT-2026-004",
    registrationDate: "2026-08-01T14:20:00Z",
    status: "Completed",
  },
  {
    id: "REG-10233",
    eventId: "EVT-2026-006",
    registrationDate: "2026-09-01T09:15:00Z",
    status: "Pending",
  }
];
