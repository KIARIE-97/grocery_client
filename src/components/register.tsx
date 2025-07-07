import { RegisterUser } from '@/api/auth'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useRegisterUser } from '@/hooks/useLogin'
import { useForm } from '@tanstack/react-form'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import z from 'zod'

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Enter a valid phone number'),
//   code: z.string().min(4, 'Code is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type SignUpData = z.infer<typeof formSchema>

const validateField = <T,>(value: T, schema: z.ZodType<T>) => {
  const result = schema.safeParse(value)
  if (!result.success) {
    return result.error.issues[0]?.message || 'Validation error'
  }
  return undefined}

function SignUp() {
      const navigate = useNavigate()
      const registerMutation = useRegisterUser()

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      code: '',
      password: '',
    } as SignUpData,
    onSubmit: async ({ value }) => {
      const result = formSchema.safeParse(value)
      console.log('Form submission data:', result)
      if (!result.success) {
        console.error('Validation failed:', result.error.issues)
        return
      }
      try{
        const res = await registerMutation.mutateAsync({
          email: result.data.email,
          password: result.data.password,
          full_name: result.data.fullName,
          phone_number: result.data.phone,
        })
        console.log('Signup response:', res)
        toast.success('Signup successful! Please log in.')
        form.reset()
        navigate({ to: '/auth/login' }) 

      }
      catch (error) {
        console.error('Signup failed:', error)
        let errorMessage = 'Signup failed. Please try again.'
        if (error instanceof Error) {
          errorMessage = error.message
        }
        if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('already exists')) {
          toast.error('Email already exists. Please use a different email.');
        } else if (errorMessage.toLowerCase().includes('network') || errorMessage.toLowerCase().includes('fetch')) {
          toast.error('Network error. Please check your internet connection and try again.');
        } else {
          toast.error(errorMessage);
        }
      } 
    },
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[420px] bg-white shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-bold text-gray-800">
            Sign Up
          </CardTitle>
          <CardDescription></CardDescription>
          <CardAction />
        </CardHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <CardContent className="flex flex-col gap-5">
            {/* Full Name */}
            <form.Field
              name="fullName"
              validators={{
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.fullName),
              }}
              children={(field) => (
                <div>
                  <Input
                    placeholder="Full name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-sm text-red-500 mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Email */}
            <form.Field
              name="email"
              validators={{
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.email),
              }}
              children={(field) => (
                <div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-sm text-red-500 mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Phone */}
            <form.Field
              name="phone"
              validators={{
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.phone),
              }}
              children={(field) => (
                <div>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-sm text-red-500 mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Code Input */}
            {/* <form.Field
              name="code"
              validators={{
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.code),
              }}
              children={(field) => (
                <div>
                  <Label>Enter Code</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      maxLength={4}
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
                  <p className="text-xs text-gray-500 mt-1">Resend Code</p>
                  {field.state.meta.errors[0] && (
                    <p className="text-sm text-red-500 mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            /> */}

            {/* Password */}
            <form.Field
              name="password"
              validators={{
                onBlur: ({ value }) =>
                  validateField(value, formSchema.shape.password),
              }}
              children={(field) => (
                <div>
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-sm text-red-500 mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-2 mt-8 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Signing up...' : 'Sign Up Now'}
                </button>
              )}
            />
            <p className="text-sm">
              I have an account?{' '}
              <Link
                to="/auth/login"
                className="text-blue-700 font-medium hover:underline"
              >
                Sign In Now
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default SignUp
