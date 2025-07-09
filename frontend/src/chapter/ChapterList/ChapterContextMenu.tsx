import { ChapterAction } from "./types"

import { IconButton, Box, Menu } from "@chakra-ui/react"
import { useClickAway } from "@uidotdev/usehooks"
import { useEffect, useState } from "preact/hooks"
import { LuEllipsisVertical, LuPen, LuMove, LuTrash } from "react-icons/lu"

type ChapterContextMenuProps = {
    onOpenChange?: (open: boolean) => void
    onActionSelect?: (action: ChapterAction) => void

    disabled?: boolean
}
export const ChapterContextMenu = ({ onOpenChange = undefined, onActionSelect = undefined, disabled=false }: ChapterContextMenuProps) => {
    const [open, setOpen] = useState(false)
    const clickAwayRef = useClickAway<any>(() => setOpen(false))

    useEffect(() => {
        onOpenChange?.(open)
    }, [open])

    return <div style={{ display: "flex" }}>
        <IconButton size="xs" rounded="full" variant="ghost" disabled={disabled} onClick={() => setOpen(true)}> <LuEllipsisVertical /> </IconButton>
        {open && <Box position="relative" w={0} h="full">
            <Menu.Root
                onSelect={(details) => onActionSelect?.(details.value as ChapterAction)}
                open={open} onOpenChange={(details) => setOpen(details.open)}
                closeOnSelect={true}
            >

                <Menu.Content ref={clickAwayRef} position="absolute" right={0} top={0} transition="none">
                    <Menu.Item value="edit"> <LuPen /> Редактировать </Menu.Item>
                    <Menu.Item value="reorder"> <LuMove />  Порядок </Menu.Item>
                    <Menu.Item value="delete" color="red.500"> <LuTrash /> Удалить... </Menu.Item>
                </Menu.Content>

            </Menu.Root>
        </Box>}
    </div>
}