// components/forms/AddShopForm.tsx
'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from '@tanstack/react-form'
// import { z } from 'zod'
import { useCreateStore } from '@/hooks/useStore'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/UseAuth'
import { toast } from 'sonner'

// const schema = z.object({
//   name: z.string().min(2),
//   location: z.string().min(2),
// })

export function AddShopForm() {
  const { mutate: createStore, isPending } = useCreateStore()
    const navigate = useNavigate()
    const { user } = useAuth() // Get the current user


  const form = useForm({
    defaultValues: {
      name: '',
      location: '',
      image: ''
      // user: user?.id ?? undefined
    },
    onSubmit: async ({ value }) => {
      if (!user) {
        alert('User not authenticated. Please log in.');
        return;
      }
      try {
        const data = createStore({
          store_name: value.name,
          location: value.location,
          shop_image: value.image,
          is_verified: false,
          user: Number(user.id),
        })
    
        console.log('Store created successfully:', data);
        toast.success('Store created successfully!');
        navigate({ to: '/admin/stores' });
      } catch (error) {
        console.error('Failed to create store:', error);
        alert('Failed to create store. Please try again.');
      }
    },
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add Shop</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit}>
        <CardContent className="space-y-4">
          <form.Field name="name">
            {(field) => (
              <Input
                placeholder="Shop name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>

          <form.Field name="location">
            {(field) => (
              <Input
                placeholder="Location"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
         {/* <form.Field name="user">
         {(field) => (
              <Input
                placeholder="user"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
         )}
          </form.Field>   */}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
