import { CommentDeleteDialogue } from "@/comment/CommentDeleteDialogue"
import { PendingStatus } from "@/components/PendingStatus"
import { Prose } from "@/components/ui/prose"
import { useCurrentCommentsQuery } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { CommentPublic } from "@/schemas"
import { convertNameToColor, formatTimestamp } from "@/utils"
import { Box, HStack, Avatar, Stack, For, Text, IconButton, Skeleton, SkeletonText } from "@chakra-ui/react"
import { LuTrash } from "react-icons/lu"
import Markdown from "react-markdown"

type CommentEntryProps = {
	data: CommentPublic
}
const CommentEntry = ({ data }: CommentEntryProps) => {
	const token = useToken()

	return (
		<Box fontSize={"sm"}>
			<HStack gap={4}>
				<Avatar.Root shape={"rounded"} size="xs" colorPalette={convertNameToColor(data.user)}>
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

				{/* {!!token && (
					<CommentDeleteDialogue id={data.id} triggerButton={<IconButton ml="auto" rounded="full" size="sm" variant="ghost"> <LuTrash /> </IconButton>} />
				)} */}
			</HStack>

			<Prose maxW={"full"} pt={2}>
				<Markdown>{data.content}</Markdown>
			</Prose>
		</Box>
	)
}

const CommentSkeleton = () => {
	return <Box>
		<HStack gap={4} alignItems="start" pb={4}>
			<Skeleton w={8} h={8} />

			<Stack gap={1} justifyContent="start">
				<Skeleton w={32} h={4} />
				<Skeleton w={24} h={3} />
			</Stack>
		</HStack>

		<SkeletonText noOfLines={2} />
	</Box>
}

export const CommentList = () => {
	const { data: commentsData } = useCurrentCommentsQuery()

	console.log("rerender")

	return (
		<Stack gap={8} mt={8}>

			{commentsData ?
				<For each={commentsData}>{(item, index) => <CommentEntry key={index} data={item} />}</For> :
				Array(5).fill(undefined).map((_) => <CommentSkeleton />)
			}

		</Stack>
	)
}
