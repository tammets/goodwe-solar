import { useAuth } from './context/AuthContext'
import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'

export default function App() {
  const { auth, loginLoading } = useAuth()

  if (loginLoading && !auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-lg">Connecting to SEMS Portal...</div>
      </div>
    )
  }

  return auth.isAuthenticated ? <Dashboard /> : <LoginScreen />
}
