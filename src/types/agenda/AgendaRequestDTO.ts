export interface AgendaRequestDTO {
  reminderMinutes?: number;
  comment?: string;
  userId: number;
  routineId: number;
}