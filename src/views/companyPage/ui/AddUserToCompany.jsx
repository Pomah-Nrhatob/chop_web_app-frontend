import { useAddUserCompany } from '@/features/company/api/use-company'
import { useSearchUsers } from '@/features/users/api/use-user'
import { UserList } from '@/views/companyPage/ui/UserList'
import {
  Box,
  Button,
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTrigger,
  DialogTitle,
  VStack,
  Text,
  RadioGroup,
  Stack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'

export default function AddUserToCompany({ companyData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [resetSignal, setResetSignal] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState('USER')

  const { users, searchUsers, isLoading: isLoadingSearch } = useSearchUsers()
  const { mutate: addUserCompany, isPending: isPendingAddUserCompany } = useAddUserCompany()

  const handleOpenChange = (details) => {
    setIsOpen(details.open)

    if (!details.open) {
      setResetSignal((prev) => prev + 1)
      setSelectedUser(null)
      setSelectedRole('USER')
    }
  }

  const handleSubmit = async () => {
    if (!selectedUser) return

    const payload = {
      userId: selectedUser.id,
      role: selectedRole,
    }

    addUserCompany(payload)
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={handleOpenChange}>
      <Box w="100%" display="flex" justifyContent="flex-end" mt={2}>
        <DialogTrigger asChild>
          <Button size="sm" variant="surface">
            <FiPlus /> Добавить пользователя
          </Button>
        </DialogTrigger>
      </Box>

      <DialogBackdrop />
      <DialogPositioner
        display="flex"
        alignItems={{ base: 'center', md: 'flex-start' }}
        justifyContent="center"
      >
        <DialogContent w={{ base: 'calc(100vw - 24px)', md: '100%' }} py={2} px={2}>
          <DialogCloseTrigger />
          <DialogHeader>
            <DialogTitle>Добавить пользователя в компанию</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <UserList
              companyUsers={companyData?.users || []}
              isLoading={isLoadingSearch}
              users={users}
              searchUsers={searchUsers}
              resetSignal={resetSignal}
              onSelectUser={setSelectedUser}
            />

            {selectedUser && (
              <VStack align="stretch" mt={4} p={4} borderWidth="1px" borderRadius="md" gap={3}>
                <Text fontWeight="medium">
                  {selectedUser.name} {selectedUser.surname}
                </Text>
                <Text fontSize="sm" color="fg.muted">
                  {selectedUser.email}
                </Text>

                <RadioGroup.Root
                  value={selectedRole}
                  onValueChange={(details) => setSelectedRole(details.value)}
                >
                  <RadioGroup.Label>Роль</RadioGroup.Label>
                  <Stack direction="row" gap={4} mt={2}>
                    <RadioGroup.Item value="USER">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>USER</RadioGroup.ItemText>
                    </RadioGroup.Item>

                    <RadioGroup.Item value="MANAGER">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>MANAGER</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </Stack>
                </RadioGroup.Root>
              </VStack>
            )}
          </DialogBody>

          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="ghost">Отмена</Button>
            </DialogActionTrigger>
            <Button
              type="button"
              colorScheme="blue"
              onClick={handleSubmit}
              disabled={!selectedUser}
            >
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}
