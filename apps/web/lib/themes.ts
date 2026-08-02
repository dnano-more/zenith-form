export interface FormTheme {
  id: string;
  name: string;
  description: string;
  swatchBg: string;
  swatchCard: string;
  swatchAccent: string;
  bgClass: string;
  textClass: string;
  subtextClass: string;
  headerClass: string;
  cardClass: string;
  inputClass: string;
  optionClass: string;
  optionSelectedClass: string;
  progressBg: string;
  progressFill: string;
  primaryButtonClass: string;
  accentTextClass: string;
  badgeBg: string;
}

export const FORM_THEMES: Record<string, FormTheme> = {
  default: {
    id: "default",
    name: "Zenith Slate",
    description: "Modern dark slate design system with blue accents",
    swatchBg: "from-slate-900 via-slate-800 to-slate-900",
    swatchCard: "bg-slate-800/80 border-slate-700",
    swatchAccent: "bg-blue-500",
    bgClass: "bg-slate-950 text-slate-100",
    textClass: "text-slate-100",
    subtextClass: "text-slate-400",
    headerClass: "border-b border-slate-800/80 bg-slate-950/90 backdrop-blur",
    cardClass: "border-slate-800/80 shadow-2xl shadow-slate-950 bg-slate-900/90 backdrop-blur text-slate-100",
    inputClass: "bg-slate-950/70 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20",
    optionClass: "border-slate-800 bg-slate-950/40 text-slate-200 hover:border-blue-500/50 hover:bg-slate-800/40",
    optionSelectedClass: "border-blue-500 bg-blue-500/15 text-blue-300 font-semibold shadow-md ring-1 ring-blue-500/50",
    progressBg: "bg-slate-800",
    progressFill: "bg-blue-500",
    primaryButtonClass: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25",
    accentTextClass: "text-blue-400",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Violet",
    description: "Deep indigo & purple glow dark theme",
    swatchBg: "from-slate-950 via-indigo-950 to-purple-950",
    swatchCard: "bg-indigo-950/80 border-indigo-700",
    swatchAccent: "bg-indigo-500",
    bgClass: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-indigo-50",
    textClass: "text-indigo-50",
    subtextClass: "text-indigo-300/70",
    headerClass: "border-b border-indigo-900/60 bg-slate-950/85 backdrop-blur",
    cardClass: "border-indigo-500/30 shadow-2xl shadow-indigo-950/60 bg-slate-900/90 backdrop-blur text-indigo-50",
    inputClass: "bg-slate-950/80 border-indigo-700/60 text-indigo-100 placeholder:text-indigo-300/40 focus:border-indigo-400 focus:ring-indigo-500/20",
    optionClass: "border-indigo-900/60 bg-slate-950/50 text-indigo-100 hover:border-indigo-500/50 hover:bg-indigo-950/40",
    optionSelectedClass: "border-indigo-500 bg-indigo-500/20 text-indigo-200 font-semibold shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50",
    progressBg: "bg-slate-800/80",
    progressFill: "bg-indigo-500",
    primaryButtonClass: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30",
    accentTextClass: "text-indigo-400",
    badgeBg: "bg-indigo-500/25 text-indigo-300 border-indigo-500/40",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Forest",
    description: "Refreshing deep mint & emerald dark theme",
    swatchBg: "from-zinc-950 via-emerald-950 to-teal-950",
    swatchCard: "bg-emerald-950/80 border-emerald-700",
    swatchAccent: "bg-emerald-500",
    bgClass: "bg-gradient-to-br from-zinc-950 via-emerald-950/90 to-zinc-900 text-emerald-50",
    textClass: "text-emerald-50",
    subtextClass: "text-emerald-300/70",
    headerClass: "border-b border-emerald-900/60 bg-zinc-950/85 backdrop-blur",
    cardClass: "border-emerald-500/30 shadow-2xl shadow-emerald-950/60 bg-zinc-900/90 backdrop-blur text-emerald-50",
    inputClass: "bg-zinc-950/80 border-emerald-700/60 text-emerald-100 placeholder:text-emerald-300/40 focus:border-emerald-400 focus:ring-emerald-500/20",
    optionClass: "border-emerald-900/60 bg-zinc-950/50 text-emerald-100 hover:border-emerald-500/50 hover:bg-emerald-950/40",
    optionSelectedClass: "border-emerald-500 bg-emerald-500/20 text-emerald-200 font-semibold shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50",
    progressBg: "bg-zinc-800/80",
    progressFill: "bg-emerald-500",
    primaryButtonClass: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30",
    accentTextClass: "text-emerald-400",
    badgeBg: "bg-emerald-500/25 text-emerald-300 border-emerald-500/40",
  },
  sunset: {
    id: "sunset",
    name: "Sunset Amber",
    description: "Warm rose, orange & amber gradient theme",
    swatchBg: "from-stone-950 via-amber-950 to-rose-950",
    swatchCard: "bg-amber-950/80 border-amber-700",
    swatchAccent: "bg-amber-500",
    bgClass: "bg-gradient-to-br from-stone-950 via-amber-950/80 to-rose-950/90 text-amber-50",
    textClass: "text-amber-50",
    subtextClass: "text-amber-200/70",
    headerClass: "border-b border-amber-900/60 bg-stone-950/85 backdrop-blur",
    cardClass: "border-amber-500/30 shadow-2xl shadow-amber-950/60 bg-stone-900/90 backdrop-blur text-amber-50",
    inputClass: "bg-stone-950/80 border-amber-700/60 text-amber-100 placeholder:text-amber-300/40 focus:border-amber-400 focus:ring-amber-500/20",
    optionClass: "border-amber-900/60 bg-stone-950/50 text-amber-100 hover:border-amber-500/50 hover:bg-amber-950/40",
    optionSelectedClass: "border-amber-500 bg-amber-500/20 text-amber-200 font-semibold shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50",
    progressBg: "bg-stone-800/80",
    progressFill: "bg-amber-500",
    primaryButtonClass: "bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white shadow-lg shadow-rose-600/30",
    accentTextClass: "text-amber-400",
    badgeBg: "bg-amber-500/25 text-amber-300 border-amber-500/40",
  },
  ocean: {
    id: "ocean",
    name: "Ocean Deep",
    description: "Cool vibrant cyan & teal ocean theme",
    swatchBg: "from-slate-950 via-cyan-950 to-blue-950",
    swatchCard: "bg-cyan-950/80 border-cyan-700",
    swatchAccent: "bg-cyan-500",
    bgClass: "bg-gradient-to-br from-slate-950 via-cyan-950 to-blue-950 text-cyan-50",
    textClass: "text-cyan-50",
    subtextClass: "text-cyan-200/70",
    headerClass: "border-b border-cyan-900/60 bg-slate-950/85 backdrop-blur",
    cardClass: "border-cyan-500/30 shadow-2xl shadow-cyan-950/60 bg-slate-900/90 backdrop-blur text-cyan-50",
    inputClass: "bg-slate-950/80 border-cyan-700/60 text-cyan-100 placeholder:text-cyan-300/40 focus:border-cyan-400 focus:ring-cyan-500/20",
    optionClass: "border-cyan-900/60 bg-slate-950/50 text-cyan-100 hover:border-cyan-500/50 hover:bg-cyan-950/40",
    optionSelectedClass: "border-cyan-500 bg-cyan-500/20 text-cyan-200 font-semibold shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50",
    progressBg: "bg-slate-800/80",
    progressFill: "bg-cyan-500",
    primaryButtonClass: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30",
    accentTextClass: "text-cyan-400",
    badgeBg: "bg-cyan-500/25 text-cyan-300 border-cyan-500/40",
  },
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyber Neon",
    description: "Vibrant neon pink & purple futuristic theme",
    swatchBg: "from-neutral-950 via-purple-950 to-fuchsia-950",
    swatchCard: "bg-fuchsia-950/80 border-fuchsia-700",
    swatchAccent: "bg-fuchsia-500",
    bgClass: "bg-gradient-to-br from-neutral-950 via-purple-950 to-fuchsia-950 text-fuchsia-100",
    textClass: "text-fuchsia-100",
    subtextClass: "text-fuchsia-300/70",
    headerClass: "border-b border-fuchsia-900/60 bg-neutral-950/85 backdrop-blur",
    cardClass: "border-fuchsia-500/40 shadow-2xl shadow-fuchsia-950/70 bg-neutral-900/95 backdrop-blur text-fuchsia-100",
    inputClass: "bg-neutral-950/80 border-fuchsia-700/60 text-fuchsia-100 placeholder:text-fuchsia-300/40 focus:border-fuchsia-400 focus:ring-fuchsia-500/20",
    optionClass: "border-fuchsia-900/60 bg-neutral-950/50 text-fuchsia-100 hover:border-fuchsia-500/50 hover:bg-fuchsia-950/40",
    optionSelectedClass: "border-fuchsia-500 bg-fuchsia-500/20 text-fuchsia-200 font-semibold shadow-lg shadow-fuchsia-500/10 ring-1 ring-fuchsia-500/50",
    progressBg: "bg-neutral-800/80",
    progressFill: "bg-fuchsia-500",
    primaryButtonClass: "bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-600/30",
    accentTextClass: "text-fuchsia-400",
    badgeBg: "bg-fuchsia-500/25 text-fuchsia-300 border-fuchsia-500/40",
  },
  minimal_light: {
    id: "minimal_light",
    name: "Clean Light Paper",
    description: "Bright, high-contrast, warm paper minimalist theme",
    swatchBg: "from-amber-100 via-orange-50 to-amber-50",
    swatchCard: "bg-white border-amber-300",
    swatchAccent: "bg-amber-600",
    bgClass: "bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-stone-100 text-stone-900",
    textClass: "text-stone-900",
    subtextClass: "text-stone-600",
    headerClass: "border-b border-amber-200/80 bg-white/95 backdrop-blur text-stone-900",
    cardClass: "border-amber-200/80 shadow-xl bg-white text-stone-900",
    inputClass: "bg-stone-50 border-stone-300 text-stone-900 placeholder:text-stone-400 focus:border-stone-800 focus:ring-stone-400/20",
    optionClass: "border-stone-200 bg-stone-50/60 text-stone-800 hover:border-stone-400 hover:bg-amber-50/50",
    optionSelectedClass: "border-stone-900 bg-stone-900 text-white font-semibold shadow-md ring-1 ring-stone-900",
    progressBg: "bg-stone-200",
    progressFill: "bg-stone-900",
    primaryButtonClass: "bg-stone-900 hover:bg-stone-800 text-white shadow-md",
    accentTextClass: "text-stone-900 font-extrabold",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
  },
};

export function getFormTheme(themeId?: string | null): FormTheme {
  const defaultTheme = FORM_THEMES.default!;
  if (!themeId) return defaultTheme;
  return FORM_THEMES[themeId] ?? defaultTheme;
}
