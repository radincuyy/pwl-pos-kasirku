import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LoginForm } from "@/components/ui/login-form"
import { useAppDispatch, useAppSelector } from "@/store"
import { clearError, loginUser } from "@/store/authSlice"
import type { LoginPayload } from "@/api/authService"

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { token, loading, error } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      navigate("/", { replace: true })
    }
  }, [token, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleLogin = (payload: LoginPayload) => {
    dispatch(loginUser(payload))
  }

  const handleClearError = () => {
    dispatch(clearError())
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
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
