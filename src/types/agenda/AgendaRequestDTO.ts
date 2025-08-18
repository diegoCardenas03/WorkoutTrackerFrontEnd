export interface AgendaRequestDTO {
  startDate: string;
  reminderMinutes?: number;
  comment?: string;
  userId: number;
  routineId: number;
}