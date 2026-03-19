'use client'

import { useState, useRef } from 'react'
import { importProjectsFromCSV } from '@/app/actions'

export default function ImportCSVModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fileName, setFileName] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    
    const fd = new FormData(e.currentTarget)
    const res = await importProjectsFromCSV(fd)
    
    setLoading(false)
    if (res?.error) { 
      setError(res.error)
      return 
    }
    
    setSuccess(`Successfully imported ${res.count} projects!`)
    formRef.current?.reset()
    setFileName('')
    setTimeout(() => {
      setOpen(false)
      setSuccess('')
    }, 2000)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold hover:bg-outline-variant/30 transition-colors shadow-sm border border-outline-variant/20 flex items-center gap-2 text-sm"
      >
        <span className="material-symbols-outlined text-[17px]">upload_file</span>
        <span className="hidden sm:inline">Import CSV</span>
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
              <h2 className="text-lg font-bold text-on-surface">Import Projects from CSV</h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              Upload a comma-separated values (.csv) file with your projects.
              Expected columns: <strong className="text-on-surface">Project Name, Role, Core Function & Innovation, Status/Target</strong>.
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="relative group">
                <input
                  type="file"
                  name="file"
                  accept=".csv"
                  required
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className={`w-full flex flex-col items-center justify-center px-4 py-8 border-2 dashed rounded-xl transition-all ${fileName ? 'bg-primary/5 border-primary/40' : 'bg-surface-container-low border-outline-variant/40 border-dashed group-hover:bg-primary/5 group-hover:border-primary/30'}`}>
                  <span className={`material-symbols-outlined text-4xl mb-2 transition-colors ${fileName ? 'text-primary' : 'text-outline group-hover:text-primary'}`}>
                    {fileName ? 'description' : 'cloud_upload'}
                  </span>
                  <p className="text-sm font-semibold text-on-surface text-center px-2 truncate w-full">
                    {fileName || 'Click or drag CSV here'}
                  </p>
                  {!fileName && <p className="text-xs text-on-surface-variant mt-1">.csv files only</p>}
                </div>
              </div>

              {error && (
                <p className="text-xs text-error bg-error/10 px-3 py-2 rounded-lg">{error}</p>
              )}
              {success && (
                <p className="text-xs text-secondary bg-secondary/10 px-3 py-2 rounded-lg">{success}</p>
              )}

              <button
                type="submit"
                disabled={loading || !!success}
                className="mt-2 w-full py-3.5 bg-primary text-white rounded-xl text-sm font-semibold shadow shadow-primary/25 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>Importing…</>
                ) : success ? (
                  <><span className="material-symbols-outlined text-[16px]">check_circle</span>Done</>
                ) : (
                  <><span className="material-symbols-outlined text-[16px]">upload</span>Start Import</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
