import { ChapterReference, ParagraphReference } from "@/types"

export type ChapterEntryContext = {
    currentChapter: ChapterReference
    activeBookmark: ParagraphReference | null
    passiveBookmark: ChapterReference | null
    setActiveBookmark: (paragraph: ParagraphReference | null) => void
}