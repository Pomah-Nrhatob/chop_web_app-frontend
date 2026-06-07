import { Flex, Image } from '@chakra-ui/react'
import Link from 'next/link'
import logo from '../../../../public/images/main-icon.png'
import mobileLogo from '../../../../public/images/main-icon_mobile.png'

export default function HeaderContainer({ children }) {
  return (
    <Flex
      as="header"
      px={{ base: 6, md: 10 }}
      py={4}
      borderBottom="1px solid"
      borderColor="gray.200"
      justify="space-between"
      alignItems="center"
    >
      <Link href="/">
        <>
          <Image
            display={{ base: 'block', md: 'none' }}
            src={mobileLogo.src}
            alt="CRM Logo"
            w="45px"
          />

          <Image display={{ base: 'none', md: 'block' }} src={logo.src} alt="CRM Logo" w="150px" />
        </>
      </Link>
      {children}
    </Flex>
  )
}
