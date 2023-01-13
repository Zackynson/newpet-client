import Image from 'next/image'
import React from 'react'

import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'
import styles from './styles.module.css'
import moment from 'moment'
import Card from '@components/Card'
import DoubleCard from '@components/DoubleCard'
import { Pet } from 'types/Pet'

const calculateAge = (date: string) => {
  try {
    var birthDate = moment(date, 'YYYYMMDD')

    const years = moment().diff(birthDate, 'years')
    if (years > 0)
      return (
        <>
          {' '}
          {years} {years === 1 ? 'ano' : 'anos'}
        </>
      )

    const months = moment().diff(birthDate, 'months')
    if (months > 0)
      return (
        <>
          {' '}
          {months} {months === 1 ? 'ano' : 'meses'}
        </>
      )

    const days = moment().diff(birthDate, 'days')
    return (
      <>
        {' '}
        {days} {days === 1 ? 'dia' : 'dias'}
      </>
    )
  } catch (error) {}

  return <></>
}

const PetInfo = ({ pet }: { pet: Pet }) => {
  return (
    <div>
      <strong>{pet.name}:</strong>
      <p>
        é um <strong>{pet.type === 'cat' ? 'gato' : 'cachorro'}</strong>
      </p>
      <p>
        da raça <strong>&apos;{pet.breed}&apos;</strong>
      </p>
      <p>
        tem <strong>{calculateAge(pet.birthDate)}</strong> de vida
      </p>
    </div>
  )
}

const PetDetail = ({ pet }: { pet?: Pet }) => {
  if (!pet) return <Card>Pet não encontrado</Card>

  return (
    <div className={styles.container}>
      <h2 style={{ marginBottom: '2rem', marginTop: '4rem' }}>
        Galeria de {pet.name}
      </h2>

      <Card>
        <Carousel
          emulateTouch
          showStatus={false}
          showThumbs={false}
          showIndicators={pet?.images?.length > 1}
          dynamicHeight={false}
        >
          {pet?.images?.map((i: string) => (
            <div key={i}>
              <Image
                loading="eager"
                style={{ objectFit: 'cover' }}
                width={425}
                height={600}
                quality={100}
                src={i}
                alt={i}
              />
            </div>
          ))}
        </Carousel>
      </Card>

      <h2 style={{ marginBottom: '2rem', marginTop: '4rem' }}>Informações</h2>
      <DoubleCard
        left={
          <Image
            loading="eager"
            style={{ objectFit: 'cover' }}
            width={425}
            height={600}
            quality={100}
            src={pet?.images?.[0]}
            alt={pet.name}
          />
        }
        right={<PetInfo pet={pet} />}
      />
    </div>
  )
}

export default PetDetail
