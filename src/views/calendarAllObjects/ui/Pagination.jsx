import { useCalendarAllObjectsStore } from '@/features/calendar/store/useCalendarAllObjectsStore'
import { ButtonGroup, IconButton, Pagination } from '@chakra-ui/react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

export default function CalendarPagination({ meta }) {
  const { queryParams, setQueryParams } = useCalendarAllObjectsStore()

  return (
    <Pagination.Root
      width="full"
      textAlign="center"
      mt={5}
      count={meta?.total || 0}
      pageSize={meta?.limit || 20}
      page={queryParams.page}
      onPageChange={(e) => setQueryParams({ page: e.page })}
    >
      <ButtonGroup variant="ghost" size="sm">
        <Pagination.PrevTrigger asChild>
          <IconButton>
            <HiChevronLeft />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items
          render={(page) => (
            <IconButton variant={{ base: 'ghost', _selected: 'outline' }}>{page.value}</IconButton>
          )}
        />

        <Pagination.NextTrigger asChild>
          <IconButton>
            <HiChevronRight />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  )
}
