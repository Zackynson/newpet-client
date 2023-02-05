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

const minDate = moment(new Date()).subtract(26, 'years').toDate()
type Input = {
  name: string
  type: PetType
  breed: string
  birthDate: string
  size: PetSize
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
      setValue('birthDate', res?.data?.birthDate as string)
      setValue('breed', res?.data?.breed as string)
      setValue('type', res?.data?.type as PetType)
      setAddressInfo({
        label: res?.data?.address,
        value: {
          description: res?.data?.address,
        },
      })

      if (res?.data?.birthDate?.length) {
        setDate(
          new Date(
            res?.data?.birthDate.split('/').reverse().join('-') as string,
          ),
        )
      }

      setAnimalType(res?.data?.type as string)

      setPet(res.data)
    } catch (error) {
      console.error(error)
      toast.loading(
        'Ocorreu um erro ao buscar esse pet, você será redirecionado para a listagem',
      )
      router.push('/')
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
              birthDate: date,
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
    [session, addressInfo, date, id, images, router],
  )

  return (
    <>
      <Head>
        <title>NEWPET | {pet?.name}</title>
        <meta
          name="description"
          content="O melhor app de adoção de animais do Brasil"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container mt={8} maxW="container.lg" color="#262626">
        <Card>
          <CardHeader>
            <Heading>Atualizar cadastro de pet</Heading>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Spinner></Spinner>
            ) : (
              <form onSubmit={handleSubmit(updatePet)}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    {...register('name', { required: true })}
                    type="text"
                    name="name"
                    defaultValue={pet?.name}
                  />
                  {!!errors.name ? (
                    <FormErrorMessage>Nome é obrigatório.</FormErrorMessage>
                  ) : (
                    <></>
                  )}
                </FormControl>
                <FormControl mt={4} isInvalid={!!errors.type}>
                  <FormLabel>Tipo</FormLabel>
                  <RadioGroup
                    onChange={(value) => setAnimalType(value)}
                    name="type"
                    defaultValue={pet?.type as string}
                    colorScheme="purple"
                  >
                    <Stack direction={'row'} spacing={4}>
                      <Radio
                        {...register('type', { required: true })}
                        value="cat"
                      >
                        <Text>Gato</Text>
                      </Radio>
                      <Radio
                        {...register('type', { required: true })}
                        value="dog"
                      >
                        <Text>Cão</Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>

                <FormControl mt={4} isInvalid={!!errors.breed}>
                  <FormLabel>Raça</FormLabel>

                  <Select
                    placeholder="Selecione a raça"
                    {...register('breed', { required: true })}
                    name="breed"
                    defaultValue={pet?.breed}
                  >
                    {animalBreedList.map((breed) => (
                      <option
                        selected={breed.name === pet?.breed}
                        key={breed.name}
                        value={breed.name}
                      >
                        {breed.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl mt={4}>
                  <FormLabel>Data de nascimento</FormLabel>

                  <SingleDatepicker
                    date={date}
                    onDateChange={setDate}
                    name="birthDate"
                    configs={{
                      dateFormat: 'dd/MM/yyyy',
                    }}
                    maxDate={new Date()}
                    minDate={minDate}
                    propsConfigs={{
                      dateNavBtnProps: {
                        colorScheme: 'purple',
                        variant: 'solid',
                      },
                      dayOfMonthBtnProps: {
                        selectedBtnProps: {
                          borderColor: 'purple.300',
                          bg: 'purple.400',
                          _hover: {
                            bg: 'purple.500',
                          },
                        },
                        defaultBtnProps: {
                          borderColor: 'purple.300',
                          bg: 'purple.100',
                          _hover: {
                            bg: 'purple.400',
                          },
                        },
                      },
                    }}
                  />
                </FormControl>

                <FormLabel mt={10}>Porte</FormLabel>

                <Select {...register('size', { required: true })} name="size">
                  <option value="small">Pequeno</option>
                  <option value="medium">Médio</option>
                  <option value="big">Grande</option>
                </Select>

                <FormLabel mt={10}>Endereço onde ele está</FormLabel>
                <GooglePlacesAutocomplete
                  apiKey="AIzaSyBeAhriPkltT2Z0Pg--4Z5Sm7U7PWLjBAs"
                  selectProps={{
                    value: addressInfo,
                    onChange: setAddressInfo,
                    placeholder:
                      'Digite o endereço onde o pet pode ser encontrado',
                    colorScheme: 'purple',
                  }}
                />

                <FormLabel mt={10}>Adicionar imagens</FormLabel>

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
                                Remover
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
                                Remover
                              </Button>
                            </Box>
                          </Flex>
                        ))}

                        <Button
                          type="button"
                          style={isDragging ? { color: 'red' } : undefined}
                          onClick={onImageUpload}
                          {...dragProps}
                          h={40}
                          w={60}
                        >
                          Clique ou arraste até aqui
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
                  Atualizar
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
