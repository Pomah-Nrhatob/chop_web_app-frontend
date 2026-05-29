import { Flex, Spinner } from '@chakra-ui/react'

export default function Loading() {
  return (
    <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center" bg="rgba(0, 0, 0, 0.1)">
      <Spinner size="xl" color="blue.500" />
    </Flex>
  )
}
