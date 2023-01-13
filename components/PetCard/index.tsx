import { randomUUID } from 'crypto'
import Image from 'next/image'
import React from 'react'
import { Pet } from '../../types/Pet'

import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'
import styles from './styles.module.css'
import moment from 'moment'
import Link from 'next/link'

const PetCard = ({ pet }: { pet: Pet }) => {
  const calculateAge = (date: string) => {
    try {
      var birthDate = moment(date, 'YYYYMMDD')

      const years = moment().diff(birthDate, 'years')
      if (years > 0)
        return (
          <>
            {' '}
            - {years} {years === 1 ? 'ano' : 'anos'}
          </>
        )

      const months = moment().diff(birthDate, 'months')
      if (months > 0)
        return (
          <>
            {' '}
            - {months} {months === 1 ? 'ano' : 'meses'}
          </>
        )

      const days = moment().diff(birthDate, 'days')
      return (
        <>
          {' '}
          - {days} {days === 1 ? 'dia' : 'dias'}
        </>
      )
    } catch (error) {}

    return <></>
  }

  return (
    <Link href={'pets/' + pet._id}>
      {' '}
      <div className={styles.card}>
        <Carousel
          emulateTouch
          showStatus={false}
          showThumbs={false}
          showIndicators={pet.images.length > 1}
          dynamicHeight={false}
        >
          {pet.images.map((i: string) => (
            <div key={i}>
              <Image
                loading="eager"
                style={{ objectFit: 'cover' }}
                width={500}
                height={350}
                quality={100}
                src={i}
                alt={i}
              />
            </div>
          ))}
        </Carousel>

        <div className={styles.info}>
          <h3>
            {pet.name} - {pet.breed} {calculateAge(pet.birthDate)}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export default PetCard
