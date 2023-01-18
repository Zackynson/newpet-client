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
  StackDivider,
  LinkBox,
} from '@chakra-ui/react'
import { api } from '@services/api'
import axios from 'axios'
import { useCallback, useMemo, useState } from 'react'
import {
  AiOutlineInstagram,
  AiOutlineMail,
  AiOutlineUser,
  AiOutlineWhatsApp,
} from 'react-icons/ai'

type Owner = {
  _id: string
  name: string
  email: string
  createdAt: '2023-01-17T00:52:51.267Z'
  updatedAt: '2023-01-17T15:20:50.923Z'
  __v: 0
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

      setOwner(response.data)
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
        rightIcon={<AiOutlineUser />}
        colorScheme={'whatsapp'}
      >
        Exibir contato do responsável
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
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
                    src={owner?._id}
                  />
                  <Text>{owner?.name}</Text>
                </VStack>
              </VStack>
              <VStack>
                <LinkBox>
                  <a
                    aria-label="Conversar no whatsapp"
                    href="https://wa.me/5551986595777"
                  >
                    <Button
                      w="sm"
                      colorScheme={'whatsapp'}
                      rightIcon={<AiOutlineWhatsApp />}
                    >
                      Chamar no whatsapp
                    </Button>
                  </a>
                </LinkBox>
                <LinkBox>
                  <a
                    aria-label="Conversar por email"
                    href="mailto:crys.chb@hotmail.com"
                  >
                    <Button
                      w="sm"
                      colorScheme={'blue'}
                      rightIcon={<AiOutlineMail />}
                    >
                      Conversar por email
                    </Button>
                  </a>
                </LinkBox>
                <LinkBox>
                  <a
                    aria-label="Visitar no instagram"
                    href="https://instagram.com/pultaqueopariu"
                  >
                    <Button
                      w="sm"
                      colorScheme={'messenger'}
                      rightIcon={<AiOutlineInstagram />}
                    >
                      Visitar no instagram
                    </Button>
                  </a>
                </LinkBox>
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
