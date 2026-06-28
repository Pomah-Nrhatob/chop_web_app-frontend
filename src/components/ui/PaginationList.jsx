import { ButtonGroup, IconButton, Pagination } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

export const PaginationList = ({ totalItems, limit, pageList, handleFilterChange, totalPages }) => {
  return (
    <Pagination.Root
      width="full"
      textAlign="center"
      mt={4}
      count={totalItems}
      pageSize={limit}
      page={pageList}
      onPageChange={(e) => handleFilterChange('page', e.page)}
    >
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <LuChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items
          render={(page) => (
            <IconButton variant={page.value === pageList ? 'outline' : 'ghost'}>
              {page.value}
            </IconButton>
          )}
        />

        <Pagination.NextTrigger asChild>
          <IconButton disabled={pageList >= totalPages}>
            <LuChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  )
}
