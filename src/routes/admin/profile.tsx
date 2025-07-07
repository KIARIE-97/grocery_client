import MainContentSection from '@/components/Admincomponents/MainContentSection'
import ProfileCardSection from '@/components/Admincomponents/ProfileCardSection'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1536px]">
        <div className="relative flex flex-col min-h-screen">
          {/* <TopNavSection /> */}

          <div className="flex flex-row bg-[#f7f7f7] flex-1">
            {/* <SideNavSection /> */}

            <div className="flex-1 flex flex-col">
              {/* <MainContentSection /> */}

                  <div className="flex-shrink-0">
                    <ProfileCardSection />
                  </div>

              {/* <FooterSection /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
