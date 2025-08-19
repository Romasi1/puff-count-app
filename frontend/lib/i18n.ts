export interface Translations {
  // Navigation
  counter: string;
  stats: string;
  charts: string;
  settings: string;

  // Header
  appTitle: string;
  appSubtitle: string;

  // Counter View
  todaysProgress: string;
  puffsToday: string;
  ofGoal: string;
  remaining: string;
  nicotine: string;
  perPuff: string;
  tapToPuff: string;
  today: string;
  goalExceeded: string;
  goalExceededMessage: string;
  greatStart: string;
  greatStartMessage: string;

  // Stats View
  yourStatistics: string;
  last30Days: string;
  currentStreak: string;
  bestStreak: string;
  daysClean: string;
  totalUsage30Days: string;
  totalPuffs: string;
  totalNicotine: string;
  dailyAverages: string;
  puffsPerDay: string;
  nicotinePerDay: string;
  improving: string;
  increasing: string;
  recentActivity: string;
  puffs: string;
  daysCleanMessage: string;
  amazingProgress: string;
  keepBuilding: string;

  // Charts View
  usageCharts: string;
  visualizePatterns: string;
  day: string;
  week: string;
  month: string;
  dailyPuffCount: string;
  dailyNicotineIntake: string;
  summary: string;
  avgPuffsDay: string;
  avgNicotineDay: string;
  trendAnalysis: string;
  usageDecreasing: string;
  usageIncreasing: string;
  usageStable: string;
  recentAverage: string;
  noDataCharts: string;
  startTrackingCharts: string;

  // Settings View
  userPreferences: string;
  customizePreferences: string;
  nicotinePerPuffLabel: string;
  nicotinePerPuffDesc: string;
  defaultDailyGoal: string;
  defaultDailyGoalDesc: string;
  saveSettings: string;
  saving: string;
  todaysGoal: string;
  puffLimitToday: string;
  overrideGoal: string;
  currentProgress: string;
  setTodaysGoal: string;
  setting: string;
  aboutPuffCount: string;
  aboutDescription: string;
  tipsForSuccess: string;
  tip1: string;
  tip2: string;
  tip3: string;
  tip4: string;
  tip5: string;
  dataManagement: string;
  dataDescription: string;
  userId: string;
  created: string;
  language: string;

  // Time periods
  today: string;
  last7Days: string;
  last30Days: string;

  // Messages
  welcome: string;
  welcomeMessage: string;
  error: string;
  failedToRecord: string;
  settingsUpdated: string;
  settingsUpdatedMessage: string;
  failedToUpdate: string;
  goalSet: string;
  goalSetMessage: string;
  failedToSetGoal: string;
  invalidInput: string;
  invalidNicotine: string;
  invalidGoal: string;
  settingUpProfile: string;
  noStatsYet: string;
  startTrackingStats: string;

  // Days of week
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;

  // Months
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;
}

