import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  LoginForm,
  type LoginCredentials,
} from "@/components/organisms/auth/LoginForm"
import { useAppDispatch, useAppSelector } from "@/store"
import { clearError, loginUser } from "@/store/authSlice"
import { getDefaultRoute } from "@/lib/access-control"
import { ModeToggle } from "@/components/molecules/theme/ModeToggle"

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { token, user, loading, error } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (token && user) {
      navigate(getDefaultRoute(user.role), { replace: true })
    }
  }, [token, user, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleLogin = (payload: LoginCredentials) => {
    dispatch(loginUser(payload))
  }

  const handleClearError = () => {
    dispatch(clearError())
  }

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <ModeToggle />
      </div>
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm
          loading={loading}
          serverError={error}
          onClearError={handleClearError}
          onLogin={handleLogin}
        />
      </div>
    </main>
  )
}
