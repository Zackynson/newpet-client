import React from 'react'
import { Pet } from 'types/Pet'
import GooglePlacesAutocomplete from 'chakra-ui-google-places-autocomplete'

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
          <Image
            borderRadius="lg"
            w={'100%'}
            height={300}
            objectFit="cover"
            src={pet?.images?.[0]}
            alt={pet.name}
            pt={-2}
            fallbackSrc={fallbackimage.src}
          />
        </CardBody>
        <CardFooter
          textAlign="center"
          textTransform="capitalize"
          display="flex"
          justify="center"
          alignItems="center"
          py={2}
        >
          <Heading
            overflow={'auto'}
            textAlign="center"
            textTransform="capitalize"
            size="sm"
            mb={2}
            color="blue.500"
          >
            {pet.name}
          </Heading>
        </CardFooter>
      </Stack>
    </Card>
  )
}

export default PetCard
