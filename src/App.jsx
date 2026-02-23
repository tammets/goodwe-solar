import { useAuth } from './context/AuthContext'
import { useLanguage } from './context/LanguageContext'
import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'

export default function App() {
  const { auth, loginLoading } = useAuth()
  const { t } = useLanguage()

  if (loginLoading && !auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-lg">{t('app_connecting')}</div>
      </div>
    )
  }

  return auth.isAuthenticated ? <Dashboard /> : <LoginScreen />
}
