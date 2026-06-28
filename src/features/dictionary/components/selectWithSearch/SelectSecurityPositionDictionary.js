'use client'

import { Button, Collapsible, HStack, Icon, IconButton, Input, Stack, Text } from '@chakra-ui/react'
import { LuChevronDown, LuPlus, LuTrash2 } from 'react-icons/lu'
import { useState } from 'react'
import { useGetDictionarySecurityPosition } from '@/features/dictionary/api/use-get-dictionary-securityPosition'
import { useCreateDictionarySecurityPosition } from '@/features/dictionary/api/use-create-dictionary-securityPosition'
import { useDeleteDictionarySecurityPosition } from '@/features/dictionary/api/use-delete-dictionary-securityPosition'
import { ConfirmDeleteDialog } from '@/components/ui/ConfirmDeleteDialog'

export default function SelectSecurityPositionDictionary() {
  const [name, setName] = useState('')

  const { data: positions = [], isLoading } = useGetDictionarySecurityPosition()
  const { mutate: createPosition, isPending: isCreating } = useCreateDictionarySecurityPosition()
  const { mutate: deletePosition, isPending: isDeleting } = useDeleteDictionarySecurityPosition()
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)
  const [positionDelete, setPositionDelete] = useState(null)

  const handleCreate = () => {
    const trimmedName = name.trim()

    if (!trimmedName) return

    createPosition(
      { name: trimmedName },
      {
        onSuccess: () => {
          setName('')
        },
      }
    )
  }

  const handleDelete = (id) => {
    deletePosition(id)
    setIsOpenDeleteDialog(false)
  }

  return (
    <Collapsible.Root>
      <ConfirmDeleteDialog
        isOpen={isOpenDeleteDialog}
        onClose={() => {
          setIsOpenDeleteDialog(false)
          setTimeout(() => {
            setPositionDelete(null)
          }, 200)
        }}
        onConfirm={() => handleDelete(positionDelete?.id)}
        isLoading={isDeleting}
        message={`Вы уверены, что хотите удалить должность ${positionDelete?.name}? Это действие нельзя отменить.`}
      />

      <Collapsible.Trigger asChild>
        <Button variant="ghost" size="sm" justifyContent="space-between" w="fit-content">
          Настройка должностей
          <Collapsible.Context>
            {({ open }) => (
              <Icon
                as={LuChevronDown}
                transition="transform .2s"
                transform={open ? 'rotate(180deg)' : 'rotate(0deg)'}
              />
            )}
          </Collapsible.Context>
        </Button>
      </Collapsible.Trigger>

      <Collapsible.Content>
        <Stack mt={2} p={3} borderWidth="1px" borderRadius="md" gap={3}>
          <HStack>
            <Input
              size="sm"
              placeholder="Новая должность"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />

            <Button
              size="sm"
              leftIcon={<LuPlus />}
              onClick={handleCreate}
              loading={isCreating}
              disabled={!name.trim()}
            >
              Добавить
            </Button>
          </HStack>

          <Stack gap={1}>
            {positions.map((position) => (
              <HStack
                key={position.id}
                justify="space-between"
                py={1}
                px={2}
                borderRadius="md"
                _hover={{ bg: 'gray.50' }}
              >
                <Text fontSize="sm">{position.name}</Text>

                <IconButton
                  size="xs"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => {
                    setPositionDelete(position)
                    setIsOpenDeleteDialog(true)
                  }}
                >
                  <LuTrash2 />
                </IconButton>
              </HStack>
            ))}
          </Stack>
        </Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
