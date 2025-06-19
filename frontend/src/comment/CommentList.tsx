import { CommentDeleteDialogue } from "@/comment/CommentDeleteDialogue"
import { PendingStatus } from "@/components/PendingStatus"
import { useCurrentCommentsQuery } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { CommentPublic } from "@/schemas"
import { convertNameToColor, formatTimestamp } from "@/utils"
import { Box, HStack, Avatar, Stack, For, Text, IconButton } from "@chakra-ui/react"
import { LuTrash } from "react-icons/lu"

type CommentEntryProps = {
	data: CommentPublic
}
const CommentEntry = ({ data }: CommentEntryProps) => {
	const token = useToken()

	return (
		<Box fontSize={"sm"}>
			<HStack gap={4}>
				<Avatar.Root colorPalette={convertNameToColor(data.user)}>
					<Avatar.Fallback name={data.user} />
				</Avatar.Root>

				<Stack gap={0}>
					<Text fontWeight={"bold"} as={"div"}>
						{data.user}
					</Text>

					<Text as={"div"} color={"GrayText"}>
						{formatTimestamp(data.updated_at)}
					</Text>
				</Stack>

				{!!token && (
					<CommentDeleteDialogue
						data={data}
						triggerButton={
							<IconButton ml="auto" rounded="full" size="sm" variant="ghost">
								<LuTrash />
							</IconButton>
						}
					/>
				)}
			</HStack>

			<Text mt={4}>{data.content}</Text>
		</Box>
	)
}

export const CommentList = () => {
	const { isPending, error, data: commentsData } = useCurrentCommentsQuery()

	if (!commentsData) return <PendingStatus isPending={isPending} error={error} />

	return (
		<Stack gap={8} my={12}>
			<For each={commentsData}>{(item, index) => <CommentEntry key={index} data={item} />}</For>
		</Stack>
	)
}
