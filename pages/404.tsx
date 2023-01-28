import { Box, Heading, Text, Button, Center } from '@chakra-ui/react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Center h="full">
      <Box textAlign="center" py={10} px={6}>
        <Heading
          display="inline-block"
          as="h2"
          size="2xl"
          bgGradient="linear(to-r, purple.400, purple.600)"
          backgroundClip="text"
        >
          404
        </Heading>

        <Text color={'gray.500'} mb={6}>
          A página que você tentou acessar não existe
        </Text>
        <Link href="/">
          <Button colorScheme="purple" variant="solid">
            Voltar para a lista
          </Button>
        </Link>
      </Box>
    </Center>
  )
}
