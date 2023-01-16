import React from 'react'
import { Pet } from 'types/Pet'

import moment from 'moment'
import Link from 'next/link'
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Image,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react'

import fallbackimage from '@public/assets/fallback.png'

const PetCard = ({ pet }: { pet: Pet }) => {
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

  return (
    <Card w={'xs'}>
      <Stack divider={<StackDivider />}>
        <CardBody>
          <Stack divider={<StackDivider />}>
            <Box>
              <Image
                borderRadius="lg"
                w={'100%'}
                height={200}
                objectFit="cover"
                src={pet?.images?.[0]}
                alt={pet.name}
                pt={-2}
                fallbackSrc={fallbackimage.src}
              />
            </Box>
          </Stack>
        </CardBody>
        <CardFooter display="flex" justify="center" alignItems="center">
          <Heading textAlign="center" textTransform="capitalize" size="sm">
            {pet.name}
          </Heading>
        </CardFooter>
      </Stack>
    </Card>
  )
}

export default PetCard
