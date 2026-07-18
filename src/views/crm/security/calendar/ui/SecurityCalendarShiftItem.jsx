'use client'

import { Badge, Box, Flex, Text, VStack } from '@chakra-ui/react'

export default function SecurityCalendarShiftItem({
  title,
  type = 'shift',
  additionalCount = 0,
  isSelected = false,
  isInteractive = false,
  onClick,
}) {
  const isVacation = type === 'vacation'

  const interactiveProps = isInteractive
    ? {
        as: 'button',
        type: 'button',
        cursor: 'pointer',
        onClick,
        _hover: {
          transform: 'translateY(-1px)',
          boxShadow: 'sm',
          bg: isSelected ? 'blue.600' : 'gray.50',
        },
        _active: {
          transform: 'scale(0.98)',
        },
        _focusVisible: {
          outline: '2px solid',
          outlineColor: 'blue.400',
          outlineOffset: '2px',
        },
      }
    : {}

  return (
    <Box
      w="full"
      h="full"
      minW={0}
      minH={0}
      overflow="hidden"
      borderRadius="xl"
      transition="all .18s cubic-bezier(.2,.8,.2,1)"
      bg={isSelected ? 'blue.500' : 'transparent'}
      color={isSelected ? 'white' : 'gray.800'}
      {...interactiveProps}
    >
      {isVacation ? (
        <Flex h="100%" direction="column" align="center" justify="center" gap={1} px={2} py={2}>
          <Text
            fontSize={{
              base: '18px',
              md: '22px',
            }}
            lineHeight="1"
          >
            🏖️
          </Text>

          <Text
            display={{ base: 'none', sm: 'block' }}
            fontSize={{
              sm: '9px',
              md: 'xs',
            }}
            fontWeight="600"
            textAlign="center"
            opacity={0.95}
          >
            Отпуск
          </Text>
        </Flex>
      ) : (
        <VStack
          h="100%"
          align="stretch"
          justify="space-between"
          spacing={2}
          px={{ base: 1, md: 2 }}
          py={{ base: 1, md: 2 }}
        >
          <Text
            flex="1"
            fontSize={{
              base: '11px',
              sm: '12px',
              md: '13px',
              lg: 'sm',
            }}
            fontWeight="600"
            lineHeight="1.35"
            noOfLines={3}
            color="inherit"
          >
            {title}
          </Text>

          {additionalCount > 0 && (
            <Flex justify="flex-end">
              <Badge
                borderRadius="full"
                px={2}
                py={0.5}
                fontSize="10px"
                fontWeight="700"
                textTransform="none"
                bg={isSelected ? 'whiteAlpha.300' : 'gray.100'}
                color={isSelected ? 'white' : 'gray.600'}
              >
                +{additionalCount}
              </Badge>
            </Flex>
          )}
        </VStack>
      )}
    </Box>
  )
}
