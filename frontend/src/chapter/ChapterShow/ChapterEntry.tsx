import { useEffect, useMemo } from "preact/hooks"
import { ChapterLoading } from "./ChapterLoading"
import { ChapterSkeleton } from "./ChapterSkeleton"
import { useChapterQuery, useCurrentParams } from "@/hooks/queries"
import { Prose } from "@/components/ui/prose"
import { indexParagraphs } from "@/unistPlugins"
import { checkEqualShallow, fixDirectSpeech } from "@/utils"
import { Box, chakra, Heading, Icon, SystemStyleObject } from "@chakra-ui/react"
import Markdown from "react-markdown"
import { ChapterReference } from "@/types"

import { Paragraph } from "./Paragraph"
import { useBookmarkData } from "@/hooks/useBookmark"
import { LuBookmark, LuEye } from "react-icons/lu"
import { ChapterEntryContext } from "./types"

const style: SystemStyleObject = {
    "& p": {
        mx: -4,
        px: 4,
        py: 2,
        md: { rounded: "md" },
        _selected: { bg: "bg.emphasized" },
        // overflowAnchor: "none" - а на хроме без этого прыгает установка закладки
    }
}

type ChapterEntryProps = {
    chapterReference: ChapterReference

    isCurrent?: boolean
    onChapterLoaded?: (chapterReference: ChapterReference) => void
    onChapterError?: () => void
}
export const ChapterEntry = ({ chapterReference, isCurrent = false, onChapterLoaded = undefined, onChapterError = undefined }: ChapterEntryProps) => {
    const { data: chapterData, isError } = useChapterQuery(chapterReference)

    useEffect(() => {
        if (chapterData) onChapterLoaded?.(chapterReference)
    }, [chapterData])

    if (!chapterData) return isCurrent ? <ChapterSkeleton /> : <ChapterLoading />

    const { bookId } = useCurrentParams()
    const { activeBookmark, setActiveBookmark, passiveBookmark, setPassiveBookmark } = useBookmarkData(bookId!)

    useEffect(() => {
        if (isCurrent) setPassiveBookmark(chapterReference)
    }, [chapterData, isCurrent])

    useEffect(() => {
        if (isError) onChapterError?.()
    }, [isError])

    const rendered = useMemo(() => {
        const chapterContext: ChapterEntryContext = {
            currentChapter: chapterReference,
            activeBookmark,
            passiveBookmark,
            setActiveBookmark
        }

        const components = {
            p: ({ node, ...other }: any) => <Paragraph index={node.properties!.index} context={chapterContext} {...other} />
        }

        return <Box id={`chapter-${chapterData.id}`} pb={8} minH="100dvh">
            <Heading>
                <chakra.span mr={2}>{chapterData.getChapterReference().getRepr()} - {chapterData.title}</chakra.span>
                {(checkEqualShallow(chapterReference, passiveBookmark)) && <Icon><LuEye /></Icon>}
            </Heading>

            <Prose maxW={"full"} mt={8} textIndent={5} fontSize="md" css={style}>
                <Markdown components={components} rehypePlugins={[indexParagraphs]} disallowedElements={["li", "ul"]} unwrapDisallowed={true}>
                    {fixDirectSpeech(chapterData.content)}
                </Markdown>
            </Prose>
        </Box>
    }, [chapterData, activeBookmark, passiveBookmark])

    return rendered
}