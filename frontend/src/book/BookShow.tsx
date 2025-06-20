import { Image, Center, Mark, Text, Box, Tabs, Badge, For, Wrap } from "@chakra-ui/react"
import { LuBookOpen, LuBookmarkMinus, LuPen, LuTrash } from "react-icons/lu"
import { PendingStatus } from "@/components/PendingStatus"
import { useCurrentBookQuery, useCurrentChaptersQuery } from "@/hooks/queries"
import { ChapterList } from "@/chapter/ChapterList"
import { AdaptiveButton } from "@/components/AdaptiveButton"
import { useNavigate } from "react-router"
import { BookDeleteDialogue } from "@/book/BookDeleteDialogue"
import { useToken } from "@/hooks/useToken"
import { useBookmark } from "@/hooks/useBookmark"
import { Prose } from "@/components/ui/prose"
import Markdown from "react-markdown"

const Tags = ({ raw }: any) => {
	const tags = raw.split(",").map((item: string) => item.trim())

	return (
		<Wrap gap={2}>
			<For each={tags}>
				{(item, index) => (
					<Badge variant={"outline"} key={index}>
						{item}
					</Badge>
				)}
			</For>
		</Wrap>
	)
}

export const BookShow = () => {
	const token = useToken()

	const { isPending, error, data: bookData } = useCurrentBookQuery()
	if (!bookData) return <PendingStatus isPending={isPending} error={error} />

	const { data: chaptersData } = useCurrentChaptersQuery()

	const { bookmark, clearBookmark } = useBookmark(bookData.id)

	const navigate = useNavigate()

	return (
		<>
			<Image rounded="md" height={"256px"} mx={"auto"} src={`${import.meta.env.VITE_BASE_URL}/covers/${bookData.cover_path}`} />

			<Box textAlign={"center"} mt={4}>
				<Box fontSize="md" fontWeight="bold">
					{bookData.title}
				</Box>
				<Box fontSize="sm" color="GrayText">
					{bookData.title_original}
				</Box>
			</Box>

			<Center my={4} gap={4}>
				{!!bookmark ? (
					<>
						<AdaptiveButton onClick={() => navigate(bookmark.toString())} colorPalette={"blue"} label="Продолжить чтение" size="xs" icon={<LuBookOpen />} variant="solid" />
						<AdaptiveButton onClick={clearBookmark} colorPalette={"red"} label="Удалить закладку" size="xs" icon={<LuBookmarkMinus />} variant="solid" />
					</>
				) : (
					<AdaptiveButton onClick={() => navigate("1")} colorPalette={"blue"} label="Начать чтение" size="xs" icon={<LuBookOpen />} variant="solid" />
				)}

				{token && (
					<>
						<AdaptiveButton onClick={() => navigate("./book_edit")} colorPalette={"blue"} label="Редактировать" size="xs" icon={<LuPen />} variant="outline" />
						<BookDeleteDialogue triggerButton={<AdaptiveButton colorPalette={"red"} label="Удалить" size="xs" icon={<LuTrash />} variant="outline" />} />
					</>
				)}
			</Center>

			<Tabs.Root defaultValue={"description"}>
				<Tabs.List>
					<Tabs.Trigger value={"description"}> Описание </Tabs.Trigger>
					<Tabs.Trigger value={"chapters"}>
						Главы
						<Mark fontFamily={"mono"} fontSize={"x-small"} mb={-1}>
							{chaptersData ? chaptersData.length : ""}
						</Mark>
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value={"description"}>
					<Prose maxW={"full"} mb={6} mt={-4} textIndent={6} fontSize="sm">
						<Markdown>{bookData.description}</Markdown>
					</Prose>

					<Tags raw={bookData.tags} />
				</Tabs.Content>

				<Tabs.Content value={"chapters"}>
					<ChapterList />
				</Tabs.Content>
			</Tabs.Root>
		</>
	)
}
