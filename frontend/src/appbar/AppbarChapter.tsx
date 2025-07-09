import { Appbar } from "@/appbar/Appbar"
import { ChapterDeleteDialogue } from "@/chapter/ChapterDeleteDialogue"
import { CommentListDialogue } from "@/comment/CommentListDialogue"
import { AdaptiveButton } from "@/components/AdaptiveButton"
import { ArrowSelect } from "@/components/ArrowSelect"
import { Title } from "@/components/Title"
import { ColorModeButton } from "@/components/ui/color-mode"
import { useCurrentChapterQuery, useCurrentChaptersQuery, useCurrentParams } from "@/hooks/queries"
import { useClearQueries } from "@/hooks/useClearQueries"
import { useNavigateChapter } from "@/hooks/useNavigateChapter"
import { useObserver } from "@/hooks/useObserver"
import { useToken } from "@/hooks/useToken"
import { ChapterReference, isSameChapter } from "@/types"
import { IconButton, Menu, Skeleton } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { useClickAway } from "@uidotdev/usehooks"
import { useState } from "preact/hooks"
import { LuArrowLeft, LuEllipsisVertical, LuMessageSquare } from "react-icons/lu"
import { useLocation, useNavigate } from "react-router"

const ChapterActions = () => {
	const [open, setOpen] = useState(false)
	const clickAwayRef = useClickAway<any>(() => setOpen(false))

	const [deleting, setDeleting] = useState<boolean>(false)
	const navigate = useNavigate()

	const { data: chapterData } = useCurrentChapterQuery()

	const onActionSelect = (action: string) => {
		if (action === "delete") setDeleting(true)
		else if (action === "edit") navigate("chapter_edit")
	}

	return <>
		<ChapterDeleteDialogue
			chapterId={chapterData?.id}
			open={deleting}
			setOpen={(open) => { if (!open) setDeleting(false) }}
		/>

		<IconButton disabled={!chapterData} ref={clickAwayRef} variant="ghost" size="sm" position="relative" onClick={() => setOpen(true)}>
			<LuEllipsisVertical />

			<Menu.Root open={open} onOpenChange={(details) => setOpen(details.open)} onSelect={(details) => onActionSelect(details.value)}>
				<Menu.Content position="absolute" top="calc(100% + 0.5rem)" right={0}>
					<Menu.Item value="edit">Редактировать</Menu.Item>
					<Menu.Item value="delete">Удалить...</Menu.Item>
				</Menu.Content>
			</Menu.Root>
		</IconButton>

	</>
}

export const AppbarChapter = () => {
	const { bookId, chapterReference, mode } = useCurrentParams()
	const token = useToken()

	const { navigate: navigateChapter } = useNavigateChapter()

	const navigate = useNavigate()
	const navigateBack = () => {
		// if (!!mode) navigate(`/${bookId}/${chapterIndex}`)
		navigate(`/${bookId}`)
	}

	const { data: chaptersData } = useCurrentChaptersQuery()
	const { data: chapterData } = useCurrentChapterQuery(false)

	const { clearChapterShow } = useClearQueries()

	const chapterObserver = useObserver("chapter")
	const onChapterSelect = (chapterId: number) => {
		chapterObserver.notify(chapterId)

		clearChapterShow()
		navigateChapter(chaptersData?.find(chapter => chapter.id === chapterId)?.getReference()!, mode)
	}

	return <Appbar hideOnScroll={true}>
		<IconButton variant="ghost" size="xs" onClick={navigateBack} mr="auto">
			<LuArrowLeft />
		</IconButton>

		{chaptersData ?
			<ArrowSelect
				disabled={!chapterData}
				onChange={onChapterSelect}
				value={chaptersData?.find(chapter => isSameChapter(chapter.getReference(), chapterReference))?.id}
				values={chaptersData.map(entry => ({ key: entry.id, label: entry.getReference().getRepr() }))}
			/> :
			<Skeleton maxW={64} flexGrow={1}>...</Skeleton>
		}

		{/* <CommentListDialogue
			triggerButton={<AdaptiveButton ml="auto" disabled={!chapterData} label="Комментарии" icon={<LuMessageSquare />} size="sm" variant="ghost" />}
		/> */}

		<ColorModeButton ml="auto" />

		<ChapterActions />

	</Appbar>
}
