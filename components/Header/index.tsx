import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { useAuth } from '@contexts/AuthContext'
import AvatarPlaceholder from '@public/assets/avatar.png'

import { HStack, LinkBox, StackDivider } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const Header = ({}) => {
  const { user, logout } = useAuth()
  const { asPath } = useRouter()

  return (
    <div
      style={{
        width: '100%',
        padding: '1rem 1rem',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#111',
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
      <HStack divider={<StackDivider borderColor={'whiteAlpha.500'} />} gap={5}>
        <LinkBox
          borderBottom={'1px'}
          borderBottomColor={
            asPath === '/' ||
            (asPath.startsWith('/pets') && !asPath.endsWith('register'))
              ? 'yellow.400'
              : 'unset'
          }
          color={'white'}
        >
          <Link href="/">Encontrar</Link>
        </LinkBox>

        <LinkBox
          borderBottom={'1px'}
          borderBottomColor={
            asPath.startsWith('/pets/register') ? 'yellow.400' : 'unset'
          }
          color={'white'}
        >
          <Link href="/pets/register">Cadastrar</Link>
        </LinkBox>

        <LinkBox
          borderBottom={'1px'}
          borderBottomColor={
            asPath.startsWith('/profile') ? 'yellow.400' : 'unset'
          }
          color={'white'}
        >
          <Link href="/profile">Perfil</Link>
        </LinkBox>
      </HStack>
      <Link href="/profile">
        <div
          style={{
            width: 35,
            height: 35,
            borderRadius: '50%',
            overflow: 'hidden',
            objectFit: 'contain',
          }}
        >
          <Image
            src={user?.avatar || AvatarPlaceholder}
            loading="eager"
            alt="avatar"
            height={35}
            width={35}
            quality={100}
          />
        </div>
      </Link>
    </div>
  )
}

export default Header
