import { motion } from 'framer-motion'
import { Edit2, User, Phone, Mail, MapPin } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/UseAuth'
import EditUserForm from './EditUser'

const iconMap = {
  Username: <User className="w-4 h-4 mr-2" />,
  Phone: <Phone className="w-4 h-4 mr-2" />,
  Email: <Mail className="w-4 h-4 mr-2" />,
  Address: <MapPin className="w-4 h-4 mr-2" />,
}

export default function ProfileCardSection() {
  const { user } = useAuth()
  const [isEditOpen, setIsEditOpen] = useState(false)

  if (!user) return null

  // Format user data for display
  const profileData = {
    name: user.full_name,
    role: formatRole(user.role),
    details: [
      { label: 'Username', value: user.full_name },
      { label: 'Phone', value: user.phone_number || 'Not provided' },
      { label: 'Email', value: user.email },
      { label: 'Address', value: 'nairobi, kenya' }, 
    ],
  }

  function formatRole(role: string) {
    return role
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-[405px] border-[0.8px] border-[#efefef] rounded-md relative">
          <CardContent className="p-5 pt-6 flex flex-col items-center">
            {/* Edit Button */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
                  aria-label="Edit profile"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <EditUserForm
                  initialData={{
                    full_name: user.full_name,
                    email: user.email,
                    phone_number: user.phone_number || '',
                    profile_url: user.profile_url || '',
                  }}
                  onSuccess={() => setIsEditOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <motion.div
              className="flex flex-col items-center mb-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Avatar className="w-[88px] h-[88px] mb-4">
                <AvatarImage
                  src={
                    user.profile_url ||
                    'https://static.vecteezy.com/system/resources/previews/014/277/912/original/trendy-stylish-girl-vector.jpg'
                  }
                  alt="Profile"
                />
                <AvatarFallback className="bg-[#f9f9f9] border-[0.8px] border-[#efefef]">
                  {user.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>

              <motion.h2
                className="font-['Roboto-SemiBold',Helvetica] font-semibold text-[#2b2f4c] text-xl leading-[30px]"
                whileHover={{ scale: 1.05 }}
              >
                {profileData.name}
              </motion.h2>

              <span className="font-['Roboto-Regular',Helvetica] font-normal text-[#3e3f5e] text-sm leading-[21px]">
                {profileData.role}
              </span>
            </motion.div>

            <motion.div
              className="w-full border-[0.8px] border-[#efefef] rounded-[3px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {profileData.details.map((detail, index) => (
                <motion.div
                  key={detail.label}
                  className="w-full"
                  whileHover={{ backgroundColor: '#f9f9f9' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between py-[9px] px-2.5">
                    <span className="font-['Roboto-Medium',Helvetica] font-medium text-[#2b2f4c] text-sm leading-[21px] flex items-center">
                      {iconMap[detail.label as keyof typeof iconMap]}
                      {detail.label}
                    </span>
                    <span className="font-['Roboto-Regular',Helvetica] font-normal text-[#3e3f5e] text-sm leading-[21px]">
                      {detail.value}
                    </span>
                  </div>
                  {index < profileData.details.length - 1 && (
                    <Separator className="border-[#efefef] border-b-[0.8px]" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
