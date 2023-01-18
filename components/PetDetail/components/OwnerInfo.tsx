import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
  Text,
  Icon,
  StackDivider,
  LinkBox,
} from '@chakra-ui/react'
import { api } from '@services/api'
import axios from 'axios'
import { useCallback, useMemo, useState } from 'react'
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineWhatsApp,
} from 'react-icons/ai'

type Owner = {
  _id: string
  name: string
  email: string
  phone: string
  avatar: string
}

const OwnerInfo = ({ ownerId }: { ownerId?: string }) => {
  const [owner, setOwner] = useState<Owner>()

  const loadOwnerInfo = useCallback(async (id: string) => {
    try {
      const response = await axios.get(`/api/owners/get/${id}`, {
        headers: {
          authorization: api.defaults.headers.authorization,
        },
      })

      setOwner(response.data as Owner)
    } catch (error: any) {
      console.log(error.response)
    }
  }, [])

  useMemo(() => {
    if (ownerId) {
      loadOwnerInfo(ownerId)
    }
  }, [ownerId, loadOwnerInfo])

  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button
        onClick={onOpen}
        w={'full'}
        rightIcon={<Icon color={'white'} as={AiOutlinePhone} />}
        colorScheme={'whatsapp'}
      >
        Exibir contato do responsável
      </Button>

      <Modal isOpen={isOpen} size="sm" onClose={onClose}>
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent>
          <ModalHeader>Responsável</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              divider={<StackDivider />}
              align={'center'}
              justify="center"
            >
              <VStack>
                <VStack>
                  <Avatar
                    name={owner?.name}
                    size={'2xl'}
                    color="white"
                    bg={'purple.400'}
                    src={owner?.avatar}
                  />
                  <Text>{owner?.name}</Text>
                </VStack>
              </VStack>
              <VStack>
                {owner?.phone ? (
                  <LinkBox>
                    <a
                      target={'_blank'}
                      aria-label="Conversar no whatsapp"
                      href={'https://wa.me/' + owner?.phone}
                      rel="noreferrer"
                    >
                      <Button
                        w="xs"
                        colorScheme={'whatsapp'}
                        rightIcon={<AiOutlineWhatsApp />}
                      >
                        Chamar no whatsapp
                      </Button>
                    </a>
                  </LinkBox>
                ) : (
                  <></>
                )}
                {owner?.email ? (
                  <LinkBox>
                    <a
                      target={'_blank'}
                      aria-label="Conversar por email"
                      href={`mailto:${owner.email}`}
                      rel="noreferrer"
                    >
                      <Button
                        w="xs"
                        colorScheme={'blue'}
                        rightIcon={<AiOutlineMail />}
                      >
                        Conversar por email
                      </Button>
                    </a>
                  </LinkBox>
                ) : (
                  <></>
                )}
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default OwnerInfo
