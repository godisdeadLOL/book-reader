import { ChapterListSkeleton } from "./ChapterListSkeleton"
import { ChapterEntry } from "./ChapterEntry"
import { ChapterInteraction, ChapterListContext, ChapterReorderRequest } from "./types"

import { useCurrentChaptersQuery, useCurrentParams } from "@/hooks/queries"
import { Box, SystemStyleObject } from "@chakra-ui/react"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { useEffect, useRef, useState } from "preact/hooks"
import { ChapterDeleteDialogue } from "@/chapter/ChapterDeleteDialogue"

import { ReorderPopup } from "./ReorderPopup"
import { useReorderMutation } from "./useReorderMutation"
import { useBookmarkData, useCurrentBookmarkData } from "@/hooks/useBookmark"
import { ChapterPreview } from "@/schemas"
import { useNavigate } from "react-router"
import { useNavigateChapter } from "@/hooks/useNavigateChapter"
import { useToken } from "@/hooks/useToken"


const style: SystemStyleObject = {
    "& .chapter": {
        display: "flex", fontSize: "sm", alignItems: "center", gap: 2,
        borderWidth: 1, borderColor: "transparent", rounded: "md",
        // _hover: { bg: "bg.emphasized" },
        _selected: { bg: "bg.emphasized", borderColor: "ActiveBorder", cursor: "grab" },
    },

    "& .chapter[data-insert-before]": {
        _hover: { borderTopColor: "blue.400" },
        _active: { borderTopColor: "blue.400" },
        cursor: "pointer",
        userSelect: "none"
    },
    "& .chapter[data-insert-after]": {
        _hover: { borderBottomColor: "blue.400" },
        _active: { borderBottomColor: "blue.400" },
        cursor: "pointer",
        userSelect: "none"
    },

    "& .chapter a": {
        _hover: { textDecoration: "underline", textDecorationColor: "GrayText" },
        _active: { textDecoration: "underline", textDecorationColor: "GrayText" },

        overflow: "hidden",
        textOverflow: "ellipsis",
        textWrap: "nowrap"
    },
    "& .chapter time": {
        ml: "auto", color: "GrayText",
    },
    "& .chapter span": {
        color: "GrayText",
    },
    "& .chapter[data-elevate]": {
        zIndex: "overlay"
    },
    "& .fake-button": {
        w: 8,
        h: "full",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    "& .chapter-top": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "full",
        height: "50%",

        cursor: 'pointer',

        _hover: {
            borderTopWidth: 2,
            borderColor: "blue.400"
        }
    },
    "& .chapter-bottom": {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "full",
        height: "50%",

        cursor: 'pointer',

        _hover: {
            borderBottomWidth: 2,
            borderColor: "blue.400",
        },
        _active: {
            borderBottomWidth: 2,
            borderColor: "blue.400",
        }
    }
}
export const ChapterList = ({ reverse }: { reverse: boolean }) => {
    const { data: chaptersData } = useCurrentChaptersQuery()
    if (!chaptersData) return <ChapterListSkeleton />

    let chapters = chaptersData
    if (reverse) chapters = [...chaptersData].reverse()

    const [interaction, setInteraction] = useState<ChapterInteraction>()

    const reorderMutation = useReorderMutation()
    const { activeBookmark, passiveBookmark } = useCurrentBookmarkData()
    const { navigate } = useNavigateChapter()

    const token = useToken()

    const context: ChapterListContext = {
        interaction,
        isScrolling: false,
        isPending: reorderMutation.isPending,

        isAdmin: !!token,

        activeBookmark,
        passiveBookmark,

        onChapterAction(chapterData, action) {
            if (action === "delete") setInteraction({ mode: "delete", chapterData })
            else if (action === "reorder") setInteraction({ mode: "reorder", chapterData })
            else if (action === "edit") navigate(chapterData.getReference(), "chapter_edit")
        },

        onChapterClick(chapterData, direction) {
            if (interaction?.mode !== "reorder") return
            if (interaction.chapterData.id === chapterData.id) return

            const reorderRequest: ChapterReorderRequest = {
                chapterId: interaction.chapterData.id,
                index: chapterData.index + (direction === "bottom" ? 1 : 0),
                volume: chapterData.volume
            }

            setInteraction(undefined)
            reorderMutation.mutate(reorderRequest)
        },
    }

    return <>

        <ReorderPopup open={interaction?.mode === "reorder"} onCancel={() => setInteraction(undefined)} />

        <ChapterDeleteDialogue
            chapterId={interaction?.mode === "delete" ? interaction.chapterData.id : undefined}
            open={interaction?.mode === "delete"}
            setOpen={(open) => { if (!open) setInteraction(undefined) }}
        />

        <ChapterVirtualList chaptersData={chapters} context={context} />
    </>
}


type ChapterVirtualListProps = {
    chaptersData: ChapterPreview[]
    context: ChapterListContext
}
const ChapterVirtualList = ({ chaptersData, context }: ChapterVirtualListProps) => {
    const listRef = useRef<HTMLDivElement | null>(null)
    const virtualizer = useWindowVirtualizer({
        count: chaptersData.length,
        estimateSize: () => 40,
        overscan: 5,
        scrollMargin: listRef.current ? (listRef.current.getBoundingClientRect().top + window.scrollY) : 0,
        getItemKey: (index) => chaptersData[index].id,

    })

    context.isScrolling = virtualizer.isScrolling

    return <Box css={style} mb={24}>
        <div ref={listRef} style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
            {virtualizer.getVirtualItems().map((item) =>
                <ChapterEntry
                    key={item.key}
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: item.size, transform: `translateY(${item.start - virtualizer.options.scrollMargin}px)` }}
                    chapterData={chaptersData[item.index]}
                    context={context}
                />
            )}
        </div>
    </Box>
}