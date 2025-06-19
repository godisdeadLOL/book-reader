import { Heading, Flex, Button } from "@chakra-ui/react"
import { LuArrowLeft, LuArrowRight } from "react-icons/lu"
import Markdown from "react-markdown"
import { Prose } from "@/components/ui/prose"
import { PendingStatus } from "@/components/PendingStatus"
import { useNavigate } from "react-router"
import { useCurrentChapterQuery, useCurrentParams } from "@/hooks/queries"
import { CommentList } from "@/comment/CommentList"
import { CommentCreate } from "@/comment/CommentCreate"
import { useBookmark } from "@/hooks/useBookmark"

export const ChapterShow = () => {
	const navigate = useNavigate()

	const { isPending, error, data: chapterData } = useCurrentChapterQuery()
	if (!chapterData) return <PendingStatus isPending={isPending} error={error} />

	const { book_id } = useCurrentParams()
	const { setBookmark } = useBookmark(book_id!)

	const openNextChapter = () => {
		const index = chapterData.index + 1
		setBookmark(index)
		navigate(`/${book_id}/${index}`)
	}

	return (
		<>
			<Heading>
				Глава {chapterData.index} - {chapterData.title}
			</Heading>

			<Prose maxW={"full"} mt={8}>
				<Markdown>{chapterData.content}</Markdown>
			</Prose>

			<Flex my={8}>
				<Button onClick={() => navigate(`/${book_id}/${chapterData.index - 1}`)} variant={"ghost"} hidden={chapterData.index === 1}>
					<LuArrowLeft /> Назад
				</Button>

				<Button ml="auto" onClick={openNextChapter} variant={"ghost"} hidden={chapterData.index === chapterData.total_amount}>
					Вперед <LuArrowRight />
				</Button>
			</Flex>

			<Heading mb={4}>Комментарии</Heading>

			<CommentCreate />

			<CommentList />
		</>
	)
}
