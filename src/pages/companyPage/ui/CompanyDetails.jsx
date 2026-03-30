import AddUserToCompany from '@/pages/companyPage/ui/AddUserToCompany'
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  IconButton,
  Avatar,
  Menu,
} from '@chakra-ui/react'

import { FiTrash2, FiEdit2, FiMoreVertical, FiUser } from 'react-icons/fi'

const CompanyDetails = ({ companyData, currentUserId }) => {
  const { name, createdAt, users = [] } = companyData || {}

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} boxShadow="md">
      <VStack align="start" spacing={4} w="100%">
        {/* Информация о компании */}
        <Box w="100%">
          <HStack justify="space-between" w="100%">
            <Heading size="md">{name || 'Название не указано'}</Heading>
            <Badge colorScheme="green">Активна</Badge>
          </HStack>
          {createdAt && (
            <Text color="gray.500" fontSize="sm">
              Создана: {new Date(createdAt).toLocaleDateString()}
            </Text>
          )}
        </Box>

        <Box width="100%" borderBottomWidth="1px" borderBottomColor="gray.200" my={2} />

        {/* Список сотрудников */}
        <VStack align="start" w="100%" spacing={3}>
          <Heading size="sm">Сотрудники:</Heading>
          {users && Array.isArray(users) && users.length > 0 ? (
            users.map((member) => {
              const isCurrentUser = member.user?.id === currentUserId
              return (
                <HStack
                  _hover={{ backgroundColor: 'gray.100' }}
                  key={member.id}
                  justify="space-between"
                  w="100%"
                >
                  <Box flex="1">
                    <HStack spacing={3}>
                      <Avatar.Root size="sm">
                        <Avatar.Fallback>
                          <FiUser />
                        </Avatar.Fallback>
                      </Avatar.Root>

                      <Box>
                        <Text fontWeight="medium">
                          {member.user?.name} {member.user?.surname}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {member.user?.email}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>

                  <Box>
                    <Badge colorScheme={member.role === 'ADMIN' ? 'purple' : 'gray'}>
                      {member.role}
                    </Badge>

                    {isCurrentUser ? (
                      <Badge ml={2} colorScheme="blue" variant="subtle">
                        Это вы
                      </Badge>
                    ) : (
                      <Menu.Root placement="bottom-end">
                        <Menu.Trigger asChild>
                          <IconButton
                            icon={<FiMoreVertical />}
                            variant="outline"
                            size="sm"
                            ml={2}
                          />
                        </Menu.Trigger>
                        <Menu.Positioner>
                          <Menu.Content>
                            <Menu.Item onClick={() => alert(`Изменить роль ${member.user?.name}`)}>
                              <Menu.ItemStartIcon as={FiEdit2} />
                              <Menu.ItemText>Изменить роль</Menu.ItemText>
                            </Menu.Item>
                            <Menu.Separator />
                            <Menu.Item
                              color="red.500"
                              onClick={() => alert(`Удалить ${member.user?.name}`)}
                            >
                              <Menu.ItemStartIcon as={<FiTrash2 />} />
                              <Menu.ItemText>Удалить сотрудника</Menu.ItemText>
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Menu.Root>
                    )}
                  </Box>
                </HStack>
              )
            })
          ) : (
            <Text color="gray.500">Нет сотрудников</Text>
          )}
        </VStack>
      </VStack>
      <AddUserToCompany />
    </Box>
  )
}

export default CompanyDetails
