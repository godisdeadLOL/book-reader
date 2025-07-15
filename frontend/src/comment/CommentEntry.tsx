import { CommentDeleteDialogue } from "@/comment/CommentDeleteDialogue"
import { Prose } from "@/components/ui/prose"
import { useToken } from "@/hooks/useToken"
import { CommentPublic } from "@/schemas"
import { convertNameToColor, formatTimestamp } from "@/utils"
import { Box, HStack, Avatar, Stack, Text, IconButton } from "@chakra-ui/react"
import { LuTrash } from "react-icons/lu"
import Markdown from "react-markdown"
import { data } from "react-router"

type CommentEntryProps = {
    commentData: CommentPublic
}
export const CommentEntry = ({ commentData }: CommentEntryProps) => {
    const token = useToken()

    return (
        <Box fontSize={"sm"}>
            <HStack gap={4}>
                <Avatar.Root shape={"rounded"} size="xs" colorPalette={convertNameToColor(commentData.user)}>
                    <Avatar.Fallback name={commentData.user} />
                </Avatar.Root>

                <Stack gap={0}>
                    <Text fontWeight={"bold"} as={"div"}>
                        {commentData.user}
                    </Text>

                    <Text as={"div"} color={"GrayText"}>
                        {formatTimestamp(commentData.updated_at)}
                    </Text>
                </Stack>

                {token && (
                    <CommentDeleteDialogue commentId={commentData.id}>
                        <IconButton ml="auto" rounded="full" size="sm" variant="ghost"><LuTrash /></IconButton>
                    </CommentDeleteDialogue>
                )}
            </HStack>

            <Prose maxW={"full"} pt={2}>
                <Markdown>{commentData.content}</Markdown>
            </Prose>
        </Box>
    )
}