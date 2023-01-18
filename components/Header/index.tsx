import React from 'react'
import Link from 'next/link'

import { useAuth } from '@contexts/AuthContext'
import AvatarPlaceholder from '@public/assets/avatar.png'

import {
  HStack,
  LinkBox,
  StackDivider,
  Avatar,
  Box,
  Card,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

const Header = ({}) => {
  const { user, logout } = useAuth()
  const { asPath } = useRouter()

  return (
    <Card>
      <Box
        backdropBlur={'3xl'}
        background="purple.500"
        h={'12'}
        style={{
          width: '100%',
          padding: '1rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#e4ebef',
            height: 35,
            width: 35,
            borderRadius: '50%',
          }}
        >
          <Link href="/">
            <span
              style={{
                paddingTop: '0.25rem',
                fontFamily: 'Modak',
                display: 'block',
                fontSize: '2.25rem',
                color: '#242526',
                fontWeight: 'lighter',
              }}
            >
              N
            </span>
          </Link>
        </div>
        <HStack
          divider={<StackDivider borderColor={'whiteAlpha.500'} />}
          gap={5}
        >
          <LinkBox
            _after={{
              content: '""',
              position: 'absolute',
              display: 'block',
              height: '1',
              width: '100%',
              top: '8',
              borderRadius: '1px',

              background:
                asPath === '/' ||
                (asPath.startsWith('/pets') && !asPath.endsWith('register'))
                  ? 'white'
                  : 'unset',
            }}
            _hover={{
              _after: {
                background: 'whiteAlpha.700',
              },
            }}
            color={'white'}
          >
            <Link href="/">Encontrar</Link>
          </LinkBox>

          <LinkBox
            _after={{
              content: '""',
              position: 'absolute',
              display: 'block',
              height: '1',
              width: '100%',
              top: '8',
              borderRadius: '1px',

              background: asPath.startsWith('/pets/register')
                ? 'white'
                : 'unset',
            }}
            _hover={{
              _after: {
                background: 'whiteAlpha.700',
              },
            }}
            color={'white'}
          >
            <Link href="/pets/register">Cadastrar</Link>
          </LinkBox>
        </HStack>
        <Link href="/profile" title="Perfil">
          <Avatar
            name={user?.name}
            src={user?.avatar || AvatarPlaceholder.src}
            loading="eager"
            height={9}
            width={9}
            objectFit="cover"
            bg={'purple.500'}
            color="white"
          />
        </Link>
      </Box>
    </Card>
  )
}

export default Header
