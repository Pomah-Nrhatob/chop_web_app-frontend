import { Header } from '@/widgets/header'
import { SidebarNav } from '@/widgets/sideBar'
import { Box } from '@chakra-ui/react'

import { createMetadata } from '@/lib/seo/createMetadata'

const SIDEBAR_COLLAPSED_WIDTH = '50px'

export const metadata = createMetadata({
  title: 'Uchop | Личный кабинет',
  description: 'Личный кабинет Uchop для управления компанией, сотрудниками и графиками работы.',
  pathname: '/bc',
  noIndex: true,
})

export default function Layout({ children }) {
  return (
    <>
      <Header />

      <SidebarNav collapsedWidth={SIDEBAR_COLLAPSED_WIDTH} />

      <Box ml={{ base: 0, md: SIDEBAR_COLLAPSED_WIDTH }}>{children}</Box>
    </>
  )
}
