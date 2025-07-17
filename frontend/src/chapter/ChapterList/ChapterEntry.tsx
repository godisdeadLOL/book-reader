import { ChapterContextMenu } from "@/chapter/ChapterList/ChapterContextMenu"
import { ChapterListContext } from "./types"

import { ChapterPreview } from "@/schemas"
import { attr } from "@/utuils/attr"
import { useState } from "preact/hooks"
import { Link } from "react-router"
import { LuBookmark, LuEllipsis, LuEllipsisVertical, LuEye } from "react-icons/lu"
import { Icon } from "@chakra-ui/react"
import { ChapterReference, isSameChapter, isSameParagraph } from "@/types"
import { useNavigateChapter } from "@/hooks/useNavigateChapter"
import { formatTimestamp } from "@/utils"

type ChapterEntryProps = {
    chapterData: ChapterPreview
    style: any

    context: ChapterListContext
}
export const ChapterEntry = ({ chapterData, context, style }: ChapterEntryProps) => {
    const [elevate, setElevate] = useState(false)

    const { interaction, isScrolling, isPending, isAdmin, onChapterAction, onChapterClick, activeBookmark, passiveBookmark } = context

    const isReordering = interaction?.mode === "reorder"
    const isSelected = isReordering && interaction.chapterData.id === chapterData.id

    const isPassiveBookmarked = !!passiveBookmark && isSameChapter(chapterData.getReference(), passiveBookmark)
    const IsActiveBookmarked = !!activeBookmark && isSameChapter(chapterData.getReference(), activeBookmark.chapter)
    const isBookmarked = isPassiveBookmarked || IsActiveBookmarked

    const { generatePath } = useNavigateChapter()
    
    return (
        <div
            {...attr(elevate, "data-elevate")}
            {...attr(isSelected, "data-selected")}
            // {...attr(isReordering && !isSelected, chapterData.index < interaction?.chapterData.index! ? "data-insert-before" : "data-insert-after")}
            class="chapter" style={style}
        >
            <Link to={{ pathname: generatePath(chapterData.getReference()) }}>
                <em> {chapterData.getReference().getRepr()} </em>
                <span> - {chapterData.title}</span>
            </Link>

            {isBookmarked && (IsActiveBookmarked ?
                <Icon color="red.500"><LuBookmark /></Icon> :
                <Icon><LuEye /></Icon>
            )}

            <time>{formatTimestamp(chapterData.created_at)}</time>

            {isAdmin && <>
                {!isScrolling ?
                    <ChapterContextMenu disabled={isPending} onOpenChange={(open) => setElevate(open)} onActionSelect={(action) => onChapterAction?.(chapterData, action)} /> :
                    <div class="fake-button"> <LuEllipsisVertical size="16px" /> </div>
                }

                {(!isScrolling && isReordering && !isSelected) &&
                    <>
                        <div onClick={() => onChapterClick?.(chapterData, "top")} class="chapter-top" />
                        <div onClick={() => onChapterClick?.(chapterData, "bottom")} class="chapter-bottom" />
                    </>
                }
            </>}
        </div>
    )
}