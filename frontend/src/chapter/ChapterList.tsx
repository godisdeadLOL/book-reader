import { PendingStatus } from "@/components/PendingStatus"
import { useCurrentBookQuery, useCurrentChaptersQuery } from "@/hooks/queries"
import { For, Flex, Box, Stack, Link, Icon, Separator, Em } from "@chakra-ui/react"
import { useEffect, useState } from "preact/hooks"
import { useNavigate } from "react-router"
import { DndContext, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LuBookmark, LuGripVertical, LuPen, LuTrash } from "react-icons/lu"
import { useMutation } from "@tanstack/react-query"
import { toaster } from "@/components/ui/toaster"
import { useToken } from "@/hooks/useToken"
import { formatTimestamp, handleResponse } from "@/utils"
import { ChapterDeleteDialogue } from "@/chapter/ChapterDeleteDialogue"
import { ChapterPreview } from "@/schemas"
import { useBookmark } from "@/hooks/useBookmark"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"

const SmallIconButton = ({ onClick, icon, disabled = false, color = "GrayText", hoverColor = "InfoText" }: any) => {
	return (
		<Icon onClick={onClick} color={color} cursor={"pointer"} pointerEvents={disabled ? "none" : "auto"} _hover={{ color: hoverColor }}>
			{icon}
		</Icon>
	)
}

type ChapterEntryProps = {
	data: ChapterPreview
	disabled: boolean
	bookmark: boolean
}
const ChapterEntry = ({ data, bookmark = false, disabled = false }: ChapterEntryProps) => {
	const token = useToken()
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: data.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	const navigate = useNavigate()
	return (
		<Flex gap={2} ref={setNodeRef} style={style} fontSize={"sm"} alignItems={"center"}>
			{token && (
				<Icon color={disabled ? "GrayText" : "InfoText"} cursor="grab" pointerEvents={disabled ? "none" : "auto"} {...listeners} {...(attributes as any)}>
					<LuGripVertical />
				</Icon>
			)}

			<Link display='inline' onClick={() => navigate(data.index.toString())} overflow='hidden' textOverflow='ellipsis' textWrap='nowrap' pr={1}>
				Глава {data.index} - <Em color={"GrayText"}> {data.title} </Em>
				{/* <Mark display={{'base' : 'none', 'md' : 'inline'}}>Глава</Mark> {data.index}
				<Mark color={"GrayText"}>- {data.title}</Mark> */}
			</Link>

			{bookmark && (
				<Icon ml={-1}>
					<LuBookmark />
				</Icon>
			)}

			<Box ml={"auto"} color={"GrayText"} textWrap={'nowrap'}>
				{formatTimestamp(data.created_at)}
			</Box>

			{token && (
				<>
					<Separator orientation="vertical" alignSelf="stretch" />

					<ChapterDeleteDialogue id={data.id} triggerButton={<SmallIconButton disabled={disabled} ml={1} icon={<LuTrash />} hoverColor="red" />} />
					<SmallIconButton onClick={() => navigate(`${data.index}/chapter_edit`)} disabled={disabled} ml={2} icon={<LuPen />} />
				</>
			)}
		</Flex>
	)
}

type ChapterSwapRequest = {
	book_id: number
	index_from: number
	index_to: number
}

export const ChapterList = () => {
	const token = useToken()
	const { data: book_data } = useCurrentBookQuery()
	const { bookmark } = useBookmark(book_data!.id)

	const { isPending, error, data: chapters_data } = useCurrentChaptersQuery()
	if (!chapters_data) return <PendingStatus isPending={isPending} error={error} />

	const recalculateIndices = (array: any[]) =>
		array.map((item: any, index: number) => {
			return { ...item, index: index + 1 }
		})

	const [chapters, setChapters] = useState<ChapterPreview[]>([])
	useEffect(() => {
		setChapters(recalculateIndices(chapters_data))
	}, [chapters_data])

	const [loading, setLoading] = useState(false)

	const mutation = useMutation({
		onMutate: () => {
			toaster.info({ title: "Изменение порядка...", duration: import.meta.env.VITE_TOAST_DURATION })
			setLoading(true)
		},
		mutationFn: (request: ChapterSwapRequest) => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/chapters/swap`, {
				method: "POST",
				body: JSON.stringify(request),
				headers: {
					"Content-Type": "application/json",
					Token: token ?? "",
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: () => {
			toaster.success({ title: "Порядок изменён", duration: import.meta.env.VITE_TOAST_DURATION })
			// refetch()
		},
		onError: (error) => {
			toaster.error({ title: error.message, duration: import.meta.env.VITE_TOAST_DURATION })
			setChapters(chapters_data)
			setLoading(false)
		},
		onSettled: () => {
			setLoading(false)
		},
	})

	const handleDragEnd = (e: DragEndEvent) => {
		const { active, over } = e

		if (!over || active.id === over.id) return

		const index_from = chapters.find((entry) => entry.id == active.id)!.index
		const index_to = chapters.find((entry) => entry.id == over.id)!.index

		const request: ChapterSwapRequest = { book_id: book_data!.id, index_from: index_from, index_to: index_to }

		setChapters((value) => {
			const fromIndex = value.findIndex((entry) => entry.index === index_from)
			const toIndex = value.findIndex((entry) => entry.index === index_to)
			return recalculateIndices(arrayMove(value, fromIndex, toIndex))
		})

		mutation.mutate(request)
	}

	return (
		<DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
			<SortableContext items={chapters}>
				<Stack gap={3} flexDirection={"column-reverse"}>
					<For each={chapters}>{(item) => <ChapterEntry bookmark={bookmark === item.index} disabled={loading} data={item} key={item.id} />}</For>
				</Stack>
			</SortableContext>
		</DndContext>
	)
}
