import { useCurrentBookQuery } from "@/hooks/queries"
import { Skeleton } from "@chakra-ui/react"

export const BookTitle = () => {
	const { data } = useCurrentBookQuery()

	return !!data?.title ? (
		data?.title
	) : (
		<Skeleton display="inline-block" variant="pulse">
			Название аниме
		</Skeleton>
	)
}
