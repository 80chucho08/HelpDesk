import React, { useState, useEffect } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app_theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Synchronize theme with HTML class
  useEffect(() => {
    localStorage.setItem('app_theme', theme)
    const rootElement = document.documentElement
    if (theme === 'dark') {
      rootElement.classList.add('dark')
    } else {
      rootElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center p-6 transition-colors duration-200 font-sans">
      
      {/* Theme Toggler in top right */}
      <div className="absolute top-6 right-6">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-3.364l-.707.707M6.343 17.657l-.707.707m2.828 0l.707-.707M17.657 6.343l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main card */}
      <main className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-100 dark:shadow-none flex flex-col gap-8 text-center animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="mx-auto w-16 h-16 bg-violet-600 text-white font-extrabold text-2xl flex items-center justify-center rounded-2xl shadow-lg shadow-violet-600/20">
            R
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            React + Tailwind CSS v4
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
            Your clean development starter workspace is ready. Modify this template to build your application.
          </p>
        </div>

        {/* Counter Widget */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl flex flex-col items-center gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Interactive State Test
          </p>
          <div className="text-4xl font-black text-violet-600 dark:text-violet-400">
            {count}
          </div>
          <button 
            onClick={() => setCount(count + 1)}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-violet-600/10 cursor-pointer"
          >
            Increment Count
          </button>
        </div>

        {/* Quick Instructions list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 border border-slate-100 dark:border-slate-800/60 rounded-xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">✏️ Customize UI</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Edit <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-violet-600">src/App.jsx</code> to add components and structure.
            </p>
          </div>

          <div className="p-4 border border-slate-100 dark:border-slate-800/60 rounded-xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">🎨 Configure Styles</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Define custom theme configurations directly in <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-violet-600">src/index.css</code>.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-8 text-xs text-slate-400">
        Vite Dev Server active • HMR enabled
      </footer>

    </div>
  )
}

export default App
