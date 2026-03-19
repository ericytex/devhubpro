export const dynamic = 'force-dynamic'

export default function TimerPage() {
  return (
    <div className="flex-grow p-6 md:p-12 flex flex-col items-center justify-center relative bg-surface-container-low min-h-screen w-full">
      {/* TopAppBar (Shared Component Logic Extracted loosely so this is the page content) */}
      <header className="absolute top-0 left-0 w-full bg-surface-container-low/80 backdrop-blur-xl flex justify-between items-center px-6 md:px-10 h-24 border-b border-outline-variant/5 text-center z-10">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold tracking-tighter text-primary font-headline hidden sm:block">FounderEngine</h1>
          <div className="relative w-64 hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input className="w-full bg-white shadow-sm border border-outline-variant/20 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none" placeholder="Search resources..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 bg-white p-2 rounded-full shadow-sm border border-outline-variant/20">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 bg-white p-2 rounded-full shadow-sm border border-outline-variant/20">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/10 shadow-sm flex items-center justify-center text-primary font-bold font-headline">
            AR
          </div>
        </div>
      </header>

      {/* Background Decoration */}
      <div className="fixed top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none hidden md:block"></div>
      <div className="fixed bottom-0 right-0 -z-10 w-96 h-96 bg-primary/10 blur-[120px] rounded-[100%] pointer-events-none hidden md:block"></div>

      {/* Context Header */}
      <div className="absolute top-32 left-6 md:left-12 max-w-sm hidden md:block">
        <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest mb-2 font-bold">Current Sprint</p>
        <h3 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Deep Work Protocol</h3>
        <div className="flex items-center gap-2 text-primary font-bold">
          <span className="material-symbols-outlined text-lg">folder</span>
          <span className="font-body text-sm">Zen CMS Architecture</span>
        </div>
      </div>

      {/* Focus Status */}
      <div className="absolute top-32 right-6 md:right-12 hidden md:flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-outline-variant/10 cursor-pointer hover:shadow-md transition-shadow">
        <div className="w-4 h-4 rounded-full bg-secondary animate-pulse shadow-[0_0_12px_rgba(0,108,73,0.5)]"></div>
        <div>
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Session Mode</p>
          <p className="text-base font-bold text-on-surface font-headline">Deep Focus Active</p>
        </div>
      </div>

      {/* Central Timer Mechanism */}
      <div className="relative group mt-24 md:mt-0">
        <div className="w-[320px] h-[320px] md:w-[480px] md:h-[480px] rounded-full border-[12px] border-surface-container flex items-center justify-center relative">
          {/* Progress SVG */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle className="text-secondary transition-all duration-1000 ease-linear" cx="50%" cy="50%" fill="transparent" r="48%" stroke="currentColor" strokeDasharray="1470" strokeDashoffset="700" strokeLinecap="round" strokeWidth="12"></circle>
          </svg>
          {/* Inner Container */}
          <div className="w-[280px] h-[280px] md:w-[420px] md:h-[420px] rounded-full bg-white shadow-xl flex flex-col items-center justify-center relative z-10 border border-outline-variant/10">
            <span className="text-on-surface-variant font-label text-sm md:text-lg font-bold tracking-[0.2em] uppercase mb-4 md:mb-6 text-center">Elapsed Time</span>
            <div className="flex items-baseline justify-center w-full px-4">
              <span className="text-7xl md:text-9xl font-headline font-black text-on-background tracking-tighter tabular-nums">24</span>
              <span className="text-5xl md:text-7xl font-headline font-bold text-primary mx-1 md:mx-2 pb-2 md:pb-4 blink">:</span>
              <span className="text-7xl md:text-9xl font-headline font-black text-on-background tracking-tighter tabular-nums">18</span>
            </div>
            <div className="mt-6 md:mt-8 flex gap-8 md:gap-12">
              <div className="text-center">
                <p className="text-[10px] md:text-xs text-on-surface-variant uppercase font-bold tracking-widest mb-1">Goal</p>
                <p className="text-base md:text-xl font-headline font-bold text-on-surface tabular-nums">45:00</p>
              </div>
              <div className="w-px h-10 md:h-12 bg-outline-variant/30"></div>
              <div className="text-center">
                <p className="text-[10px] md:text-xs text-on-surface-variant uppercase font-bold tracking-widest mb-1">Streak</p>
                <p className="text-base md:text-xl font-headline font-bold text-primary">4 Days 🔥</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Controls */}
        <div className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 flex gap-3 md:gap-4 z-20">
          <button className="bg-white hover:bg-surface-container text-on-surface w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 border border-outline-variant/20">
            <span className="material-symbols-outlined text-2xl md:text-3xl">pause</span>
          </button>
          <button className="bg-primary text-white px-8 md:px-10 h-14 md:h-16 rounded-full shadow-[0_10px_30px_rgba(53,37,205,0.3)] font-headline font-bold text-base md:text-lg flex items-center justify-center gap-2 md:gap-3 transition-all active:scale-95 hover:shadow-[0_15px_40px_rgba(53,37,205,0.4)] hover:-translate-y-1">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
            Stop Session
          </button>
          <button className="bg-white hover:bg-surface-container text-on-surface w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95 border border-outline-variant/20">
            <span className="material-symbols-outlined text-2xl md:text-3xl">skip_next</span>
          </button>
        </div>
      </div>

      {/* Bottom Insight Panel */}
      <div className="mt-20 md:mt-32 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 z-10 px-4 md:px-0">
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1rem] bg-secondary/10 text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">bolt</span>
              </div>
              <h4 className="font-headline font-bold text-lg text-on-surface tracking-tight">Productivity</h4>
            </div>
            <span className="text-secondary font-bold text-sm bg-secondary/10 px-3 py-1 rounded-full">80%</span>
          </div>
          <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden mb-4">
            <div className="h-full w-4/5 bg-secondary rounded-full shadow-[0_0_10px_rgba(0,108,73,0.3)]"></div>
          </div>
          <p className="text-sm font-medium text-on-surface-variant w-full text-center">Daily target reached. Great job!</p>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-[1rem] bg-surface-container-high text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">history</span>
            </div>
            <h4 className="font-headline font-bold text-lg text-on-surface tracking-tight">Recent Laps</h4>
          </div>
          <ul className="space-y-4">
            <li className="flex justify-between items-center text-sm p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-default">
              <span className="text-on-surface font-semibold flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Module Setup</span>
              <span className="text-primary font-black font-headline tabular-nums">45:00</span>
            </li>
            <li className="flex justify-between items-center text-sm p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-default">
              <span className="text-on-surface font-semibold flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div> Schema Fix</span>
              <span className="text-tertiary font-black font-headline tabular-nums">22:14</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-[1rem] bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">psychology</span>
            </div>
            <h4 className="font-headline font-bold text-lg text-on-surface tracking-tight">Focus Level</h4>
          </div>
          <div className="flex justify-between items-end h-16 w-full px-2 mt-4 space-x-1">
            {[30, 45, 60, 85, 100, 70, 90, 65, 80].map((val, i) => (
              <div key={i} className={`w-full max-w-[12px] rounded-t-full transition-all duration-500 hover:bg-secondary cursor-pointer ${i === 4 ? 'bg-secondary h-full' : 'bg-primary/20 h-['+val+'%]'}`} style={{ height: `${val}%` }}></div>
            ))}
          </div>
          <p className="text-sm font-bold text-secondary text-center mt-6 bg-secondary/10 py-2 rounded-xl">Peak performance detected</p>
        </div>
      </div>
    </div>
  )
}
