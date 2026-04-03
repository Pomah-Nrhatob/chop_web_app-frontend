'use client'

import {
  Combobox,
  IconButton,
  Portal,
  Span,
  Stack,
  Spinner,
  useListCollection,
  Text,
  Box,
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { FiPlus, FiSearch, FiX, FiCheck } from 'react-icons/fi'

export const UserList = ({
  users,
  searchUsers,
  resetSignal,
  isLoading,
  onSelectUser,
  companyUsers,
}) => {
  const [searchInput, setSearchInput] = useState('')
  const [open, setOpen] = useState(false)

  const companyUserIds = useMemo(() => {
    return new Set((companyUsers ?? []).map((user) => user.user.id.toString()))
  }, [companyUsers])

  const { collection, set } = useListCollection({
    initialItems: [],
    itemToString: (item) => item.name,
    itemToValue: (item) => item.id.toString(),
  })

  useEffect(() => {
    const enriched = (users ?? []).map((user) => {
      return {
        ...user,
        disabled: companyUserIds.has(user.id.toString()),
      }
    })

    set(enriched)
  }, [users, companyUserIds, set])

  useEffect(() => {
    if (resetSignal) {
      setSearchInput('')
      set([])
      setOpen(false)
    }
  }, [resetSignal, set])

  const handleSearch = async () => {
    try {
      await searchUsers(searchInput)
      setOpen(true)
    } catch (error) {
      console.error(error)
    }
  }

  const handleClear = () => {
    setSearchInput('')
    set([])
    setOpen(false)
  }

  return (
    <Combobox.Root
      placeholder="Введите имя и фамилию или email..."
      collection={collection}
      inputBehavior="autocomplete"
      inputValue={searchInput}
      selectionBehavior="preserve"
      open={open}
      openOnClick
      onOpenChange={(details) => setOpen(details.open)}
      onInputValueChange={(details) => setSearchInput(details.inputValue)}
      onValueChange={(details) => {
        const id = details.value?.[0]
        const user = collection.items.find((item) => item.id.toString() === id && !item.disabled)
        if (user) onSelectUser?.(user)
      }}
    >
      <Combobox.Label>Поиск пользователя</Combobox.Label>

      <Combobox.Control>
        <Combobox.Input onFocus={() => setOpen(true)} />
        <Combobox.IndicatorGroup>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Поиск"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="xs" /> : <FiSearch />}
          </IconButton>
          <IconButton size="sm" variant="ghost" aria-label="Очистить поиск" onClick={handleClear}>
            <FiX />
          </IconButton>
        </Combobox.IndicatorGroup>
      </Combobox.Control>

      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>
              {isLoading ? <Spinner size="sm" /> : <Text>Пользователь не найден</Text>}
            </Combobox.Empty>

            {collection.items.map((person) => {
              return (
                <Combobox.Item
                  item={person}
                  key={person.id}
                  disabled={person.disabled} // важный флаг
                >
                  <Stack gap={0}>
                    <Span textStyle="sm" fontWeight="medium">
                      {person.name} {person.surname}
                    </Span>
                    <Span textStyle="xs" color="fg.muted">
                      {person.email}
                    </Span>
                  </Stack>

                  {person.disabled ? (
                    <Box as="span" fontSize="sm" color="gray.500" ml={2}>
                      уже в компании
                    </Box>
                  ) : (
                    <IconButton size="sm" variant="outline" aria-label="Добавить">
                      <FiPlus />
                    </IconButton>
                  )}
                </Combobox.Item>
              )
            })}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}
