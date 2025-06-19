import { Box, For, Icon, Image, Wrap } from "@chakra-ui/react"
import { PendingStatus } from "@/components/PendingStatus"
import { useNavigate } from "react-router"
import { useBooksQuery } from "@/hooks/queries"
import { BookPreview } from "@/schemas"
import { LuBookmark } from "react-icons/lu"
import { useBookmark } from "@/hooks/useBookmark"

type BookEntryProps = {
	data: BookPreview
}
const BookEntry = ({ data }: BookEntryProps) => {
	const navigate = useNavigate()

	const { bookmark } = useBookmark(data.id)

	return (
		<Box w={{ base: "1/2", sm: "1/3", md: "1/4", lg: "1/5" }} onClick={() => navigate(`/${data.id}`)}>
			<Box p={2} pt={4} cursor={"pointer"}>
				<Image rounded="sm" w={"100%"} aspectRatio={0.65} src={`${import.meta.env.VITE_BASE_URL}/covers/${data.cover_path}`} />
				<Box display={"inline-flex"} fontSize="sm" mt={2} fontWeight={"bold"}>
					{data.title}
					{bookmark && (
						<Icon ml={1} mt={1} alignSelf={"center"}>
							<LuBookmark />
						</Icon>
					)}
				</Box>
				<Box fontSize="xs" color="GrayText">
					{data.title_original}
				</Box>
			</Box>
		</Box>
	)
}

export const BookList = () => {
	const { isPending, error, data: booksData } = useBooksQuery()
	if (!booksData) return <PendingStatus isPending={isPending} error={error} />

	return (
		<Wrap gap={0}>
			<For each={booksData}>{(item, index) => <BookEntry data={item} key={index} />}</For>
		</Wrap>
	)
}
