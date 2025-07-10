import { useEffect, useMemo } from "preact/hooks"
import { ChapterLoading } from "./ChapterLoading"
import { ChapterSkeleton } from "./ChapterSkeleton"
import { useChapterQuery, useCurrentParams } from "@/hooks/queries"
import { Prose } from "@/components/ui/prose"
import { indexParagraphs } from "@/unistPlugins"
import { checkEqualShallow, fixDirectSpeech } from "@/utils"
import { Box, Heading, SystemStyleObject } from "@chakra-ui/react"
import Markdown from "react-markdown"
import { ChapterReference } from "@/types"

import { Paragraph } from "./Paragraph"
import { useBookmarkData } from "@/hooks/useBookmark"
import { LuBookmark } from "react-icons/lu"
import { ChapterEntryContext } from "./types"

const style : SystemStyleObject = {
    "& p": {
        mx: -4,
        px: 4,
        py: 2,
        md: { rounded: "md" },
        _selected: { bg: "bg.emphasized" },
        overflowAnchor: "none"
    }
}

type ChapterEntryProps = {
    chapterReference: ChapterReference

    isCurrent?: boolean
    onChapterLoaded?: (chapterReference: ChapterReference) => void
}
export const ChapterEntry = ({ chapterReference, isCurrent = false, onChapterLoaded = undefined }: ChapterEntryProps) => {
    const { data: chapterData } = useChapterQuery(chapterReference)

    useEffect(() => {
        if (chapterData) onChapterLoaded?.(chapterReference)
    }, [chapterData])

    if (!chapterData) return isCurrent ? <ChapterSkeleton /> : <ChapterLoading />

    const { bookId } = useCurrentParams()
    const { activeBookmark, setActiveBookmark, passiveBookmark, setPassiveBookmark } = useBookmarkData(bookId!)

    useEffect(() => {
        if (isCurrent) setPassiveBookmark(chapterReference)
    }, [chapterData])

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
            <Heading display="flex" alignItems="center" gap={1}>
                {chapterData.getChapterReference().getRepr()} - {chapterData.title}
                {(checkEqualShallow(chapterReference, passiveBookmark)) && <LuBookmark />}
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