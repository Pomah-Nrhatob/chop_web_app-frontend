'use client'

import { Box, HStack, Text, VStack } from '@chakra-ui/react'

export default function SecurityCalendarShiftItem({
  title,
  type = 'shift',
  additionalCount = 0,
  isSelected = false,
  isInteractive = false,
  onClick,
}) {
  const isVacation = type === 'vacation'

  return (
    <Box
      as={isInteractive && onClick ? 'button' : 'div'}
      type={isInteractive && onClick ? 'button' : undefined}
      width="100%"
      minW={0}
      minH={0}
      display="flex"
      alignItems="stretch"
      textAlign="left"
      borderRadius="md"
      cursor={isInteractive ? 'pointer' : 'inherit'}
      transition="background-color 0.15s ease, transform 0.15s ease"
      _hover={
        isInteractive
          ? {
              bg: isSelected ? 'whiteAlpha.200' : 'blackAlpha.100',
            }
          : undefined
      }
      _active={isInteractive ? { transform: 'scale(0.98)' } : undefined}
      _focusVisible={
        isInteractive
          ? {
              outline: '2px solid',
              outlineColor: isSelected ? 'whiteAlpha.700' : 'blue.400',
              outlineOffset: '-2px',
            }
          : undefined
      }
      onClick={onClick}
    >
      {isVacation ? (
        <VStack
          width="100%"
          minW={0}
          justify="center"
          align="center"
          gap={{ base: 0, md: 1 }}
          px={1}
          py={{ base: 0.5, md: 1 }}
        >
          <Text
            as="span"
            fontSize={{ base: '14px', sm: '16px', md: '20px' }}
            lineHeight="1"
            aria-hidden="true"
          >
            🏖️
          </Text>

          <Text
            display={{ base: 'none', sm: 'block' }}
            maxW="100%"
            fontSize={{ sm: '8px', md: 'xs' }}
            lineHeight="1.1"
            fontWeight="700"
            textAlign="center"
            whiteSpace="normal"
            overflowWrap="anywhere"
            wordBreak="break-word"
          >
            Отпуск
          </Text>
        </VStack>
      ) : (
        <VStack
          width="100%"
          minW={0}
          minH={0}
          justify="center"
          align="stretch"
          gap={{ base: 0.5, md: 1 }}
          px={{ base: 0.5, md: 1 }}
          py={{ base: 0.5, md: 1 }}
        >
          <Text
            width="100%"
            minW={0}
            fontSize={{ base: '7px', sm: '8px', md: '11px', lg: 'xs' }}
            lineHeight={{ base: '1.08', md: '1.18' }}
            fontWeight="650"
            color={isSelected ? 'white' : 'gray.800'}
            textAlign="left"
            whiteSpace="normal"
            overflowWrap="anywhere"
            wordBreak="break-word"
            hyphens="auto"
          >
            {title}
          </Text>

          {additionalCount > 0 && (
            <HStack justify="flex-end" mt="auto" minW={0}>
              <Text
                as="span"
                px={{ base: 1, md: 1.5 }}
                py="1px"
                borderRadius="full"
                bg={isSelected ? 'whiteAlpha.300' : 'blackAlpha.100'}
                color={isSelected ? 'white' : 'gray.700'}
                fontSize={{ base: '7px', sm: '8px', md: '2xs' }}
                lineHeight="1.4"
                fontWeight="700"
                whiteSpace="nowrap"
              >
                +{additionalCount}
              </Text>
            </HStack>
          )}
        </VStack>
      )}
    </Box>
  )
}
