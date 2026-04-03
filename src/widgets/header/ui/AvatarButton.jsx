import { Menu, Avatar, Box, Text, Flex, Button, VStack, Spinner } from '@chakra-ui/react'
import { FiSettings, FiBriefcase, FiLogOut, FiChevronDown } from 'react-icons/fi'

export default function AvatarButton({
  name,
  surname,
  email,
  onLogout,
  onProfileClick,
  onCompaniesClick,
  isLoading = false,
}) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button disabled={isLoading} variant="ghost" px={2} py={1} h="auto" minW="auto">
          <Flex align="center" gap={2}>
            {isLoading ? (
              <Spinner size="md" colorPalette="gray" borderWidth="2px" />
            ) : (
              <Avatar.Root size="sm">
                <Avatar.Fallback name={`${name} ${surname}`} />
              </Avatar.Root>
            )}
            <FiChevronDown size={16} color="gray.500" />
          </Flex>
        </Button>
      </Menu.Trigger>

      <Menu.Positioner>
        <Menu.Content
          boxShadow="xl"
          borderRadius="md"
          minW="240px"
          border="1px solid"
          borderColor="gray.100"
          p={2}
        >
          {/* Верхняя часть: Имя и почта */}
          <Box px={3} py={2}>
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="md" color="gray.800">
                {name} {surname}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {email}
              </Text>
            </VStack>
          </Box>

          <Box width="100%" borderBottomWidth="1px" borderBottomColor="gray.200" my={2} />

          {/* Кнопки навигации */}
          <Menu.Item onClick={onProfileClick} _hover={{ bg: 'gray.50' }} borderRadius="md" py={2}>
            <Flex align="center" gap={3}>
              <FiSettings size={16} />
              <Text>Управление профилем</Text>
            </Flex>
          </Menu.Item>

          <Menu.Item onClick={onCompaniesClick} _hover={{ bg: 'gray.50' }} borderRadius="md" py={2}>
            <Flex align="center" gap={3}>
              <FiBriefcase size={16} />
              <Text>Компании</Text>
            </Flex>
          </Menu.Item>

          <Box width="100%" borderBottomWidth="1px" borderBottomColor="gray.200" my={2} />

          {/* Кнопка выхода */}
          <Menu.Item
            onClick={onLogout}
            color="red.500"
            _hover={{ bg: 'red.50', color: 'red.600' }}
            borderRadius="md"
            py={2}
          >
            <Flex align="center" gap={3}>
              <FiLogOut size={16} />
              <Text>Выйти из аккаунта</Text>
            </Flex>
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
