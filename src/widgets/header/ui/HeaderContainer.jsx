import { Flex, Image, Text } from '@chakra-ui/react'
import Link from 'next/link'
import logo from '../../../../public/images/main-icon.png'

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
      <Text fontSize={12} fontWeight="bold">
        <Link href="/">
          <Image src={logo.src} alt="CRM Logo" width="150px" objectFit="contain" />
        </Link>
      </Text>
      {children}
    </Flex>
  )
}
