import React from 'react'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { parseCookies } from 'nookies'

import { useAuth } from '@contexts/AuthContext'
import AvatarPlaceholder from '@public/assets/avatar.png'

import styles from './styles.module.scss'

const Header = ({}) => {
  const { user, logout } = useAuth()

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
      <nav className={styles.menu}>
        <ul>
          <li>
            <Link href="/">Encontrar pets</Link>
          </li>
          <li>
            <Link href="/register-pet">Cadastrar</Link>
          </li>
        </ul>
      </nav>
      <div onClick={logout}>
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
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['newpet-token']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default Header
