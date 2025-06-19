import { ChapterPreview, ChapterPublic } from "@/schemas"
import { Skeleton } from "@chakra-ui/react"

type ChapterTitleProps = {
	data?: ChapterPreview | ChapterPublic
}
export const ChapterTitle = ({ data }: ChapterTitleProps) => {
	return !!data ? (
		data?.title
	) : (
		<Skeleton mx={1} display="inline-block" variant="pulse">
			Название главы
		</Skeleton>
	)
}