export const translations: Record<'en' | 'es', Translations> = {
  en: {
    // Navigation
    counter: 'Counter',
    stats: 'Stats',
    charts: 'Charts',
    settings: 'Settings',

    // Header
    appTitle: 'Puff Count',
    appSubtitle: 'Track your journey to quit vaping',

    // Counter View
    todaysProgress: "Today's Progress",
    puffsToday: 'puffs today',
    ofGoal: 'of goal',
    remaining: 'remaining',
    nicotine: 'Nicotine',
    perPuff: 'Per puff',
    tapToPuff: 'TAP TO PUFF',
    today: 'Today',
    goalExceeded: 'Goal exceeded!',
    goalExceededMessage: "You've reached your daily limit. Consider taking a break.",
    greatStart: 'Great start!',
    greatStartMessage: 'No puffs recorded today. Keep it up!',

    // Stats View
    yourStatistics: 'Your Statistics',
    last30Days: 'Last 30 days overview',
    currentStreak: 'Current Streak',
    bestStreak: 'Best Streak',
    daysClean: 'days clean',
    totalUsage30Days: 'Total Usage (30 days)',
    totalPuffs: 'Total Puffs',
    totalNicotine: 'Total Nicotine',
    dailyAverages: 'Daily Averages',
    puffsPerDay: 'Puffs per day',
    nicotinePerDay: 'Nicotine per day',
    improving: 'Improving',
    increasing: 'Increasing',
    recentActivity: 'Recent Activity',
    puffs: 'puffs',
    daysCleanMessage: 'Days Clean!',
    amazingProgress: "Amazing progress! You're building a great habit.",
    keepBuilding: 'Great start! Keep building your streak.',

    // Charts View
    usageCharts: 'Usage Charts',
    visualizePatterns: 'Visualize your vaping patterns',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    dailyPuffCount: 'Daily Puff Count',
    dailyNicotineIntake: 'Daily Nicotine Intake',
    summary: 'Summary',
    avgPuffsDay: 'Avg Puffs/Day',
    avgNicotineDay: 'Avg Nicotine/Day',
    trendAnalysis: 'Trend Analysis',
    usageDecreasing: '📈 Your usage is decreasing - great progress!',
    usageIncreasing: '📉 Your usage is increasing - consider setting goals.',
    usageStable: '📊 Your usage is stable - maintain awareness.',
    recentAverage: 'Recent average',
    noDataCharts: 'No data available for charts yet.',
    startTrackingCharts: 'Start tracking puffs to see your progress!',

    // Settings View
    userPreferences: 'User Preferences',
    customizePreferences: 'Customize your tracking preferences',
    nicotinePerPuffLabel: 'Nicotine per puff (mg)',
    nicotinePerPuffDesc: 'Typical range: 0.3-2.0mg per puff depending on your device and e-liquid',
    defaultDailyGoal: 'Default daily goal (puffs)',
    defaultDailyGoalDesc: 'Set to 0 to disable daily goals, or set a target to work towards',
    saveSettings: 'Save Settings',
    saving: 'Saving...',
    todaysGoal: "Today's Goal",
    puffLimitToday: 'Puff limit for today',
    overrideGoal: 'Override your default goal for today only',
    currentProgress: 'Current progress',
    setTodaysGoal: "Set Today's Goal",
    setting: 'Setting...',
    aboutPuffCount: 'About Puff Count',
    aboutDescription: 'Puff Count helps you track your vaping habits and work towards reducing or quitting.',
    tipsForSuccess: 'Tips for success:',
    tip1: 'Set realistic daily goals and gradually reduce them',
    tip2: 'Track every puff honestly for accurate data',
    tip3: 'Review your charts regularly to identify patterns',
    tip4: 'Celebrate your clean streaks and progress',
    tip5: 'Consider seeking professional help if needed',
    dataManagement: 'Data Management',
    dataDescription: 'Your data is stored locally and securely. All tracking information remains private.',
    userId: 'User ID',
    created: 'Created',
    language: 'Language',

    // Time periods
    last7Days: 'Last 7 Days',

    // Messages
    welcome: 'Welcome to Puff Count!',
    welcomeMessage: 'Your profile has been created. Start tracking your puffs.',
    error: 'Error',
    failedToRecord: 'Failed to record puff. Please try again.',
    settingsUpdated: 'Settings updated',
    settingsUpdatedMessage: 'Your preferences have been saved successfully.',
    failedToUpdate: 'Failed to update settings. Please try again.',
    goalSet: 'Goal set',
    goalSetMessage: 'Your daily goal has been updated.',
    failedToSetGoal: 'Failed to set goal. Please try again.',
    invalidInput: 'Invalid input',
    invalidNicotine: 'Please enter a valid nicotine amount.',
    invalidGoal: 'Please enter a valid daily goal.',
    settingUpProfile: 'Setting up your profile...',
    noStatsYet: 'No statistics available yet.',
    startTrackingStats: 'Start tracking puffs to see your stats!',

    // Days of week
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',

    // Months
    january: 'Jan',
    february: 'Feb',
    march: 'Mar',
    april: 'Apr',
    may: 'May',
    june: 'Jun',
    july: 'Jul',
    august: 'Aug',
    september: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dec',
  },
  es: {
    // Navigation
    counter: 'Contador',
    stats: 'Estadísticas',
    charts: 'Gráficos',
    settings: 'Ajustes',

    // Header
    appTitle: 'Contador de Caladas',
    appSubtitle: 'Rastrea tu camino para dejar de vapear',

    // Counter View
    todaysProgress: 'Progreso de Hoy',
    puffsToday: 'caladas hoy',
    ofGoal: 'de la meta',
    remaining: 'restantes',
    nicotine: 'Nicotina',
    perPuff: 'Por calada',
    tapToPuff: 'TOCA PARA CALADA',
    today: 'Hoy',
    goalExceeded: '¡Meta superada!',
    goalExceededMessage: 'Has alcanzado tu límite diario. Considera tomar un descanso.',
    greatStart: '¡Buen comienzo!',
    greatStartMessage: 'No se han registrado caladas hoy. ¡Sigue así!',

    // Stats View
    yourStatistics: 'Tus Estadísticas',
    last30Days: 'Resumen de los últimos 30 días',
    currentStreak: 'Racha Actual',
    bestStreak: 'Mejor Racha',
    daysClean: 'días limpio',
    totalUsage30Days: 'Uso Total (30 días)',
    totalPuffs: 'Caladas Totales',
    totalNicotine: 'Nicotina Total',
    dailyAverages: 'Promedios Diarios',
    puffsPerDay: 'Caladas por día',
    nicotinePerDay: 'Nicotina por día',
    improving: 'Mejorando',
    increasing: 'Aumentando',
    recentActivity: 'Actividad Reciente',
    puffs: 'caladas',
    daysCleanMessage: '¡Días Limpio!',
    amazingProgress: '¡Progreso increíble! Estás construyendo un gran hábito.',
    keepBuilding: '¡Buen comienzo! Sigue construyendo tu racha.',

    // Charts View
    usageCharts: 'Gráficos de Uso',
    visualizePatterns: 'Visualiza tus patrones de vapeo',
    day: 'Día',
    week: 'Semana',
    month: 'Mes',
    dailyPuffCount: 'Caladas Diarias',
    dailyNicotineIntake: 'Ingesta Diaria de Nicotina',
    summary: 'Resumen',
    avgPuffsDay: 'Prom. Caladas/Día',
    avgNicotineDay: 'Prom. Nicotina/Día',
    trendAnalysis: 'Análisis de Tendencia',
    usageDecreasing: '📈 Tu uso está disminuyendo - ¡gran progreso!',
    usageIncreasing: '📉 Tu uso está aumentando - considera establecer metas.',
    usageStable: '📊 Tu uso es estable - mantén la conciencia.',
    recentAverage: 'Promedio reciente',
    noDataCharts: 'Aún no hay datos disponibles para gráficos.',
    startTrackingCharts: '¡Comienza a rastrear caladas para ver tu progreso!',

    // Settings View
    userPreferences: 'Preferencias de Usuario',
    customizePreferences: 'Personaliza tus preferencias de seguimiento',
    nicotinePerPuffLabel: 'Nicotina por calada (mg)',
    nicotinePerPuffDesc: 'Rango típico: 0.3-2.0mg por calada dependiendo de tu dispositivo y e-líquido',
    defaultDailyGoal: 'Meta diaria predeterminada (caladas)',
    defaultDailyGoalDesc: 'Establece en 0 para desactivar metas diarias, o establece un objetivo hacia el cual trabajar',
    saveSettings: 'Guardar Ajustes',
    saving: 'Guardando...',
    todaysGoal: 'Meta de Hoy',
    puffLimitToday: 'Límite de caladas para hoy',
    overrideGoal: 'Anula tu meta predeterminada solo para hoy',
    currentProgress: 'Progreso actual',
    setTodaysGoal: 'Establecer Meta de Hoy',
    setting: 'Estableciendo...',
    aboutPuffCount: 'Acerca de Contador de Caladas',
    aboutDescription: 'Contador de Caladas te ayuda a rastrear tus hábitos de vapeo y trabajar hacia reducir o dejar de fumar.',
    tipsForSuccess: 'Consejos para el éxito:',
    tip1: 'Establece metas diarias realistas y redúcelas gradualmente',
    tip2: 'Rastrea cada calada honestamente para obtener datos precisos',
    tip3: 'Revisa tus gráficos regularmente para identificar patrones',
    tip4: 'Celebra tus rachas limpias y progreso',
    tip5: 'Considera buscar ayuda profesional si es necesario',
    dataManagement: 'Gestión de Datos',
    dataDescription: 'Tus datos se almacenan localmente y de forma segura. Toda la información de seguimiento permanece privada.',
    userId: 'ID de Usuario',
    created: 'Creado',
    language: 'Idioma',

    // Time periods
    last7Days: 'Últimos 7 Días',

    // Messages
    welcome: '¡Bienvenido a Contador de Caladas!',
    welcomeMessage: 'Tu perfil ha sido creado. Comienza a rastrear tus caladas.',
    error: 'Error',
    failedToRecord: 'Error al registrar calada. Por favor intenta de nuevo.',
    settingsUpdated: 'Ajustes actualizados',
    settingsUpdatedMessage: 'Tus preferencias han sido guardadas exitosamente.',
    failedToUpdate: 'Error al actualizar ajustes. Por favor intenta de nuevo.',
    goalSet: 'Meta establecida',
    goalSetMessage: 'Tu meta diaria ha sido actualizada.',
    failedToSetGoal: 'Error al establecer meta. Por favor intenta de nuevo.',
    invalidInput: 'Entrada inválida',
    invalidNicotine: 'Por favor ingresa una cantidad de nicotina válida.',
    invalidGoal: 'Por favor ingresa una meta diaria válida.',
    settingUpProfile: 'Configurando tu perfil...',
    noStatsYet: 'Aún no hay estadísticas disponibles.',
    startTrackingStats: '¡Comienza a rastrear caladas para ver tus estadísticas!',

    // Days of week
    monday: 'Lun',
    tuesday: 'Mar',
    wednesday: 'Mié',
    thursday: 'Jue',
    friday: 'Vie',
    saturday: 'Sáb',
    sunday: 'Dom',

    // Months
    january: 'Ene',
    february: 'Feb',
    march: 'Mar',
    april: 'Abr',
    may: 'May',
    june: 'Jun',
    july: 'Jul',
    august: 'Ago',
    september: 'Sep',
    october: 'Oct',
    november: 'Nov',
    december: 'Dic',
  },
};

export type Language = keyof typeof translations;

export function useTranslation(language: Language = 'en'): Translations {
  return translations[language];
}

export function formatDate(date: string | Date, language: Language = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const t = useTranslation(language);
  
  const months = [
    t.january, t.february, t.march, t.april, t.may, t.june,
    t.july, t.august, t.september, t.october, t.november, t.december
  ];
  
  const days = [t.sunday, t.monday, t.tuesday, t.wednesday, t.thursday, t.friday, t.saturday];
  
  const dayName = days[dateObj.getDay()];
  const monthName = months[dateObj.getMonth()];
  const dayNumber = dateObj.getDate();
  
  return `${dayName}, ${monthName} ${dayNumber}`;
}