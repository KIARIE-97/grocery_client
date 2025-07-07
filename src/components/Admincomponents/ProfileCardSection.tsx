import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { JSX } from 'react'


export default function ProfileCardSection(): JSX.Element {
  // Profile data
  const profileData = {
    name: 'GrocerJet',
    role: 'Admin',
    details: [
      { label: 'Username', value: 'Admin' },
      { label: 'Phone', value: '+918437176189' },
      { label: 'Email', value: 'gambol943@gmail.com' },
      { label: 'Address', value: 'Ludhiana, Punjab' },
    ],
  }

  return (
    <Card className="w-full max-w-[405px] border-[0.8px] border-[#efefef] rounded-md">
      <CardContent className="p-5 pt-6 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-[88px] h-[88px] mb-4">
            <AvatarImage src="/image.png" alt="Profile" />
            <AvatarFallback className="bg-[#f9f9f9] border-[0.8px] border-[#efefef]">
              GJ
            </AvatarFallback>
          </Avatar>

          <h2 className="font-['Roboto-SemiBold',Helvetica] font-semibold text-[#2b2f4c] text-xl leading-[30px]">
            {profileData.name}
          </h2>

          <span className="font-['Roboto-Regular',Helvetica] font-normal text-[#3e3f5e] text-sm leading-[21px]">
            {profileData.role}
          </span>
        </div>

        <div className="w-full border-[0.8px] border-[#efefef] rounded-[3px]">
          {profileData.details.map((detail, index) => (
            <div key={detail.label} className="w-full">
              <div className="flex justify-between py-[9px] px-2.5">
                <span className="font-['Roboto-Medium',Helvetica] font-medium text-[#2b2f4c] text-sm leading-[21px]">
                  {detail.label}
                </span>
                <span className="font-['Roboto-Regular',Helvetica] font-normal text-[#3e3f5e] text-sm leading-[21px]">
                  {detail.value}
                </span>
              </div>
              {index < profileData.details.length - 1 && (
                <Separator className="border-[#efefef] border-b-[0.8px]" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
