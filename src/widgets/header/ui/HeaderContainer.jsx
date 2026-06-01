import { Flex, Image, Text, useBreakpointValue } from '@chakra-ui/react'
import Link from 'next/link'
import logo from '../../../../public/images/main-icon.png'
import mobileLogo from '../../../../public/images/main-icon_mobile.png'

export default function HeaderContainer({ children }) {
  const logoSrc = useBreakpointValue({
    base: mobileLogo.src,
    md: logo.src,
  })

  const srcToUse = logoSrc || mobileLogo.src

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
        <Image
          src={srcToUse}
          alt="CRM Logo"
          width={{ base: '45px', md: '150px' }}
          objectFit="contain"
        />
      </Link>
      {children}
    </Flex>
  )
}
