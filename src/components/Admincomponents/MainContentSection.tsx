import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { JSX } from 'react'

export default function MainContentSection(): JSX.Element {
  // User profile data
  const userData = {
    name: 'GrocerJet',
    role: 'Admin',
    username: 'Admin',
    phone: '+918437176189',
    email: 'gambit943@gmail.com',
    address: 'Ludhiana, Punjab',
    firstName: 'grocer',
    lastName: 'jet',
    formEmail: 'grocer@gmail.com',
    formPhone: '+918437176189',
    formAddress: 'Ludhiana, Punjab/Ludhiana, Punjab',
  }

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <h1 className="font-medium text-2xl text-[#2b2f4c] mb-2">
          Edit Profile
        </h1>

        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              className="font-medium text-sm text-[#2b2f4c] underline"
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-[#212529bf]" />
          <BreadcrumbItem>
            <BreadcrumbLink className="font-medium text-sm text-[#f55d2c]">
              Edit Profile
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="flex gap-6 mt-6">
        {/* Left profile card */}
        <Card className="w-[400px]">
          <CardContent className="pt-6 flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src="/avatar-placeholder.png" alt="Profile" />
              <AvatarFallback>GJ</AvatarFallback>
            </Avatar>

            <h2 className="text-lg font-medium mb-1">{userData.name}</h2>
            <p className="text-sm text-gray-500 mb-6">{userData.role}</p>

            <div className="w-full grid grid-cols-2 gap-4">
              <div className="text-sm font-medium">Username</div>
              <div className="text-sm text-right">{userData.username}</div>

              <div className="text-sm font-medium">Phone</div>
              <div className="text-sm text-right">{userData.phone}</div>

              <div className="text-sm font-medium">Email</div>
              <div className="text-sm text-right">{userData.email}</div>

              <div className="text-sm font-medium">Address</div>
              <div className="text-sm text-right">{userData.address}</div>
            </div>
          </CardContent>
        </Card>

        {/* Right edit form */}
        <Card className="flex-1">
          <CardContent className="pt-6">
            <h2 className="text-lg font-medium mb-6">Edit Profile</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm">
                  First Name*
                </Label>
                <Input id="firstName" defaultValue={userData.firstName} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm">
                  Last Name*
                </Label>
                <Input id="lastName" defaultValue={userData.lastName} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  Email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={userData.formEmail}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">
                  Phone*
                </Label>
                <Input id="phone" defaultValue={userData.formPhone} />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="address" className="text-sm">
                  Address*
                </Label>
                <Input id="address" defaultValue={userData.formAddress} />
              </div>

              <div className="space-y-2 col-span-2">
                <Label className="text-sm">Profile Image*</Label>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">Choose Image</div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-[#f55d2c] text-white hover:bg-[#f55d2c]/90"
                  >
                    Browse
                  </Button>
                </div>
                <div className="mt-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/avatar-placeholder.png" alt="Profile" />
                    <AvatarFallback>GJ</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-start">
              <Button className="bg-[#f55d2c] text-white hover:bg-[#f55d2c]/90">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
