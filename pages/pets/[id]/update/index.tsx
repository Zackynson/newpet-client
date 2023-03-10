import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'
import { Pet } from 'types/Pet'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Image,
  Input,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Breed } from 'types/BreedList'
import axios from 'axios'
import { api } from '@services/api'
import { toast } from 'react-toastify'
import { SingleDatepicker } from 'chakra-dayzed-datepicker'
import moment from 'moment'
import { dogBreeds } from '@libs/pets/dog-breeds'
import { catBreeds } from '@libs/pets/cat-breeds'
import ReactImageUploading from 'react-images-uploading'
import GooglePlacesAutocomplete from 'chakra-ui-google-places-autocomplete'
import { PetType } from 'types/enums/pet-type.enum'
import { PetSize } from 'types/enums/pet-size.enum'
import { GetServerSideProps } from 'next'
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

function UpdatePetPage() {
  const [pet, setPet] = useState<Pet>()
  const [loading, setLoading] = useState<boolean>(false)
  const [animalType, setAnimalType] = useState('dog')
  const [animalBreedList, setAnimalBreedList] = useState<Breed[]>([])
  const [date, setDate] = useState<Date>(new Date())
  const [images, setImages] = useState<any[]>([])
  const [addressInfo, setAddressInfo] = useState<any>()

  const maxNumber = 5

  const onChangeImages = (imageList: any, _addUpdateIndex: any) => {
    setImages(imageList)
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<Input>()

  const { data: session } = useSession()

  useEffect(() => {
    if (animalType === 'dog') setAnimalBreedList(dogBreeds)
    if (animalType === 'cat') setAnimalBreedList(catBreeds)
  }, [animalType])

  const router = useRouter()
  const { id } = router.query

  const onRemoveUploadedImages = useCallback(
    async (imageUrl: string) => {
      const t = await toast.promise(
        axios.post(
          `/api/pets/${id}/remove-image/`,
          { image: imageUrl },
          {
            headers: {
              authorization: session?.user.token as string,
            },
          },
        ),
        {
          error: 'Ocorreu um erro ao remover essa imagem',
          success: 'Imagem excluida com sucesso',
          pending: 'Removendo imagem',
        },
      )

      if (t.status === 200) {
        const { images, ...rest } = pet as Pet

        const filteredImages = images?.filter((i) => i !== imageUrl)
        const updatedPet = { ...rest, images: filteredImages }

        setPet(updatedPet)
      }
    },
    [id, pet, session],
  )

  const loadPet = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/pets/' + id, {
        headers: {
          authorization: session?.user.token as string,
        },
      })

      // update form with pet values
      setValue('name', res?.data?.name as string)
      setValue('age', res?.data?.age as PetAge)
      setValue('gender', res?.data?.gender as string)
      setValue('breed', res?.data?.breed as string)
      setValue('type', res?.data?.type as PetType)
      setAddressInfo({
        label: res?.data?.address,
        value: {
          description: res?.data?.address,
        },
      })

      setAnimalType(res?.data?.type as string)

      setPet(res.data)
    } catch (error) {
      console.error(error)
      toast.loading(
        'Ocorreu um erro ao buscar esse pet, voc?? ser?? redirecionado para a listagem',
      )
      router.push('/pets')
    }

    setLoading(false)
  }, [id, router, session, setValue])

  useEffect(() => {
    if (id) loadPet()
  }, [id, loadPet])

  const updatePet = useCallback(
    async (data: Partial<Pet>) => {
      setLoading(true)

      try {
        if (images?.length) {
          // upload pet images
          const promises = images
            .filter((i: any) => i?.data_url)
            .map((image) =>
              axios.post(
                `/api/pets/${id}/upload-image/`,
                { image: image },
                {
                  headers: {
                    authorization: session?.user.token as string,
                  },
                },
              ),
            )

          await toast.promise(Promise.all(promises), {
            pending: 'Enviando imagens',
            success: 'Images enviadas com sucesso',
            error: 'Ocorreu um erro ao enviar algumas das imagens',
          })
        }

        await toast.promise(
          axios.post(
            `/api/pets/${id}/update-info/`,
            {
              ...data,
              address: addressInfo.value.description,
            },
            {
              headers: {
                authorization: session?.user.token as string,
              },
            },
          ),
          {
            pending: 'Atualizando dados pet',
            success: 'Dados atualizados com sucesso',
            error: 'Ocorreu um erro ao atualizar os dados',
          },
        )
      } catch (error) {
        console.error(error)
        toast.error('Ocorreu um erro ao atualizar seu pet')
      }

      router.push(`/pets/${id}`)

      setLoading(false)
    },
    [session, addressInfo, id, images, router],
  )

  return (
    <>
      <Head>
        <title>NEWPET | ATUALIZAR PET</title>
        <meta
          name="description"
          content="O melhor app de ado????o de animais do Brasil"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container minH={'80vh'} mt={8} maxW="container.lg" color="#262626">
        <Card>
          <CardHeader>
            <Heading>Update pet info</Heading>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Spinner></Spinner>
            ) : (
              <form onSubmit={handleSubmit(updatePet)}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    {...register('name', { required: true })}
                    type="text"
                    name="name"
                  />
                  {!!errors.name ? (
                    <FormErrorMessage>Name is required.</FormErrorMessage>
                  ) : (
                    <></>
                  )}
                </FormControl>
                <FormControl mt={4} isInvalid={!!errors.type}>
                  <FormLabel>Type</FormLabel>
                  <RadioGroup
                    onChange={(value) => setAnimalType(value)}
                    name="type"
                    defaultValue={pet?.type}
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
                    defaultValue={pet?.gender}
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
                    defaultValue={pet?.age}
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
                    defaultValue={pet?.size}
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
                    defaultValue={pet?.breed}
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
                <FormLabel mt={10}>Add images</FormLabel>

                <ReactImageUploading
                  multiple
                  value={images}
                  onChange={onChangeImages}
                  maxNumber={maxNumber}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemove,
                    isDragging,
                    dragProps,
                    errors: imageErrors,
                  }) => (
                    <Box>
                      {imageErrors && (
                        <div>
                          {imageErrors.maxNumber && (
                            <span>
                              Number of selected images exceed maxNumber
                            </span>
                          )}
                          {imageErrors.acceptType && (
                            <span>Your selected file type is not allow</span>
                          )}
                          {imageErrors.maxFileSize && (
                            <span>Selected file size exceed maxFileSize</span>
                          )}
                          {imageErrors.resolution && (
                            <span>
                              Selected file is not match your desired resolution
                            </span>
                          )}
                        </div>
                      )}
                      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                        {/* imagens que ja estao no pet */}
                        {pet?.images?.map((image, index) => (
                          <Flex
                            direction={'column'}
                            justify="space-between"
                            textAlign={'center'}
                            bg={'gray.100'}
                            key={index}
                            className="image-item"
                          >
                            <Image
                              src={image}
                              alt=""
                              h={40}
                              w={60}
                              flex={1}
                              objectFit="contain"
                              justifySelf="center"
                              alignSelf={'center'}
                            />
                            <Box>
                              <Button
                                my={2}
                                type="button"
                                variant={'outline'}
                                color="red"
                                colorScheme="red"
                                onClick={() => onRemoveUploadedImages(image)}
                              >
                                Remove
                              </Button>
                            </Box>
                          </Flex>
                        ))}
                        {imageList.map((image, index) => (
                          <Flex
                            direction={'column'}
                            justify="space-between"
                            textAlign={'center'}
                            bg={'gray.100'}
                            key={index}
                            className="image-item"
                          >
                            <Image
                              src={image['data_url']}
                              alt=""
                              h={40}
                              w={60}
                              flex={1}
                              objectFit="contain"
                              justifySelf="center"
                              alignSelf={'center'}
                            />
                            <Box>
                              <Button
                                my={2}
                                type="button"
                                variant={'outline'}
                                color="red"
                                colorScheme="red"
                                onClick={() => onImageRemove(index)}
                              >
                                Remove
                              </Button>
                            </Box>
                          </Flex>
                        ))}

                        <Button
                          type="button"
                          style={isDragging ? { color: 'green' } : undefined}
                          onClick={onImageUpload}
                          {...dragProps}
                          h={40}
                          w={60}
                        >
                          Click or drag here
                        </Button>
                      </Grid>
                    </Box>
                  )}
                </ReactImageUploading>

                <Button
                  isLoading={loading}
                  mt={6}
                  colorScheme="purple"
                  type="submit"
                >
                  Update info
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session) {
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

export default UpdatePetPage
