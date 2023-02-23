import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import { Pet } from 'types/Pet'
import { useRouter } from 'next/router'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Breed } from 'types/BreedList'
import axios from 'axios'
import { toast } from 'react-toastify'
import { dogBreeds } from '@libs/pets/dog-breeds'
import { catBreeds } from '@libs/pets/cat-breeds'
import GooglePlacesAutocomplete from 'chakra-ui-google-places-autocomplete'
import { PetType } from 'types/enums/pet-type.enum'
import { PetSize } from 'types/enums/pet-size.enum'
import { getSession, useSession } from 'next-auth/react'
import { PetAge } from 'types/enums/pet-age.enum'

type Input = {
  name: string
  type: PetType
  breed: string
  age: PetAge
  size: PetSize
  gender: string
}

function RegisterPetPage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [animalType, setAnimalType] = useState('cat')
  const [animalBreedList, setAnimalBreedList] = useState<Breed[]>(catBreeds)
  const [addressInfo, setAddressInfo] = useState<any>()

  const router = useRouter()
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Input>()

  useEffect(() => {
    if (animalType === 'dog') setAnimalBreedList(dogBreeds)
    if (animalType === 'cat') setAnimalBreedList(catBreeds)
  }, [animalType])

  const { data: session } = useSession()

  const createPet = useCallback(
    async (data: Partial<Pet>) => {
      setLoading(true)

      try {
        await toast.promise(
          axios.post(
            '/api/pets/register',
            {
              ...data,
              address: addressInfo?.value?.description,
            },
            {
              headers: {
                authorization: session?.user.token as string,
              },
            },
          ),
          {
            success: 'Pet registered',
            pending: 'Registering your pet',
            error: 'An error occoured while registering your pet',
          },
        )

        router.push('/pets')
      } catch (error) {
        console.error(error)
      }

      setLoading(false)
    },
    [addressInfo, router, session],
  )

  return (
    <>
      <Head>
        <title>NEWPET | PET REGISTRATION </title>
        <meta
          name="description"
          content="O melhor app de adoção de animais do Brasil"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container my={8} maxW="container.lg" color="#262626">
        <Card>
          <CardHeader>
            <Heading>Pet registration</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(createPet)}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  {...register('name', { required: true })}
                  type="text"
                  name="name"
                />
                {!!errors.name ? (
                  <FormErrorMessage>Name is required</FormErrorMessage>
                ) : (
                  <></>
                )}
              </FormControl>
              <FormControl mt={4} isInvalid={!!errors.type}>
                <FormLabel>Type</FormLabel>
                <RadioGroup
                  onChange={(value) => setAnimalType(value)}
                  name="type"
                  defaultValue="cat"
                  colorScheme={'purple'}
                >
                  <Stack spacing={4} direction="row">
                    <Radio
                      {...register('type', { required: true })}
                      value="cat"
                    >
                      Cat
                    </Radio>
                    <Radio
                      {...register('type', { required: true })}
                      value="dog"
                    >
                      Dog
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl mt={4} isInvalid={!!errors.gender}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  onChange={(value) => setAnimalType(value)}
                  name="gender"
                  defaultValue="male"
                  colorScheme={'purple'}
                >
                  <Stack spacing={4} direction="row">
                    <Radio
                      {...register('gender', { required: true })}
                      value="male"
                    >
                      Male
                    </Radio>
                    <Radio
                      {...register('gender', { required: true })}
                      value="female"
                    >
                      Female
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl mt={4} isInvalid={!!errors.age}>
                <FormLabel>Age</FormLabel>
                <RadioGroup
                  onChange={(value) => setAnimalType(value)}
                  name="age"
                  defaultValue={PetAge.PUPPY}
                  colorScheme={'purple'}
                >
                  <Stack spacing={4} direction="row">
                    <Radio
                      {...register('age', { required: true })}
                      value={PetAge.PUPPY}
                    >
                      Puppy
                    </Radio>
                    <Radio
                      {...register('age', { required: true })}
                      value={PetAge.YOUNG}
                    >
                      Young
                    </Radio>
                    <Radio
                      {...register('age', { required: true })}
                      value={PetAge.ADULT}
                    >
                      Adult
                    </Radio>
                    <Radio
                      {...register('age', { required: true })}
                      value={PetAge.SENIOR}
                    >
                      Senior
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl mt={4} isInvalid={!!errors.size}>
                <FormLabel>Size</FormLabel>
                <RadioGroup
                  onChange={(value) => setAnimalType(value)}
                  name="size"
                  defaultValue={PetSize.SMALL}
                  colorScheme={'purple'}
                >
                  <Stack spacing={4} direction="row">
                    <Radio
                      {...register('size', { required: true })}
                      value={PetSize.SMALL}
                    >
                      Small
                    </Radio>
                    <Radio
                      {...register('size', { required: true })}
                      value={PetSize.MEDIUM}
                    >
                      Medium
                    </Radio>
                    <Radio
                      {...register('size', { required: true })}
                      value={PetSize.BIG}
                    >
                      Big
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl mt={4} isInvalid={!!errors.breed}>
                <FormLabel>Breed</FormLabel>

                <Select
                  placeholder="Select the breed"
                  {...register('breed', { required: true })}
                  name="breed"
                >
                  {animalBreedList.map((breed) => (
                    <option key={breed.name} value={breed.name}>
                      {breed.name}
                    </option>
                  ))}
                </Select>

                {!!errors.breed ? (
                  <FormErrorMessage>
                    Please select an item from the list
                  </FormErrorMessage>
                ) : (
                  <></>
                )}
              </FormControl>

              <FormLabel mt={4}>Address</FormLabel>
              <GooglePlacesAutocomplete
                apiKey="AIzaSyBeAhriPkltT2Z0Pg--4Z5Sm7U7PWLjBAs"
                selectProps={{
                  value: addressInfo,
                  onChange: setAddressInfo,
                }}
              />
              <Button
                isLoading={loading}
                mt={6}
                colorScheme="purple"
                type="submit"
              >
                Register
              </Button>
            </form>
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session?.user.token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}

export default RegisterPetPage
