import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react'
import { languages, defaultLanguage } from '../i18n'

const STORAGE_KEY = 'goodwe-solar-language'
const LanguageContext = createContext(null)

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && languages[saved]) return saved
  } catch {}
  return defaultLanguage
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage)

  const setLanguage = useCallback((lang) => {
    if (languages[lang]) {
      setLanguageState(lang)
      localStorage.setItem(STORAGE_KEY, lang)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const t = useCallback((key) => {
    return languages[language].translations[key] || languages[defaultLanguage].translations[key] || key
  }, [language])

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
  }), [language, setLanguage, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
