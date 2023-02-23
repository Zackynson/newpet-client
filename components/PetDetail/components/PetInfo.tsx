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
import { PetAge } from 'types/enums/pet-age.enum'
import { PetSize } from 'types/enums/pet-size.enum'
import { Pet } from 'types/Pet'

const parseAge = (age?: PetAge) => {
  if (!age) return 'não informada'
  if (age === PetAge.PUPPY) return 'filhote'
  if (age === PetAge.YOUNG) return 'jovem'
  if (age === PetAge.ADULT) return 'adulto'
  if (age === PetAge.SENIOR) return 'senior'

  return 'não informada'
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
        <Heading> Information</Heading>
        {pet?.ownerId === session?.user?.id ? (
          <Link href={'/pets/' + pet?._id + '/update'}>
            <Button
              rightIcon={<EditIcon />}
              color="white"
              colorScheme={'purple'}
              bg={'purple.500'}
            >
              Edit
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
          Name: <strong> {pet.name}</strong>
        </Text>
        <Text>
          Species: <strong> {pet.type}</strong>
        </Text>
        <Text>
          Breed: <strong> {pet.breed} </strong>
        </Text>
        <Text>
          Age: <strong> {pet.age} </strong>
        </Text>
        <Text>
          Size: <strong> {pet.size} </strong>
        </Text>
        <Text>
          Last update at:{' '}
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
