import { Box, Text, Flex } from '@chakra-ui/react'

export const InfoRow = ({ icon: Icon, label, value, color = 'blue.500' }) => (
  <Flex align="center" gap={3} py={2}>
    {Icon && <Icon size={18} style={{ color: `var(--chakra-colors-${color})` }} />}
    <Box>
      <Text fontSize="xs" color="gray.500" fontWeight="medium">
        {label}
      </Text>
      <Text fontSize="md" fontWeight="semibold">
        {value || '—'}
      </Text>
    </Box>
  </Flex>
)

export const InfoSection = ({
  label,
  value,
  color = 'gray.700',
  bg = 'transparent',
  italic = false,
}) => (
  <Box bg={bg} p={bg !== 'transparent' ? 4 : 0} borderRadius="md">
    <Text fontWeight="bold" mb={1} fontSize="sm">
      {label}
    </Text>
    <Text fontSize="sm" color={color} fontStyle={italic ? 'italic' : 'normal'}>
      {value || 'Нет данных'}
    </Text>
  </Box>
)
