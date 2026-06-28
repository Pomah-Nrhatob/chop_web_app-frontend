import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Avatar,
  Select,
  createListCollection,
  Alert,
  Input,
  Button,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FiTrash2, FiUser, FiEdit2, FiCheck, FiX } from 'react-icons/fi'
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog'
import {
  useDeleteUserCompany,
  useUpdateCompany,
  useUpdateUserCompany,
} from '@/features/company/api/use-company'
import AddUserToCompany from '@/views/companyPage/ui/AddUserToCompany'
import { Tooltip } from '@/components/ui/tooltip'
import { ConfirmActionDialog } from '@/components/ui/ConfirmActionDialog'
import SelectSecurityPositionDictionary from '@/features/dictionary/components/selectWithSearch/SelectSecurityPositionDictionary'

const roleCollection = createListCollection({
  items: [
    { label: 'USER', value: 'USER' },
    { label: 'MANAGER', value: 'MANAGER' },
  ],
  itemToString: (item) => item.label,
  itemToValue: (item) => item.value,
})

const CompanyDetails = ({ companyData, currentUserId }) => {
  const { name, createdAt, users = [] } = companyData || {}

  const [isEditingName, setIsEditingName] = useState(false)
  const [companyName, setCompanyName] = useState(name || '')
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)
  const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const { mutate: deleteUser, isPending: isPendingDeleteUser } = useDeleteUserCompany()
  const { mutate: updateUser, isPending: isPendingUpdateUser } = useUpdateUserCompany()
  const { mutate: updateCompany, isPending: isPendingUpdateCompany } = useUpdateCompany()

  const handleDeleteUser = () => {
    deleteUser(selectedUser)
  }

  const handleUpdateRole = () => {
    updateUser(selectedUser)
    setIsOpenUpdateDialog(false)
  }

  const handleUpdateCompanyName = () => {
    const trimmedName = companyName.trim()

    if (!trimmedName) return

    updateCompany(
      { name: trimmedName },
      {
        onSuccess: () => {
          setIsEditingName(false)
        },
      }
    )
  }

  if (!companyData) {
    return (
      <Alert.Root status="warning" borderRadius="lg">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Нет доступа к информации компании</Alert.Title>
          <Alert.Description>
            Просмотр информации о компании доступен только администраторам.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    )
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={5} boxShadow="md">
      <VStack display="flex" w="100%">
        <Box w="100%">
          <HStack justify="space-between" w="100%">
            <HStack>
              {isEditingName ? (
                <>
                  <Input
                    size="sm"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Название компании"
                    maxW="250px"
                    variant="flushed"
                  />

                  <HStack gap={1}>
                    <Tooltip content="Сохранить">
                      <IconButton
                        aria-label="Сохранить название"
                        size="xs"
                        colorPalette="green"
                        variant="ghost"
                        onClick={handleUpdateCompanyName}
                        loading={isPendingUpdateCompany}
                        disabled={!companyName.trim()}
                      >
                        <FiCheck />
                      </IconButton>
                    </Tooltip>

                    <Tooltip content="Отменить">
                      <IconButton
                        aria-label="Отменить редактирование"
                        size="xs"
                        variant="ghost"
                        onClick={() => {
                          setCompanyName(name || '')
                          setIsEditingName(false)
                        }}
                      >
                        <FiX />
                      </IconButton>
                    </Tooltip>
                  </HStack>
                </>
              ) : (
                <>
                  <Heading size="md">{name || 'Название не указано'}</Heading>

                  <Tooltip content="Редактировать название">
                    <IconButton
                      aria-label="Редактировать название компании"
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        setCompanyName(name || '')
                        setIsEditingName(true)
                      }}
                    >
                      <FiEdit2 />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </HStack>

            <Badge colorScheme="green">Активна</Badge>
          </HStack>
          {createdAt && (
            <Text color="gray.500" fontSize="sm">
              Создана: {new Date(createdAt).toLocaleDateString()}
            </Text>
          )}
        </Box>

        <Box width="100%" borderBottomWidth="1px" borderBottomColor="gray.200" my={2} />

        <VStack align="start" w="100%">
          <Heading mb={5} size="sm">
            Настройки компании
          </Heading>

          <SelectSecurityPositionDictionary />
        </VStack>
        <Box width="100%" borderBottomWidth="1px" borderBottomColor="gray.200" my={2} />

        <VStack align="start" w="100%" spacing={3}>
          <Heading mb={5} size="sm">
            Сотрудники:
          </Heading>

          <Box display="flex" gap={5} flexDirection="column" w="full">
            {users?.length > 0 ? (
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

                    <HStack spacing={3}>
                      {isCurrentUser ? (
                        <Badge colorScheme="blue" variant="subtle" fontSize="sm">
                          Это вы
                        </Badge>
                      ) : (
                        <>
                          <Select.Root
                            collection={roleCollection}
                            value={[member.role]}
                            onValueChange={(details) => {
                              setSelectedUser({ userId: member.user.id, role: details.value[0] })
                              setIsOpenUpdateDialog(true)
                            }}
                            disabled={isPendingUpdateUser || isCurrentUser}
                          >
                            <Select.HiddenSelect />
                            <Select.Control>
                              <Select.Trigger size="sm" width="120px">
                                <Select.ValueText fontSize="sm" placeholder="Роль" />
                                <Select.IndicatorGroup>
                                  <Select.Indicator color="fg.muted" fontSize="sm" />
                                </Select.IndicatorGroup>
                              </Select.Trigger>
                            </Select.Control>

                            <Select.Positioner>
                              <Select.Content>
                                {roleCollection.items.map((item) => (
                                  <Select.Item key={item.value} item={item}>
                                    {item.label}
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Select.Root>
                          <Tooltip content="Удалить пользователя из компании">
                            <IconButton
                              aria-label="Удалить пользователя"
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              color="red.500"
                              onClick={() => {
                                setSelectedUser(member.user.id)
                                setIsOpenDeleteDialog(true)
                              }}
                              _hover={{ color: 'red.600' }}
                            >
                              <FiTrash2 />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </HStack>
                  </HStack>
                )
              })
            ) : (
              <Text color="gray.500">Нет сотрудников</Text>
            )}
          </Box>
        </VStack>

        <Box width="100%" borderBottomWidth="1px" borderBottomColor="gray.200" my={2} />
        <AddUserToCompany companyData={companyData} />
      </VStack>

      <ConfirmDeleteDialog
        message="Вы уверены, что хотите удалить пользователя из компании? Это действие нельзя отменить."
        isOpen={isOpenDeleteDialog}
        onClose={() => {
          setIsOpenDeleteDialog(false)
          setSelectedUser(null)
        }}
        onConfirm={handleDeleteUser}
        isLoading={isPendingDeleteUser}
      />

      <ConfirmActionDialog
        isOpen={isOpenUpdateDialog}
        onClose={() => {
          setIsOpenUpdateDialog(false)
          setSelectedUser(null)
        }}
        onConfirm={handleUpdateRole}
        isLoading={isPendingUpdateUser}
        message="Вы уверены, что хотите изменить роль пользователя?"
        confirmText="Подтвердить"
      />
    </Box>
  )
}

export default CompanyDetails
