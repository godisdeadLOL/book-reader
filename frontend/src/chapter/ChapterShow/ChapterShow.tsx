import { useEffect, useRef, useState } from "preact/hooks"
import { ChapterLoading } from "./ChapterLoading"
import { useCurrentChaptersQuery, useCurrentParams } from "@/hooks/queries"
import { checkEqualShallow } from "@/utils"
import { ChapterEntry } from "./ChapterEntry"
import { ChapterReference, isSameChapter } from "@/types"
import { useNavigateChapter } from "@/hooks/useNavigateChapter"
import { useObserver } from "@/hooks/useObserver"
import { ChapterSkeleton } from "@/chapter/ChapterShow/ChapterSkeleton"
import { useClearQueries } from "@/hooks/useClearQueries"

export const ChapterShow = () => {
    const bookmarkApplied = useRef(false)
    const trackedChapterElement = useRef<HTMLElement | null>(null)

    const { data: chaptersData } = useCurrentChaptersQuery()
    if (!chaptersData) return <ChapterSkeleton />

    const { chapterReference } = useCurrentParams()
    const { navigate } = useNavigateChapter()

    const [displayParams, setDisplayParams] = useState<{ current: number, next: boolean }>({
        current: chaptersData.findIndex(entry =>
            isSameChapter(entry.getReference(), chapterReference!)),
        next: false
    })

    const chapterObserver = useObserver("chapter")
    useEffect(() => {
        const handleChapterChange = (chapterId: number) => {
            const index = chaptersData.findIndex(chapter => chapter.id === chapterId)
            setDisplayParams({ current: index, next: false })

            bookmarkApplied.current = false
            trackedChapterElement.current = null

            window.scrollTo(0, 0)
        }

        chapterObserver.subscribe(handleChapterChange)
        return () => chapterObserver.unsubscribe(handleChapterChange)
    }, [chapterReference])

    const tryGetCurrentChapterElement = () => {
        const id = chaptersData[displayParams.current].id
        const element = document.getElementById(`chapter-${id}`)
        if (element) trackedChapterElement.current = element
    }

    // Переход к активной закладке
    const onCurrentChapterLoaded = () => {
        tryGetCurrentChapterElement()

        // Применить закладку
        if (bookmarkApplied.current) return
        bookmarkApplied.current = true

        const chapterData = chaptersData[displayParams.current]
        const element = document.querySelector(`#chapter-${chapterData.id} [data-bookmarked]`)

        if (!element) {
            window.scrollTo(0, 0)
        } else {
            const topTarget = window.scrollY + element.getBoundingClientRect().top
            window.scrollTo({ top: topTarget, behavior: "smooth" })
        }
    }

    // Бесконечная прокрутка
    useEffect(() => {
        tryGetCurrentChapterElement()

        const onScroll = () => {
            if (!trackedChapterElement.current) return

            const rect = trackedChapterElement.current.getBoundingClientRect()

            const scrollFrom = -rect.bottom / screen.height // сколько экранов от начала главы
            const scrollTo = rect.bottom / screen.height // сколько экранов до конца главы

            const currentIndex = displayParams.current
            const nextIndex = (displayParams.next && currentIndex < chaptersData.length - 1) ? currentIndex + 1 : null

            if (scrollFrom > -0.5) {
                if (nextIndex) {
                    const chapter = chaptersData[nextIndex]
                    navigate(chapter.getReference())
                }
            } else {
                const chapter = chaptersData[currentIndex]
                navigate(chapter.getReference())
            }

            // Выгрузка предыдущей главы
            if (scrollFrom > 1.0 && nextIndex) {
                setDisplayParams({ current: nextIndex, next: false })
            }

            // Подгрузка следующей главы
            if (scrollTo < 2.0 && !displayParams.next) {
                setDisplayParams({ current: currentIndex, next: true })
            }
            // Выгрузка следующей главы
            else if (scrollTo > 3.0 && displayParams.next) {
                setDisplayParams({ current: currentIndex, next: false })
            }
        }

        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [displayParams, chaptersData, chapterReference])


    const displayedChapters = [
        chaptersData[displayParams.current],
        (displayParams.next && displayParams.current < chaptersData.length - 1) ? chaptersData[displayParams.current + 1] : null
    ].filter(entry => entry !== null)

    return <>
        {displayedChapters.map((chapter, index) =>
            <ChapterEntry
                onChapterLoaded={index === 0 ? onCurrentChapterLoaded : undefined}
                isCurrent={index === 0}
                key={chapter.id}
                chapterReference={chapter.getReference()}
            />
        )}
    </>
}