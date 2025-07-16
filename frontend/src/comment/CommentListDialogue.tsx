import { CommentCreate } from "@/comment/CommentCreate"
import { CommentList } from "./CommentList"
import { CloseButton, Dialog, Portal } from "@chakra-ui/react"
import { useEffect, useState } from "preact/hooks"
import { useCurrentParams } from "@/hooks/queries"

export const CommentListDialogue = ({ triggerButton }: any) => {
    const [open, setOpen] = useState(false)

    const { chapterReference } = useCurrentParams()
    useEffect(() => {
        setOpen(false)
    }, [chapterReference])

    return (
        <Dialog.Root closeOnInteractOutside={true} open={open} onOpenChange={({ open }) => setOpen(open)}>
            <Dialog.Trigger asChild>{triggerButton}</Dialog.Trigger>

            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="2xl">
                        <Dialog.Header><Dialog.Title>Комментарии</Dialog.Title></Dialog.Header>

                        <Dialog.Body>
                            <CommentCreate />
                            <CommentList />
                        </Dialog.Body>

                        <Dialog.CloseTrigger asChild><CloseButton size="sm" /></Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}
