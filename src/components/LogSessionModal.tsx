'use client'

import { useState, useEffect, useRef } from 'react'
import { logSession } from '@/app/actions'

interface Project { id: string; name: string }

export default function LogSessionModal({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)       // seconds
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // Live stopwatch
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  async function handleLog(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    if (elapsed < 60 && !running) {
      setError('Please run the timer for at least 1 minute first, or enter manual duration.')
      return
    }
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    // Use elapsed time if timer was used, else use manual input
    if (elapsed > 0) {
      fd.set('duration', String(Math.max(1, Math.floor(elapsed / 60))))
    }
    const res = await logSession(fd)
    setLoading(false)
    if (res?.error) { setError(res.error); return }
    setRunning(false)
    setElapsed(0)
    setSuccess(true)
    formRef.current?.reset()
    setTimeout(() => { setSuccess(false); setOpen(false) }, 1500)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 sm:px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
      >
        <span className="material-symbols-outlined text-[17px]">timer</span>
        <span>Log Session</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => { if (e.target === e.currentTarget) { setRunning(false); setOpen(false) } }}
        >
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-on-surface">Log Work Session</h2>
              <button onClick={() => { setRunning(false); setOpen(false) }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Live timer display */}
            <div className="bg-surface-container-low rounded-2xl p-5 mb-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Elapsed Time</p>
              <p className="text-5xl font-extrabold tracking-tight text-on-surface tabular-nums">{fmt(elapsed)}</p>
              <div className="flex gap-3 justify-center mt-4">
                {!running ? (
                  <button
                    type="button"
                    onClick={() => setRunning(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-95 transition-all shadow shadow-primary/25"
                  >
                    <span className="material-symbols-outlined text-[17px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    {elapsed > 0 ? 'Resume' : 'Start'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setRunning(false)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-surface-container text-on-surface rounded-full text-sm font-semibold hover:bg-surface-container-high active:scale-95 transition-all border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-[17px]">pause</span>Pause
                  </button>
                )}
                {elapsed > 0 && (
                  <button
                    type="button"
                    onClick={() => { setRunning(false); setElapsed(0) }}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  </button>
                )}
              </div>
            </div>

            <form ref={formRef} onSubmit={handleLog} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Project *</label>
                <select
                  name="projectId"
                  required
                  className="w-full px-3 py-3 text-sm border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-surface-container-low"
                >
                  <option value="">Select a project…</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              {/* Manual duration only shown if timer wasn't used */}
              {elapsed === 0 && (
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Duration (minutes) *</label>
                  <input
                    name="duration"
                    type="number"
                    min="1"
                    max="480"
                    required
                    placeholder="e.g. 45"
                    className="w-full px-4 py-3 text-sm border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-surface-container-low"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="What did you work on?"
                  className="w-full px-4 py-3 text-sm border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none bg-surface-container-low"
                />
              </div>

              {error && <p className="text-xs text-error bg-error/10 px-3 py-2 rounded-lg">{error}</p>}

              <button
                type="submit"
                disabled={loading || success}
                className={`mt-1 w-full py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  success
                    ? 'bg-secondary text-white'
                    : 'bg-primary text-white shadow shadow-primary/25 hover:scale-[1.01] active:scale-95 disabled:opacity-60'
                }`}
              >
                {success ? (
                  <><span className="material-symbols-outlined text-[16px]">check_circle</span>Session Logged!</>
                ) : loading ? (
                  <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>Saving…</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]">save</span>
                  {elapsed > 0 ? `Log ${fmt(elapsed)} Session` : 'Log Session'}</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
