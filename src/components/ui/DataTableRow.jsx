'use client'

import { Table, HStack, Flex, Box, IconButton } from '@chakra-ui/react'
import { LuCalendar, LuInfo, LuPencil, LuTrash2 } from 'react-icons/lu'

export const DataTableRow = ({
  goToCalendar,
  icon: Icon,
  title,
  subContent,
  onDetails,
  onEdit,
  onDelete,
  isDeleting,
  actionsColor = 'blue',
}) => {
  return (
    <Table.Row _hover={{ bg: 'gray.50/50' }} transition="background 0.2s ease">
      <Table.Cell py={3}>
        <HStack gap={3}>
          <Flex
            align="center"
            justify="center"
            boxSize="32px"
            bg={`${actionsColor}.50`}
            color={`${actionsColor}.600`}
            borderRadius="md"
          >
            <Icon size={16} />
          </Flex>
          <Box>
            <Box fontWeight="medium" color="gray.800">
              {title}
            </Box>
            {subContent && (
              <HStack gap={2} mt={1}>
                {subContent}
              </HStack>
            )}
          </Box>
        </HStack>
      </Table.Cell>

      <Table.Cell textAlign="end">
        <HStack gap={1} justify="flex-end">
          <IconButton
            variant="ghost"
            size="sm"
            colorPalette="blue"
            onClick={goToCalendar}
            title="Календарь"
          >
            <LuCalendar size={16} />
          </IconButton>

          <IconButton
            variant="ghost"
            size="sm"
            colorPalette="blue"
            onClick={onDetails}
            title="Детали"
          >
            <LuInfo size={16} />
          </IconButton>

          <IconButton
            variant="ghost"
            size="sm"
            colorPalette="orange"
            onClick={onEdit}
            title="Редактировать"
          >
            <LuPencil size={16} />
          </IconButton>

          <IconButton
            variant="ghost"
            size="sm"
            colorPalette="red"
            onClick={onDelete}
            loading={isDeleting}
            title="Удалить"
          >
            <LuTrash2 size={16} />
          </IconButton>
        </HStack>
      </Table.Cell>
    </Table.Row>
  )
}
