'use client'

import { Box, Heading, VStack, Text, Flex, Spinner } from '@chakra-ui/react'
import { useProfile } from '@/features/profile/api/use-profile'
import ProfileDetails from '@/views/profilePage/ui/ProfileDetails'
import ChangePassword from '@/views/profilePage/ui/ChangePassword'

export default function Profile() {
  const { profile, isLoading, isFetching } = useProfile()

  const isPageLoading = isLoading || isFetching

  return (
    <Box maxW="1400px" mx="auto" px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
      <VStack align="stretch" gap={6}>
        <VStack align="start" gap={1}>
          <Heading size="lg" color="gray.800">
            Мой профиль
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Управление личной информацией и безопасностью
          </Text>
        </VStack>

        {isPageLoading ? (
          <Flex minH="260px" align="center" justify="center">
            <Spinner size="lg" color="blue.500" thickness="3px" />
          </Flex>
        ) : (
          <Flex flexDirection="column" gap={5}>
            <ProfileDetails profileData={profile} />
            <ChangePassword />
          </Flex>
        )}
      </VStack>
    </Box>
  )
}
