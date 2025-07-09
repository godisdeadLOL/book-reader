import { ChapterPreview } from "@/schemas"
import { ChapterReference, ParagraphReference } from "@/types"

export type ChapterInteraction = {
    mode: "delete" | "reorder"
    chapterData: ChapterPreview
}

export type ChapterAction = "delete" | "reorder" | "edit"

export type ChapterListContext = {
    interaction?: ChapterInteraction

    onChapterClick?: (chapterData: ChapterPreview, direction: "top" | "bottom") => void

    onChapterAction?: (chapterData: ChapterPreview, action: ChapterAction) => void

    passiveBookmark: ChapterReference | null,
    activeBookmark: ParagraphReference | null,

    isScrolling: boolean
    isPending: boolean
    isAdmin: boolean
}

export type ChapterReorderRequest = {
    chapterId: number
    volume: number | null
    index: number
}