import { Button, Field, Heading, Input, Stack, Textarea } from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { LuPen } from "react-icons/lu"
import { useCurrentBookQuery, useCurrentChapterQuery, useCurrentParams } from "@/hooks/queries"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toaster } from "@/components/ui/toaster"
import { handleResponse } from "@/utils"
import { useEffect, useState } from "preact/hooks"
import { useToken } from "@/hooks/useToken"
import { useNavigate } from "react-router"
import { ChapterForm, ChapterFormFields } from "@/chapter/ChapterForm"
import { useNavigateChapter } from "@/hooks/useNavigateChapter"
import { ChapterPublic } from "@/schemas"
import { ChapterReference } from "@/types"
import { useClearQueries } from "@/hooks/useClearQueries"

export const ChapterEdit = () => {
	const { bookId } = useCurrentParams()
	const { data: chapterData } = useCurrentChapterQuery()

	const token = useToken()
	const { navigate } = useNavigateChapter()

	const { clearChapterList } = useClearQueries()

	const mutation = useMutation({
		onMutate: () => {
			toaster.info({ title: "Обновление главы...", duration: import.meta.env.VITE_TOAST_DURATION })
		},
		mutationFn: ({ chapterId, request }: { chapterId: number, request: ChapterFormFields }) => {
			return fetch(`${import.meta.env.VITE_BASE_URL}/chapters/${chapterId}`, {
				method: "PUT",
				body: JSON.stringify(request),
				headers: {
					"Content-Type": "application/json",
					Token: token ?? "",
				},
			}).then((res) => handleResponse(res))
		},
		onSuccess: (chapter: ChapterPublic) => {
			toaster.success({ title: "Глава обновлена", duration: import.meta.env.VITE_TOAST_DURATION })

			clearChapterList()
			navigate(new ChapterReference(chapter.volume, chapter.index))

		}
	})

	const onSubmit = (request: ChapterFormFields) => {
		mutation.mutate({ chapterId: chapterData?.id!, request: request })
	}

	return <ChapterForm onSubmit={onSubmit} disabled={!chapterData} loading={mutation.isPending} chapterData={chapterData}>
		<LuPen /> Применить
	</ChapterForm>
}
