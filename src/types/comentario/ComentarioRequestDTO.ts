export interface ComentarioRequestDTO {
  content: string;
  userId: number;
  routineId: number;
  replyToId?: number;
}