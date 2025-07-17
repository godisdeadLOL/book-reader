import { Box, chakra, For, Icon, Image, Skeleton, Wrap } from "@chakra-ui/react"
import { useNavigate } from "react-router"
import { useBooksQuery } from "@/hooks/queries"
import { BookPreview } from "@/schemas"
import { LuBookmark } from "react-icons/lu"
import { useBookmarkData } from "@/hooks/useBookmark"
import { useClearQueries } from "@/hooks/useClearQueries"
import { useEffect } from "preact/hooks"

type BookEntryProps = {
	data?: BookPreview
}
const BookEntry = ({ data }: BookEntryProps) => {
	const navigate = useNavigate()

	const { isBookmarked } = useBookmarkData(data?.id ?? "")

	const Wrapper = ({ children }: any) =>
		<Box w={{ base: "1/2", sm: "1/3", lg: "1/4" }} onClick={data ? () => navigate(`/${data?.id}`) : undefined}>
			<Box p={2} pt={4} cursor={"pointer"}>{children}</Box>
		</Box>

	if (!data) return <Wrapper>
		<Skeleton w="full" aspectRatio={0.65} />
		<Skeleton fontSize="xs" mt={2} w="80%">...</Skeleton>
		<Skeleton fontSize="xx-small" mt={2} w="60%">...</Skeleton>
	</Wrapper>

	return (
		<Wrapper>
			<Image rounded="sm" w={"100%"} aspectRatio={0.65} objectFit="cover" src={`${import.meta.env.VITE_BASE_URL}/covers/${data.cover_path}`} />
			<Box fontSize="sm" mt={2} fontWeight={"bold"}>
				<chakra.span mr={2}>{data.title}</chakra.span>
				{isBookmarked && (<Icon><LuBookmark /></Icon>)}
			</Box>
			<Box fontSize="xs" color="GrayText"> {data.title_original} </Box>
		</Wrapper>
	)
}

export const BookList = () => {
	const { data: booksData } = useBooksQuery()

	const { clearBookShow } = useClearQueries()
	useEffect(() => {
		clearBookShow()
	}, [])

	return (
		<Wrap gap={0}>
			<For each={booksData ? booksData : Array(8).fill(null)}>{(item, index) => <BookEntry data={item} key={index} />}</For>
		</Wrap>
	)
}
