import { EditIcon } from '@chakra-ui/icons'
import {
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { PetSize } from 'types/enums/pet-size.enum'
import { Pet } from 'types/Pet'

const calculateAge = (date?: string) => {
  try {
    if (!date) return 'não informada'
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

const parsePetSize = (size: PetSize) => {
  if (size === PetSize.SMALL) return 'pequeno'
  if (size === PetSize.MEDIUM) return 'médio'
  if (size === PetSize.BIG) return 'grande'
  if (!size) return 'não informado'
}

export const PetInfo = ({ pet }: { pet: Pet }) => {
  const { data: session } = useSession()

  return (
    <VStack divider={<StackDivider></StackDivider>} align={'start'} w={'full'}>
      <Flex alignSelf={'stretch'} flex={1} justify="space-between">
        <Heading> Informações</Heading>
        {pet?.ownerId === session?.user?.id ? (
          <Link href={'/pets/' + pet?._id + '/update'}>
            <Button
              rightIcon={<EditIcon />}
              color="white"
              colorScheme={'purple'}
              bg={'purple.500'}
            >
              Editar
            </Button>
          </Link>
        ) : (
          <></>
        )}
      </Flex>
      <Grid
        flex={1}
        templateColumns={'repeat(3, 1fr)'}
        justifyContent="space-around"
        gap={'2'}
        mt={4}
      >
        <Text>
          Nome: <strong> {pet.name}</strong>
        </Text>
        <Text>
          Especie: <strong> {pet.type === 'cat' ? 'gato' : 'cachorro'}</strong>
        </Text>
        <Text>
          Raça: <strong> {pet.breed} </strong>
        </Text>
        <Text>
          Idade: <strong> {calculateAge(pet.birthDate)} </strong>
        </Text>
        <Text>
          Porte: <strong> {parsePetSize(pet.size as PetSize)} </strong>
        </Text>
        <Text>
          Cadastrado em:{' '}
          <strong>
            {Intl.DateTimeFormat('pt-br').format(
              moment(pet.updatedAt || pet.createdAt, 'YYYYMMDD').toDate(),
            )}
          </strong>
        </Text>
      </Grid>
    </VStack>
  )
}
