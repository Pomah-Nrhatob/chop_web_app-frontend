import { useUser } from '@/features/users/api/use-user'
import { Button, Card, Center, Heading, Spinner, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import { FaBuilding } from 'react-icons/fa'

export const NoActiveCompany = ({ children }) => {
  const { user, isLoading } = useUser()

  if (isLoading)
    return (
      <Center minH="60vh">
        <Spinner size="xl" />
      </Center>
    )

  return (
    <>
      {user?.activeCompanyId ? (
        children
      ) : (
        <Card.Root
          maxW="600px"
          mx="auto"
          mt={10}
          borderWidth="1px"
          borderColor="orange.200"
          bg="orange.50"
        >
          <Card.Body py={10}>
            <VStack gap={5} textAlign="center">
              <FaBuilding size={40} color="#DD6B20" />

              <Heading size="md">Нет активной компании</Heading>

              <Text color="gray.600">
                У вас нет активной компании. Выберите существующую компанию или создайте новую в
                разделе <b>«Компании»</b>.
              </Text>

              <Link href="/company">
                <Button colorScheme="orange">Перейти в раздел «Компании»</Button>
              </Link>
            </VStack>
          </Card.Body>
        </Card.Root>
      )}
    </>
  )
}
