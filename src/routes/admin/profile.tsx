import EditUserForm from '@/components/Admincomponents/EditUser'
import MainContentSection from '@/components/Admincomponents/MainContentSection'
import ProfileCardSection from '@/components/Admincomponents/ProfileCardSection'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-white flex justify-center w-full">
    <div className="bg-white w-full max-w-[1536px] flex flex-row gap-8 py-8">
      {/* Profile Card Section (left) */}
      <div className="flex-shrink-0 w-full max-w-xs">
        <ProfileCardSection />
      </div>
      {/* Edit User Form (right) */}
      <div className="flex-grow">
        <EditUserForm
          initialData={{
            full_name: '',
            email: '',
            phone_number: '',
            profile_url: '',
          }}
        />
      </div>
      {/* <FooterSection /> */}
    </div>
  </div>
  )
}
