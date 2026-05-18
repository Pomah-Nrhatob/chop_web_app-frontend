'use client'

import { Box, Flex, Text, Badge, HStack, Icon } from '@chakra-ui/react'
import { MdPeopleOutline, MdCheckCircle, MdPlayCircleFilled } from 'react-icons/md'

export default function WorkdayCell(
  { workday, openEmptyDay = () => {}, openOneDay = () => {} },
  selectedWorkday
) {
  if (!workday || workday.totalWorkers < 1) {
    return (
      <Box
        onClick={() => openEmptyDay()}
        h="70px"
        border="2px solid"
        borderColor="gray.200"
        bg="gray.50"
        borderRadius="lg"
        p={2}
        cursor="pointer"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
        _hover={{ bg: 'gray.100', shadow: 'md' }}
        transition="all 0.2s"
        shadow="sm"
      >
        <MdPeopleOutline size={20} color="gray" />
        <Text fontSize="xs" color="gray.500" fontWeight="medium">
          Пусто
        </Text>
      </Box>
    )
  }

  const progress =
    workday.totalWorkers > 0 ? (workday.startedCount / workday.totalWorkers) * 100 : 0
  const colorScheme = progress == 100 ? 'green' : progress >= 50 ? 'yellow' : 'orange'

  return (
    <Box
      onClick={() => openOneDay()}
      h="70px"
      border="2px solid"
      borderColor={`${colorScheme}.300`}
      bg={`${colorScheme}.50`}
      borderRadius="lg"
      p={1.5}
      cursor="pointer"
      display="flex"
      alignItems="center"
      justifyContent="center"
      _hover={{ shadow: 'lg', bg: `${colorScheme}.100` }}
      transition="all 0.2s"
      shadow="sm"
    >
      {/* ✅ ИКОНКИ + ЧИПЫ */}
      <Flex direction="column" align="center" gap={1.5}>
        {/* Главная иконка + чип */}
        <Flex align="center" gap={1.5}>
          <Icon as={MdPlayCircleFilled} boxSize={5} color={`${colorScheme}.600`} />
          <Badge size="sm" colorScheme={colorScheme} fontWeight="bold" px={2} py={1}>
            {workday.startedCount}/{workday.totalWorkers}
          </Badge>
        </Flex>

        {/* Маленькая иконка + чип */}
        <Flex align="center" gap={1.5}>
          <Icon as={MdCheckCircle} boxSize={5} color={progress >= 80 ? 'green' : 'gray.600'} />
          <Badge size="sm" variant="" fontSize="xs" px={2} py={1}>
            {workday.finishedCount}
          </Badge>
        </Flex>
      </Flex>
    </Box>
  )
}
