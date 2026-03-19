export const dynamic = 'force-dynamic'

export default function TimerPage() {
  return (
    <div className="flex flex-col flex-1 bg-surface-container-low relative overflow-hidden">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-50 bg-surface-container-low/80 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-6 lg:px-10 h-[72px] gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <h1 className="text-xl font-extrabold tracking-tight text-primary font-headline shrink-0">FounderEngine</h1>
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
            <input className="bg-white border border-outline-variant/30 rounded-full pl-10 pr-5 py-2 w-56 focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all" placeholder="Search…" type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-full shadow-sm border border-outline-variant/20 transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:text-primary bg-white rounded-full shadow-sm border border-outline-variant/20 transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <div className="h-9 w-9 bg-primary/15 text-primary text-sm font-bold flex items-center justify-center rounded-full border border-primary/20">AR</div>
        </div>
      </header>

      {/* Decorative blobs */}
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden -z-0">
        <div className="absolute top-0 right-0 w-[40vw] h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/10 blur-[100px] rounded-full"></div>
      </div>

      {/* ── Main canvas ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-16">

        {/* Context labels */}
        <div className="w-full max-w-4xl flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Current Sprint</p>
            <h3 className="text-2xl font-extrabold text-on-surface tracking-tight">Refactor API Sprint</h3>
            <div className="flex items-center gap-2 text-primary text-sm font-semibold mt-1">
              <span className="material-symbols-outlined text-[16px]">folder</span> Zen CMS
            </div>
          </div>
          <div className="flex items-center gap-3.5 bg-white px-5 py-3.5 rounded-2xl shadow-sm border border-outline-variant/10 self-start">
            <div className="w-3 h-3 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_rgba(0,108,73,0.5)]"></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Session Mode</p>
              <p className="text-sm font-bold text-on-surface">Deep Focus Active</p>
            </div>
          </div>
        </div>

        {/* Timer circle */}
        <div className="relative">
          <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] rounded-full border-[10px] border-surface-container flex items-center justify-center relative">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                className="text-secondary"
                cx="50%" cy="50%" fill="transparent" r="46%"
                stroke="currentColor"
                strokeDasharray="1300" strokeDashoffset="450"
                strokeLinecap="round" strokeWidth="10"
              />
            </svg>
            <div className="w-[260px] h-[260px] sm:w-[330px] sm:h-[330px] lg:w-[390px] lg:h-[390px] rounded-full bg-white shadow-xl flex flex-col items-center justify-center border border-outline-variant/10">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3">Elapsed Time</p>
              <div className="flex items-baseline">
                <span className="text-6xl sm:text-8xl font-extrabold text-on-background tracking-tight tabular-nums">24</span>
                <span className="text-4xl sm:text-6xl font-bold text-primary mx-1">:</span>
                <span className="text-6xl sm:text-8xl font-extrabold text-on-background tracking-tight tabular-nums">18</span>
              </div>
              <div className="mt-5 flex gap-8 items-center">
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Goal</p>
                  <p className="text-base font-bold text-on-surface tabular-nums">45:00</p>
                </div>
                <div className="w-px h-8 bg-outline-variant/30"></div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Streak</p>
                  <p className="text-base font-bold text-primary">4 Days 🔥</p>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex gap-3">
            <button className="w-13 h-13 bg-white border border-outline-variant/20 rounded-full shadow-md flex items-center justify-center hover:bg-surface-container transition-all active:scale-95" style={{ width: 52, height: 52 }}>
              <span className="material-symbols-outlined text-[22px] text-on-surface">pause</span>
            </button>
            <button className="h-[52px] px-7 bg-primary text-white rounded-full shadow-lg shadow-primary/30 font-semibold text-sm flex items-center gap-2 hover:-translate-y-0.5 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
              Stop Session
            </button>
            <button className="bg-white border border-outline-variant/20 rounded-full shadow-md flex items-center justify-center hover:bg-surface-container transition-all active:scale-95" style={{ width: 52, height: 52 }}>
              <span className="material-symbols-outlined text-[22px] text-on-surface">skip_next</span>
            </button>
          </div>
        </div>

        {/* Insight panels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-4xl mt-20">
          {/* Productivity */}
          <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
              <p className="font-semibold text-sm text-on-surface">Productivity</p>
            </div>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden mb-3">
              <div className="h-full w-4/5 bg-secondary rounded-full"></div>
            </div>
            <p className="text-xs text-on-surface-variant">80% of daily target reached</p>
          </div>

          {/* Recent laps */}
          <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">history</span>
              </div>
              <p className="font-semibold text-sm text-on-surface">Recent Laps</p>
            </div>
            <ul className="space-y-3">
              {[['Module Setup', '45:00'], ['Schema Fix', '22:14']].map(([label, time]) => (
                <li key={label} className="flex justify-between items-center text-xs">
                  <span className="text-on-surface-variant font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>{label}
                  </span>
                  <span className="text-on-surface font-bold tabular-nums">{time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Focus level */}
          <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
              </div>
              <p className="font-semibold text-sm text-on-surface">Focus Level</p>
            </div>
            <div className="flex justify-between items-end h-12 gap-1 px-1">
              {[30, 45, 60, 85, 100, 70, 90].map((v, i) => (
                <div key={i} className="flex-1 rounded-sm bg-secondary transition-all" style={{ height: `${v}%`, opacity: i < 5 ? 1 : 0.3 }}></div>
              ))}
            </div>
            <p className="text-xs text-secondary font-semibold mt-3">Peak performance detected</p>
          </div>
        </div>
      </div>
    </div>
  )
}
