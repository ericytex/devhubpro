'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { logSession } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface Project { id: string; name: string }
interface Session { id: string; duration: number | null; notes: string | null; startTime: Date; projectName: string }

type TimerState = 'idle' | 'running' | 'paused'

function fmt(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function TimerWidget({
  projects,
  initialSessions,
  todayMinutes,
  streak,
}: {
  projects: Project[]
  initialSessions: Session[]
  todayMinutes: number
  streak: number
}) {
  const router = useRouter()
  const [state, setState] = useState<TimerState>('idle')
  const [elapsed, setElapsed] = useState(0)         // seconds
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '')
  const [notes, setNotes] = useState('')
  const [goal, setGoal] = useState(45)              // minutes
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Ref to hold the mutable state for the tick function
  const timerData = useRef({
    accumulated: 0,
    startTime: 0,
    state: 'idle' as TimerState
  })

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('founderengine_timer')
      if (stored) {
        const data = JSON.parse(stored)
        if (data.projectId && projects.some(p => p.id === data.projectId)) {
          setProjectId(data.projectId)
        }
        if (data.goal) setGoal(data.goal)
        if (data.notes) setNotes(data.notes)
        
        if (data.state === 'running') {
          timerData.current.accumulated = data.accumulated || 0
          timerData.current.startTime = data.startTime || Date.now()
          timerData.current.state = 'running'
          
          const now = Date.now()
          const currentElapsed = timerData.current.accumulated + Math.floor((now - timerData.current.startTime) / 1000)
          setElapsed(currentElapsed)
          setState('running')
          intervalRef.current = setInterval(tick, 500)
        } else if (data.state === 'paused') {
          timerData.current.accumulated = data.accumulated || 0
          timerData.current.startTime = data.startTime || 0
          timerData.current.state = 'paused'
          setElapsed(data.accumulated || 0)
          setState('paused')
        }
      }
    } catch (e) {
      console.error('Failed to restore timer state', e)
    }
  }, [projects])

  // Save to localStorage on state change
  const persistState = useCallback(() => {
    localStorage.setItem('founderengine_timer', JSON.stringify({
      state: timerData.current.state,
      accumulated: timerData.current.accumulated,
      startTime: timerData.current.startTime,
      projectId,
      goal,
      notes
    }))
  }, [projectId, goal, notes])

  // Sync state changes that don't directly trigget persist (like typing notes)
  useEffect(() => persistState(), [persistState])

  // Tick
  const tick = useCallback(() => {
    if (timerData.current.state === 'running') {
      const current = timerData.current.accumulated + Math.floor((Date.now() - timerData.current.startTime) / 1000)
      setElapsed(current)
    }
  }, [])

  function start() {
    timerData.current.startTime = Date.now()
    timerData.current.state = 'running'
    setState('running')
    persistState()
    intervalRef.current = setInterval(tick, 500)
  }

  function pause() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    timerData.current.accumulated = elapsed
    timerData.current.state = 'paused'
    setState('paused')
    persistState()
  }

  function resume() {
    timerData.current.startTime = Date.now()
    timerData.current.state = 'running'
    setState('running')
    persistState()
    intervalRef.current = setInterval(tick, 500)
  }

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    timerData.current.accumulated = 0
    timerData.current.startTime = 0
    timerData.current.state = 'idle'
    setElapsed(0)
    setState('idle')
    setSaveError('')
    persistState()
  }

  async function stopAndLog() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setState('paused')
    const durationMins = Math.max(1, Math.floor(elapsed / 60))
    if (!projectId) { setSaveError('Please select a project first.'); return }
    setSaving(true)
    setSaveError('')

    const fd = new FormData()
    fd.set('projectId', projectId)
    fd.set('duration', String(durationMins))
    fd.set('notes', notes)

    const res = await logSession(fd)
    setSaving(false)

    if (res?.error) { setSaveError(res.error); setState('paused'); return }

    // Optimistically add to local sessions list
    const proj = projects.find(p => p.id === projectId)
    setSessions(prev => [{
      id: Date.now().toString(),
      duration: durationMins,
      notes: notes || null,
      startTime: new Date(),
      projectName: proj?.name ?? 'Project',
    }, ...prev].slice(0, 10))

    // Reset timer
    timerData.current.accumulated = 0
    timerData.current.startTime = 0
    timerData.current.state = 'idle'
    setElapsed(0)
    setState('idle')
    setNotes('')
    localStorage.removeItem('founderengine_timer')
    router.refresh()   // refresh server data (today totals, analytics)
  }

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const goalSeconds = goal * 60
  const progress = Math.min(elapsed / goalSeconds, 1)
  // SVG circle
  const RADIUS = 46   // % of viewBox
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress)

  const currentTodayMins = todayMinutes + (state !== 'idle' ? Math.floor(elapsed / 60) : 0)

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">

      {/* ──────────── LEFT: Timer + controls ──────────── */}
      <div className="flex flex-col items-center w-full lg:flex-1">

        {/* Project + goal selectors */}
        <div className="w-full max-w-sm grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Project</label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              disabled={state === 'running'}
              className="w-full px-3 py-2.5 text-sm border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-white disabled:opacity-60"
            >
              {projects.length === 0 && <option value="">— Create a project first —</option>}
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Goal (min)</label>
            <select
              value={goal}
              onChange={e => setGoal(Number(e.target.value))}
              disabled={state === 'running'}
              className="w-full px-3 py-2.5 text-sm border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-white disabled:opacity-60"
            >
              {[15, 25, 30, 45, 60, 90, 120].map(g => <option key={g} value={g}>{g} min</option>)}
            </select>
          </div>
        </div>

        {/* Timer ring */}
        <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[360px] lg:h-[360px] flex items-center justify-center">
          {/* Track */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="4" className="text-surface-container"/>
            <circle
              cx="50" cy="50" r={RADIUS} fill="none"
              stroke={progress >= 1 ? '#006c49' : '#3525cd'}
              strokeWidth="4" strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>

          {/* Inner face */}
          <div className="relative z-10 w-[210px] h-[210px] sm:w-[260px] sm:h-[260px] lg:w-[295px] lg:h-[295px] rounded-full bg-white shadow-xl border border-outline-variant/10 flex flex-col items-center justify-center gap-2 sm:gap-3">
            {state === 'idle' && (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Ready</p>
            )}
            {state === 'running' && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-secondary">Recording</p>
              </div>
            )}
            {state === 'paused' && (
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Paused</p>
            )}

            <div className="flex items-baseline leading-none">
              <span className="text-[3.5rem] sm:text-[4.5rem] lg:text-[5rem] font-extrabold text-on-background tracking-tight tabular-nums">{fmt(elapsed)}</span>
            </div>

            <div className="flex gap-5 items-center mt-1">
              <div className="text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Goal</p>
                <p className="text-sm font-bold text-on-surface">{fmt(goalSeconds)}</p>
              </div>
              <div className="w-px h-7 bg-outline-variant/30"></div>
              <div className="text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Today</p>
                <p className="text-sm font-bold text-primary">{currentTodayMins}m</p>
              </div>
              <div className="w-px h-7 bg-outline-variant/30"></div>
              <div className="text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Streak</p>
                <p className="text-sm font-bold text-secondary">{streak}d 🔥</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-8">
          {state === 'idle' && (
            <>
              <button
                onClick={start}
                disabled={!projectId}
                className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full text-sm font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Start Timer
              </button>
            </>
          )}

          {state === 'running' && (
            <>
              <button
                onClick={pause}
                className="w-12 h-12 bg-white border border-outline-variant/25 rounded-full shadow-md flex items-center justify-center hover:bg-surface-container active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface">pause</span>
              </button>
              <button
                onClick={stopAndLog}
                disabled={saving}
                className="flex items-center gap-2 px-7 py-3.5 bg-primary text-white rounded-full text-sm font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60"
              >
                {saving
                  ? <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>Saving…</>
                  : <><span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>Stop & Log</>
                }
              </button>
            </>
          )}

          {state === 'paused' && (
            <>
              <button
                onClick={reset}
                className="w-12 h-12 bg-white border border-outline-variant/25 rounded-full shadow-md flex items-center justify-center hover:bg-error/5 hover:text-error hover:border-error/20 active:scale-95 transition-all text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
              <button
                onClick={resume}
                className="w-12 h-12 bg-white border border-outline-variant/25 rounded-full shadow-md flex items-center justify-center hover:bg-surface-container active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[20px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
              <button
                onClick={stopAndLog}
                disabled={saving || elapsed < 60}
                className="flex items-center gap-2 px-7 py-3.5 bg-primary text-white rounded-full text-sm font-semibold shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving
                  ? <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>Saving…</>
                  : <><span className="material-symbols-outlined text-[16px]">save</span>Log {fmt(elapsed)}</>
                }
              </button>
            </>
          )}
        </div>

        {elapsed < 60 && state === 'paused' && !saving && (
          <p className="text-xs text-on-surface-variant mt-2 text-center">Run for at least 1 minute to log a session.</p>
        )}

        {/* Notes field (only during or after running) */}
        {state !== 'idle' && (
          <div className="mt-5 w-full max-w-sm">
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5 block">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="What are you working on?"
              className="w-full px-4 py-2.5 text-sm border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none bg-white"
            />
          </div>
        )}

        {saveError && (
          <p className="mt-3 text-xs text-error bg-error/10 px-3 py-2 rounded-lg max-w-sm text-center">{saveError}</p>
        )}
      </div>

      {/* ──────────── RIGHT: Session log ──────────── */}
      <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4">

        {/* Insight card */}
        <div className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="relative flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>tips_and_updates</span>
            <p className="text-[10px] font-bold uppercase tracking-widest">Focus Insight</p>
          </div>
          <p className="text-sm text-white/85 leading-relaxed relative">
            Peak output detected <strong className="text-white">9–11:30 AM</strong>. Schedule your hardest tasks in this window for maximum flow state.
          </p>
        </div>

        {/* Today's sessions */}
        <div>
          <h3 className="text-sm font-bold text-on-surface mb-3">Today's Sessions</h3>
          {sessions.length > 0 ? (
            <div className="space-y-2.5">
              {sessions.map((s, i) => (
                <div key={s.id ?? i} className="bg-white rounded-2xl p-4 border border-outline-variant/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[15px]">timer</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-on-surface truncate">{s.projectName}</p>
                      <span className="text-xs font-bold text-secondary shrink-0 bg-secondary/10 px-2 py-0.5 rounded-full">{s.duration}m</span>
                    </div>
                    {s.notes && <p className="text-xs text-on-surface-variant mt-0.5 truncate italic">{s.notes}</p>}
                    <p className="text-[10px] text-outline mt-1">
                      {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-outline-variant/10 text-center">
              <span className="material-symbols-outlined text-3xl text-outline-variant">timer_off</span>
              <p className="text-sm text-on-surface-variant mt-2 font-medium">No sessions yet today.</p>
              <p className="text-xs text-outline mt-1">Start the timer to track your work.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
