export const DayOfWeek = {
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY", 
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY"
} as const;

export type DayOfWeek = typeof DayOfWeek[keyof typeof DayOfWeek];

// Función para obtener el valor ISO (1-7, donde 1 = Monday)
export const getDayOfWeekValue = (day: DayOfWeek): number => {
  switch (day) {
    case DayOfWeek.MONDAY: return 1;
    case DayOfWeek.TUESDAY: return 2;
    case DayOfWeek.WEDNESDAY: return 3;
    case DayOfWeek.THURSDAY: return 4;
    case DayOfWeek.FRIDAY: return 5;
    case DayOfWeek.SATURDAY: return 6;
    case DayOfWeek.SUNDAY: return 7;
    default: throw new Error(`Invalid day of week: ${day}`);
  }
};

// Función para obtener el día de la semana por valor ISO
export const getDayOfWeekByValue = (value: number): DayOfWeek => {
  switch (value) {
    case 1: return DayOfWeek.MONDAY;
    case 2: return DayOfWeek.TUESDAY;
    case 3: return DayOfWeek.WEDNESDAY;
    case 4: return DayOfWeek.THURSDAY;
    case 5: return DayOfWeek.FRIDAY;
    case 6: return DayOfWeek.SATURDAY;
    case 7: return DayOfWeek.SUNDAY;
    default: throw new Error(`Invalid day of week value: ${value}. Must be between 1-7`);
  }
};
