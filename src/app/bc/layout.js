import { CrmHeader } from '@/widgets/header'
import { SidebarNav } from '@/widgets/sideBar'
import { Box } from '@chakra-ui/react'

const SIDEBAR_COLLAPSED_WIDTH = '50px'

export default function layout({ children }) {
  return (
    <div>
      <CrmHeader />
      <SidebarNav collapsedWidth={SIDEBAR_COLLAPSED_WIDTH} />
      <Box ml={{ base: 0, md: SIDEBAR_COLLAPSED_WIDTH }}>{children}</Box>
    </div>
  )
}
