import { Center, Icon, VStack } from "@chakra-ui/react"
import { LuMessageCircleX } from "react-icons/lu"

export const CommentListFallback = () => {
    return <VStack textAlign="center" py={4}>
        <Icon size="md"><LuMessageCircleX/></Icon>
        Комментариев нет
    </VStack>
}