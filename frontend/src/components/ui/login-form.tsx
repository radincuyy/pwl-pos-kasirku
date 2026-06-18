import { useState, type ComponentProps, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { LoginPayload } from "@/api/authService"

type FormErrors = {
  email?: string
  password?: string
}

type LoginFormProps = ComponentProps<"div"> & {
  loading: boolean
  serverError: string | null
  onClearError: () => void
  onLogin: (payload: LoginPayload) => void
}

function validateLoginForm(email: string, password: string): FormErrors {
  const errors: FormErrors = {}
  const emailPattern = /^\S+@\S+\.\S+$/

  if (!email) {
    errors.email = "Email wajib diisi"
  } else if (!emailPattern.test(email)) {
    errors.email = "Format email tidak valid"
  }

  if (!password) {
    errors.password = "Password wajib diisi"
  } else if (password.length < 6) {
    errors.password = "Password minimal 6 karakter"
  }

  return errors
}

export function LoginForm({
  className,
  loading,
  serverError,
  onClearError,
  onLogin,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateLoginForm(email, password)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onLogin({ email, password })
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (errors.email) {
      setErrors((currentErrors) => ({ ...currentErrors, email: undefined }))
    }
    if (serverError) {
      onClearError()
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (errors.password) {
      setErrors((currentErrors) => ({ ...currentErrors, password: undefined }))
    }
    if (serverError) {
      onClearError()
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to KasirKu
                </p>
              </div>

              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => handleEmailChange(event.target.value)}
                  placeholder="me@example.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && <FieldError id="email-error">{errors.email}</FieldError>}
              </Field>

              <Field data-invalid={Boolean(errors.password)}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => handlePasswordChange(event.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                {errors.password && <FieldError id="password-error">{errors.password}</FieldError>}
              </Field>

              {serverError && <FieldError>{serverError}</FieldError>}

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Loading..." : "Login"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="#signup">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="https://bagisto.com/wp-content/uploads/2025/09/point-of-sale-software.webp"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
