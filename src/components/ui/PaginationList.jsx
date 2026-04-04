import { Text, HStack, IconButton, Pagination } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

export const PaginationList = ({ totalItems, limit, pageList, handleFilterChange, totalPages }) => {
  return (
    <Pagination.Root count={totalItems} pageSize={limit} page={pageList}>
      <HStack wrap="wrap" gap={2} mt={4} justify="center">
        <IconButton
          variant="outline"
          size="sm"
          disabled={pageList === 1}
          onClick={() => handleFilterChange('page', pageList - 1)}
        >
          <LuChevronLeft />
        </IconButton>

        <Text fontWeight="medium" fontSize="sm" px={4}>
          Страница {pageList} из {totalPages || 1}
        </Text>

        <IconButton
          variant="outline"
          size="sm"
          disabled={pageList >= totalPages}
          onClick={() => handleFilterChange('page', pageList + 1)}
        >
          <LuChevronRight />
        </IconButton>
      </HStack>
    </Pagination.Root>
  )
}
