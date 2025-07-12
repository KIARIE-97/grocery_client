import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import z from 'zod'
import { useForm } from '@tanstack/react-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLoginUser } from '@/hooks/useLogin'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

// Zod schema for form validation
const formSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string().min(4, 'Password must be at least 8 characters'),
    otp: z.string().min(2, 'Code is required'),
})
export type FormData = z.infer<typeof formSchema>

// Helper function to validate with Zod
const validateField = <T,>(value: T, schema: z.ZodType<T>) => {
  const result = schema.safeParse(value)
  if (!result.success) {
    return result.error.issues[0]?.message || 'Validation error'
  }
  return undefined
}

function Login() {
  const navigate = useNavigate()
   const loginUser = useLoginUser()
  //  const foundUser = useStore(authStore, (state) => state.user)
  const form = useForm({
    defaultValues: {
      email: '',
      otp: '',
      password: '',
    } as FormData,
    onSubmit: async ({ value }) => {
      // Final validation before submission
      const result = formSchema.safeParse(value)
      if (!result.success) {
        console.error('Validation failed:', result.error.issues)
        return
      }

      try {
        const res = await loginUser.mutateAsync(result.data)
        toast.success('Login successful!')
        console.log('Login response:', res)
        if (res?.founduser.role === 'admin') {
          navigate({ to: '/admin' })
          form.reset()
        } else if (res?.founduser.role === 'customer') {
          navigate({ to: '/' })
        } else if (res?.founduser.role  === 'store_owner') {
          navigate({ to: '/store_owner' })
        } else if (res?.founduser.role  === 'driver') {
          navigate({ to: '/driver' })
        } else {
          navigate({ to: '/' })
        }
        form.reset()
      } catch (error) {
        // Show specific error message from the server
        let errorMessage = 'Login failed. Please try again.'

        if (error instanceof Error) {
          errorMessage = error.message
        }
        if (
          errorMessage.toLowerCase().includes('not found') ||
          errorMessage.toLowerCase().includes('no account found')
        ) {
          toast.error(
            'Account not found. Please check your email or create a new account.',
          )
        } else if (
          errorMessage.toLowerCase().includes('invalid') ||
          errorMessage.toLowerCase().includes('password')
        ) {
          toast.error(
            'Invalid credentials. Please check your email and password.',
          )
        } else if (
          errorMessage.toLowerCase().includes('network') ||
          errorMessage.toLowerCase().includes('fetch')
        ) {
          toast.error(
            'Network error. Please check your internet connection and try again.',
          )
        } else {
          toast.error(errorMessage)
        }
      }

      // console.log('Form submitted successfully:', value)
    },
  })



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-lg ">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to sign in</CardDescription>
          <CardAction />
        </CardHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <CardContent>
            <div className="flex flex-col gap-6">
              <label className="block mb-1 font-medium">Email</label>
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) =>
                    validateField(value, formSchema.shape.email),
                  onBlur: ({ value }) =>
                    validateField(value, formSchema.shape.email),
                }}
                children={(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="name@mail.com"
                      required
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              />

              <label className="block mb-1 font-medium"></label>
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) =>
                    validateField(value, formSchema.shape.password),
                  onBlur: ({ value }) =>
                    validateField(value, formSchema.shape.password),
                }}
                children={(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="password"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-sm text-red-600">
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* otp Input */}
              <form.Field
              name="otp"
              validators={{
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.otp),
              }}
              children={(field) => (
                <div>
                  <Label>Enter code</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      maxLength={8}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="w-24"
                    />
                    <button
                      type="button"
                      className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600"
                    >
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Resend otp</p>
                  {field.state.meta.errors[0] && (
                    <p className="text-sm text-red-500 mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />
            </div>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || loginUser.isPending}
                  className="w-full bg-orange-300 rounded-lg mt-10 text-white hover:bg-orage-500 disabled:opacity-50"
                >
                  {isSubmitting || loginUser.isPending
                    ? 'Logging in...'
                    : 'Login'}
                </button>
              )}
            />

            {loginUser.isError && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {loginUser.error?.message ||
                    'Login failed. Please try again.'}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center">
            <p>Don't have an account?</p>
            <div className="text-blue-600 hover:underline">
              <Link to="/auth/register"> Sign up now</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login
