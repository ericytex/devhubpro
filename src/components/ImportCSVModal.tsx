'use client'
import { useState, useRef, useCallback } from 'react'
import { importProjectsFromCSV } from '@/app/actions'

export default function ImportCSVModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fileName, setFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function closeModal() {
    if (loading) return
    setOpen(false)
    setError('')
    setSuccess('')
    setFileName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleFileChange(file: File | null | undefined) {
    if (!file) return
    if (!file.name.endsWith('.csv')) {
      setError('Please select a .csv file.')
      return
    }
    setError('')
    setFileName(file.name)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (fileInputRef.current && file) {
      const dt = new DataTransfer()
      dt.items.add(file)
      fileInputRef.current.files = dt.files
    }
    handleFileChange(file)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!fileInputRef.current?.files?.[0]) {
      setError('Please select a CSV file first.')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    const fd = new FormData()
    fd.set('file', fileInputRef.current.files[0])

    const res = await importProjectsFromCSV(fd)
    setLoading(false)

    if (res?.error) {
      setError(res.error)
      return
    }

    setSuccess(`${res.count} project${res.count !== 1 ? 's' : ''} imported successfully.`)
    setTimeout(() => closeModal(), 2000)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-semibold hover:bg-outline-variant/30 transition-colors shadow-sm border border-outline-variant/20 flex items-center gap-2 text-sm"
      >
        <span className="material-symbols-outlined text-[17px]">upload_file</span>
        <span className="hidden sm:inline">Import CSV</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          {/* isolate breaks the fixed stacking context so the absolute input is positioned correctly */}
          <div className="isolate bg-white dark:bg-neutral-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[18px]">upload_file</span>
                </div>
                <h2 className="text-base font-bold text-on-surface">Import CSV</h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

              {/* Drop zone — isolation: isolate guarantees the absolute input is scoped here */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ isolation: 'isolate' }}
                className={`relative rounded-xl border-2 transition-all duration-200 ${isDragging
                  ? 'border-primary bg-primary/8 scale-[1.01]'
                  : fileName
                    ? 'border-primary/50 bg-primary/5 border-solid'
                    : 'border-outline-variant/40 border-dashed bg-surface-container-low hover:border-primary/40 hover:bg-primary/3'
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 10,
                    display: 'block',
                  }}
                />

                <div className="pointer-events-none flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
                  {fileName ? (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[22px]">description</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface truncate max-w-[240px]">{fileName}</p>
                        <p className="text-xs text-primary mt-0.5">Ready to import · click to change</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isDragging ? 'bg-primary/20' : 'bg-surface-container'}`}>
                        <span className={`material-symbols-outlined text-[22px] transition-colors ${isDragging ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {isDragging ? 'file_download' : 'cloud_upload'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">
                          {isDragging ? 'Drop it here' : 'Click to browse or drag & drop'}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">.csv files only</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Expected columns hint */}
              <div className="flex gap-2 rounded-lg bg-surface-container px-3 py-2.5">
                <span className="material-symbols-outlined text-on-surface-variant text-[16px] mt-0.5 shrink-0">info</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Expected columns:{' '}
                  <span className="font-medium text-on-surface">Project Name, Role, Core Function & Innovation, Status/Target</span>
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-error/8 border border-error/20 px-3 py-2.5">
                  <span className="material-symbols-outlined text-error text-[16px] mt-0.5 shrink-0">error</span>
                  <p className="text-xs text-error leading-relaxed">{error}</p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-2 rounded-lg bg-secondary/8 border border-secondary/20 px-3 py-2.5">
                  <span className="material-symbols-outlined text-secondary text-[16px] shrink-0">check_circle</span>
                  <p className="text-xs text-secondary">{success}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl border border-outline-variant/40 text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !!success || !fileName}
                  className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-semibold shadow shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                      Importing…
                    </>
                  ) : success ? (
                    <>
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Done
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      Import
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  )
}