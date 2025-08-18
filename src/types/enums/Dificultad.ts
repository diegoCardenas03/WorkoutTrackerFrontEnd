export const Dificultad = {
  PRINCIPIANTE: "PRINCIPIANTE",
  INTERMEDIO: "INTERMEDIO",
  AVANZADO: "AVANZADO"
} as const;

export type Dificultad = typeof Dificultad[keyof typeof Dificultad];