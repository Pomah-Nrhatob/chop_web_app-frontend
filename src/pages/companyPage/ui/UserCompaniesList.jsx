import { useState } from 'react'
import { Box, Heading, VStack, HStack, Text, IconButton, Badge } from '@chakra-ui/react'
import { FiTrash2, FiCheck } from 'react-icons/fi'
import { FaBuilding } from 'react-icons/fa'
import { useDeleteCompany } from '@/features/company/api/use-company'
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog'
import { useChangeActiveCompany } from '@/features/users/api/use-user'
import { ConfirmActionDialog } from '@/components/ui/ConfirmActionDialog'
import { Tooltip } from '@/components/ui/tooltip'

const UserCompaniesList = ({ companies = [], currentUserId, activeCompanyId, onSetActive }) => {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [changeActiveTarget, setChangeActiveTarget] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openChangeActiveCompanyDialog, setChangeActiveCompanyDialog] = useState(false)

  const { mutate: deleteCompany, isPending } = useDeleteCompany(() => {
    setOpenDeleteDialog(false)
    setDeleteTarget(null)
  })
  const { changeActiveCompany, isLoading: isLoadingChangeActiveCompany } = useChangeActiveCompany(
    () => {
      setChangeActiveCompanyDialog(false)
      setChangeActiveTarget(null)
    }
  )

  const handleDeleteClick = (companyId) => {
    setDeleteTarget(companyId)
    setOpenDeleteDialog(true)
  }

  const handleActiveCompany = (companyId) => {
    setChangeActiveTarget(companyId)
    setChangeActiveCompanyDialog(true)
  }

  const confirmChangeActiveCompany = () => {
    if (changeActiveTarget) {
      changeActiveCompany({ activeCompanyId: changeActiveTarget })
    }
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteCompany(deleteTarget)
    }
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={6} boxShadow="md">
      <VStack align="start" spacing={4} w="100%">
        <HStack spacing={2}>
          <FaBuilding />
          <Heading size="md">Мои компании</Heading>
        </HStack>

        {companies.length > 0 ? (
          companies.map((item) => {
            const { id: membershipId, role, company } = item
            const { id: companyId, name, createdAt } = company || {}
            const isActive = companyId === activeCompanyId

            return (
              <HStack
                key={membershipId}
                justify="space-between"
                w="100%"
                // p={3}
                _hover={{ backgroundColor: 'gray.100' }}
              >
                <Box flex="1">
                  <HStack spacing={2}>
                    <Text fontWeight="normal" fontSize="md">
                      {name}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.500">
                    Создана: {new Date(createdAt).toLocaleDateString()}
                  </Text>
                </Box>

                <HStack spacing={2}>
                  <Badge colorScheme={role === 'ADMIN' ? 'purple' : 'gray'} variant="subtle">
                    {role}
                  </Badge>

                  {isActive ? (
                    <Badge colorScheme="green" variant="subtle" ml={2}>
                      Активна
                    </Badge>
                  ) : (
                    <>
                      <Tooltip content="Сделать компанию активной">
                        <IconButton
                          aria-label="Сделать активной"
                          size="sm"
                          color="green"
                          variant="ghost"
                          onClick={() => handleActiveCompany(companyId)}
                          _hover={{ color: 'green.500' }}
                        >
                          <FiCheck />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="Удалить компанию">
                        <IconButton
                          aria-label="Удалить компанию"
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          color="red.500"
                          onClick={() => handleDeleteClick(companyId)}
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
          <Text color="gray.500">Нет компаний </Text>
        )}
      </VStack>

      {/* Диалог подтверждения удаления */}
      <ConfirmDeleteDialog
        onClose={() => setOpenDeleteDialog(false)}
        isOpen={openDeleteDialog}
        onConfirm={confirmDelete}
        isLoading={isPending}
      />

      {/* Диалог подтверждения смены активной компании */}
      <ConfirmActionDialog
        onClose={() => setChangeActiveCompanyDialog(false)}
        isOpen={openChangeActiveCompanyDialog}
        onConfirm={confirmChangeActiveCompany}
        isLoading={isLoadingChangeActiveCompany}
        message="Вы уверены, что хотите сменить активную компанию?"
        confirmText="Подтвердить"
      />
    </Box>
  )
}

export default UserCompaniesList
