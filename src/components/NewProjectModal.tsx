'use client'

import { useState, useRef } from 'react'
import { createProject } from '@/app/actions'

export default function NewProjectModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await createProject(fd)
    setLoading(false)
    if (res?.error) { setError(res.error); return }
    formRef.current?.reset()
    setOpen(false)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 sm:px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5"
      >
        <span className="material-symbols-outlined text-[17px]">add</span>
        <span className="hidden sm:inline">Create New</span>
        <span className="sm:hidden">New</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          {/* Sheet / Dialog */}
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-on-surface">New Project</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5 block">
                  Project Name *
                </label>
                <input
                  name="name"
                  required
                  placeholder="e.g. LeadFlow CRM"
                  className="w-full px-4 py-3 text-sm border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all bg-surface-container-low"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5 block">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="What does this project do?"
                  className="w-full px-4 py-3 text-sm border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all resize-none bg-surface-container-low"
                />
              </div>

              {/* Stage + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Stage</label>
                  <select
                    name="stage"
                    className="w-full px-3 py-3 text-sm border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-surface-container-low"
                  >
                    <option value="idea">Idea</option>
                    <option value="mvp">MVP</option>
                    <option value="growth">Growth</option>
                    <option value="scale">Scale</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5 block">Priority</label>
                  <select
                    name="priority"
                    className="w-full px-3 py-3 text-sm border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-surface-container-low"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {error && (
                <p className="text-xs text-error bg-error/10 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-3.5 bg-primary text-white rounded-xl text-sm font-semibold shadow shadow-primary/25 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>Creating…</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]">add</span>Create Project</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
