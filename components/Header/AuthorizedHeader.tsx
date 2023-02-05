import { ReactNode, useEffect, useState } from 'react'
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  LinkBox,
  IconButton,
  HStack,
  Heading,
  Switch,
  Text,
} from '@chakra-ui/react'

import NextLink from 'next/link'

import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth'

const Links = [
  { label: 'Procurar', uri: '/' },
  { label: 'Cadastrar', uri: '/pets/register' },
]

const NavLink = ({
  children,
  href = '#',
}: {
  children: ReactNode
  href: string
}) => (
  <Link
    as={NextLink}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={href}
  >
    {children}
  </Link>
)

export default function Nav() {
  const [user, setUser] = useState<any>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { colorMode, toggleColorMode } = useColorMode()

  const { data: session } = useSession()

  useEffect(() => {
    setUser(session?.user)
  }, [session])

  return (
    <>
      <Box bg={useColorModeValue('gray.200', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          {/* Menu mobile */}
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />

          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <NextLink href={'/'}>
                <Heading
                  fontFamily={'modak'}
                  letterSpacing="px"
                  fontSize={'2rem'}
                  fontWeight="thin"
                >
                  NEWPET
                </Heading>
              </NextLink>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <NavLink href={link.uri} key={link.uri}>
                  {link.label}
                </NavLink>
              ))}
            </HStack>
          </HStack>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Menu closeOnSelect={false}>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar size={'sm'} src={user?.image} />
                </MenuButton>
                <MenuList zIndex={99} alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar size={'2xl'} src={user?.image} />
                  </Center>
                  <br />
                  <Center>
                    <p>{user?.name}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem onClick={toggleColorMode}>
                    <Flex align={'center'} justify="space-between" w="100%">
                      <Text>Tema</Text>
                      {colorMode === 'dark' ? (
                        <MoonIcon color={'purple.400'} />
                      ) : (
                        <SunIcon color={'yellow.400'} />
                      )}
                    </Flex>
                  </MenuItem>
                  <LinkBox>
                    <NextLink href="/profile" title="Perfil">
                      <MenuItem>Seu perfil</MenuItem>
                    </NextLink>
                  </LinkBox>

                  <MenuItem onClick={() => signOut()}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink href={link.uri} key={link.uri}>
                  {link.label}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  )
}
