import { useCurrentChaptersQuery, useCurrentParams } from "@/hooks/queries"
import { ChapterReorderRequest } from "./types"

import { toaster } from "@/components/ui/toaster"
import { ChapterPreview } from "@/schemas"
import { handleResponse } from "@/utils"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useToken } from "@/hooks/useToken"
import { ChapterReference } from "@/types"

const extractChapterSequence = (chaptersData: ChapterPreview[]) => {
    const chapters: ChapterPreview[] = []
    if (chaptersData.length === 0) return chapters

    let prevIndex = chaptersData[0].index
    for (let i = 0; i < chaptersData.length; i++) {
        if (chaptersData[i].index - prevIndex > 1) break
        chapters.push(chaptersData[i])
        prevIndex = chaptersData[i].index
    }

    return chapters
}

const reorderChapters = (chaptersData: ChapterPreview[], request: ChapterReorderRequest) => {
    const chapters = chaptersData.map(chapter => new ChapterPreview(chapter))

    const currentChapter = chapters.find(chapter => chapter.id === request.chapterId)!

    if (request.volume === currentChapter.volume && request.index > currentChapter.index)
        request.index--

    // сдвиг глав после начаольной позиции
    const from_chapters = extractChapterSequence(
        chapters.filter(chapter => (chapter.index > currentChapter.index && chapter.volume === currentChapter.volume))
    )
    if (from_chapters.length > 0 && from_chapters[0].index === currentChapter.index + 1)
        from_chapters.forEach(chapter => chapter.index -= 1)

    // сдвиг глав вверх после целевой позиции
    const to_chapters = extractChapterSequence(
        chapters.filter(chapter => (chapter.index >= request.index && chapter.volume === request.volume))
    )
    if (to_chapters.length > 0 && to_chapters[0].index === request.index)
        to_chapters.forEach(chapter => chapter.index += 1)


    currentChapter.index = request.index
    currentChapter.volume = request.volume

    const sorted = chapters.sort(
        (a, b) => (a.volume ?? 0) - (b.volume ?? 0) || a.index - b.index
    )

    return sorted
}

export const useReorderMutation = () => {
    const token = useToken()

    const queryClient = useQueryClient()
    const mutation = useMutation({
        onMutate: (variables: ChapterReorderRequest) => {
            toaster.info({ title: "Изменение порядка...", duration: import.meta.env.VITE_TOAST_DURATION })

            queryClient.setQueryData<ChapterPreview[]>(
                ["book_show", "chapter_list"],
                data => {
                    const updated = reorderChapters(data!, variables)
                    return updated
                }
            )
        },
        mutationFn: (request: ChapterReorderRequest) => {
            return fetch(`${import.meta.env.VITE_BASE_URL}/chapters/reorder/${request.chapterId}`, {
                method: "POST",
                body: JSON.stringify({ ...request, chapterId: undefined }),
                headers: {
                    "Content-Type": "application/json",
                    Token: token ?? "",
                },
            }).then((res) => handleResponse(res))
        },
        onSuccess: (_data) => {
            toaster.success({ title: "Порядок изменен", duration: import.meta.env.VITE_TOAST_DURATION })
            // refetch()
        }
    })

    return mutation
}