import { AppbarBase } from "@/appbar/AppbarBase"
import { BookTitle } from "@/book/BookTitle"
import { ChapterDeleteDialogue } from "@/chapter/ChapterDeleteDialogue"
import { AdaptiveButton } from "@/components/AdaptiveButton"
import { Title } from "@/components/Title"
import { ColorModeButton } from "@/components/ui/color-mode"
import { useCurrentChapterQuery, useCurrentChaptersQuery, useCurrentParams } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { IconButton, NativeSelect, For, Skeleton } from "@chakra-ui/react"
import { useEffect } from "preact/hooks"
import { LuArrowLeft, LuPen, LuTrash } from "react-icons/lu"
import { useLocation, useNavigate } from "react-router"

export const AppbarChapter = () => {
	const location = useLocation()
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location])

	const { book_id, chapter_index } = useCurrentParams()
	const token = useToken()

	const { pathname } = useLocation()
	let mode: string | null = pathname.split("/").slice(-1)[0]
	if (["chapter_edit"].indexOf(mode) == -1) mode = null

	const navigate = useNavigate()
	const navigateBack = () => {
		if (!!mode) navigate(`/${book_id}/${chapter_index}`)
		else navigate(`/${book_id}`)
	}

	const { data: chaptersData } = useCurrentChaptersQuery()
	const { data: chapterData } = useCurrentChapterQuery()

	const backButton = (
		<IconButton variant={"ghost"} size={"xs"} onClick={navigateBack}>
			<LuArrowLeft />
		</IconButton>
	)

	const title = (
		<>
			<Title>
				<BookTitle />
			</Title>

			{chaptersData ? (
				<NativeSelect.Root size={"sm"} maxW={64}>
					<NativeSelect.Field value={chapter_index}>
						<For each={chaptersData}>
							{(item: any, index) => (
								<option key={index} value={item.index} onClick={() => navigate(`/${book_id}/${item.index}`)}>
									Глава {item.index} - {item.title}
								</option>
							)}
						</For>
					</NativeSelect.Field>
					<NativeSelect.Indicator />
				</NativeSelect.Root>
			) : (
				<Skeleton maxW={64} flexGrow={1}>
					1
				</Skeleton>
			)}
		</>
	)

	const controls = (
		<>
			{token && (
				<>
					<ChapterDeleteDialogue id={chapterData?.id ?? -1} triggerButton={<AdaptiveButton disabled={!chapterData} label="Удалить" colorPalette="red" icon={<LuTrash />} />} />
					<AdaptiveButton disabled={!chapterData} onClick={() => navigate(`/${book_id}/${chapter_index}/chapter_edit`)} label="Редактировать" icon={<LuPen />} />
				</>
			)}

			<ColorModeButton />
		</>
	)

	return <AppbarBase backButton={backButton} title={title} controls={controls} />
}
