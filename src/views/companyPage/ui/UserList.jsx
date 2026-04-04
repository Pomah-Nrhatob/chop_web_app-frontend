// src/components/UserList.jsx
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
import { useEffect, useMemo, useState, useRef } from 'react'
import { FiPlus, FiSearch, FiX } from 'react-icons/fi'

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

  const debounceTimer = useRef(null)

  const companyUserIds = useMemo(() => {
    return new Set((companyUsers || []).map((user) => user.user.id.toString()))
  }, [companyUsers])

  const { collection, set } = useListCollection({
    initialItems: [],
    itemToString: (item) => item.name,
    itemToValue: (item) => item.id.toString(),
  })

  useEffect(() => {
    const enriched = (users || []).map((user) => {
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

  const debouncedSearch = (value) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(async () => {
      if (value.trim()) {
        try {
          await searchUsers(value)
          setOpen(true)
        } catch (error) {
          console.error('Ошибка поиска:', error)
        }
      } else {
        set([])
      }
    }, 1000)
  }

  const handleInputValueChange = (details) => {
    const newValue = details.inputValue
    setSearchInput(newValue)

    debouncedSearch(newValue)
  }

  const handleClear = () => {
    setSearchInput('')
    set([])
    setOpen(false)
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
  }

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

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
      onInputValueChange={handleInputValueChange}
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
          <IconButton size="sm" variant="ghost" aria-label="Поиск" disabled={isLoading}>
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
                <Combobox.Item item={person} key={person.id} disabled={person.disabled}>
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
