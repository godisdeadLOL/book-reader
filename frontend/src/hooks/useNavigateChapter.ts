import { useCurrentParams } from "@/hooks/queries"
import { ChapterReference, isSameChapter } from "@/types"
import { useNavigate } from "react-router"

export const useNavigateChapter = () => {
    const navigate = useNavigate()
    const { bookId, chapterReference, mode: currentMode } = useCurrentParams()

    const generatePath = (chapter: ChapterReference, mode: string | undefined = undefined) => {
        let path
        if (chapter.volume) path = `/${bookId}/${chapter.volume}/${chapter.index}`
        else path = `/${bookId}/${chapter.index}`

        if (mode) path += `/${mode}`

        return path
    }

    const navigateChapter = (chapter: ChapterReference, mode: string | undefined = undefined) => {
        if (chapterReference && isSameChapter(chapterReference, chapter) && mode === currentMode) return
        navigate(generatePath(chapter, mode))
    }

    const navigateBack = () => {
        navigate(`/${bookId}/`)
    }

    return { generatePath, navigate: navigateChapter, navigateBack }
}