import { ChapterEntryContext } from "./types"
import { useObserver } from "@/hooks/useObserver"
import { isSameParagraph, ParagraphReference } from "@/types"
import { checkEqualShallow } from "@/utils"
import { attr } from "@/utuils/attr"
import { Box, HStack, IconButton } from "@chakra-ui/react"
import { useState, useEffect } from "preact/hooks"
import { LuBookmark, LuBookmarkMinus, LuX } from "react-icons/lu"

type ParagraphProps = {
    index: number
    context: ChapterEntryContext
    children: any
}
export const Paragraph = ({ index, context, children }: ParagraphProps) => {
    const [isSelected, setIsSelected] = useState(false)

    const { activeBookmark, currentChapter, setActiveBookmark } = context
    const currentParagraph: ParagraphReference = { chapter: currentChapter, number: index }

    const isBookmarked = !!activeBookmark && isSameParagraph(activeBookmark, currentParagraph)

    const paragraphObserver = useObserver("paragraph")
    useEffect(() => {
        const onParagraphSelected = (paragraph: ParagraphReference) => {
            if (!checkEqualShallow(paragraph, currentParagraph))
                setIsSelected(false)
        }

        paragraphObserver.subscribe(onParagraphSelected)
        return () => paragraphObserver.unsubscribe(onParagraphSelected)
    }, [])

    const onSelect = () => {
        setIsSelected(true)
        paragraphObserver.notify(currentParagraph)
    }

    const onSetBookmark = () => {
        if (activeBookmark && isSameParagraph(activeBookmark, currentParagraph)) setActiveBookmark(null)
        else setActiveBookmark(currentParagraph)
    }

    return <>
        {(isSelected || isBookmarked) && <Box position="relative" h={0}>
            {isBookmarked && <Box position="absolute" color="red.400" top={3}> <LuBookmark /> </Box>}

            {isSelected && <HStack gap={0} position="absolute" left={-2} top={2} px={3} py={2} bg="InfoBackground" borderWidth={1} borderColor="border" rounded="md" textIndent={0}>
                <Box fontSize="sm" textAlign="center">Параграф {index + 1}</Box>

                <IconButton
                    onClick={onSetBookmark}
                    ml={8} size="xs" variant="ghost" color={isBookmarked ? "red.400" : "inherit"}
                >
                    {isBookmarked ? <LuBookmarkMinus /> : <LuBookmark />}
                </IconButton>
                <IconButton onClick={() => setIsSelected(false)} size="xs" variant="ghost" color="inherit"> <LuX /> </IconButton>
            </HStack>}
        </Box>}

        <p onClick={onSelect} {...attr(isBookmarked, "data-bookmarked")} {...attr(isSelected, "data-selected")} data-number={index} >
            {children}
        </p>
    </>
}