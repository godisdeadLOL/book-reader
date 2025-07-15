import { CommentCreate } from "@/comment/CommentCreate"
import { CommentList } from "./CommentList"
import { CloseButton, Dialog, Portal } from "@chakra-ui/react"

export const CommentListDialogue = ({ triggerButton }: any) => {

    return (
        <Dialog.Root closeOnInteractOutside={true}>
            <Dialog.Trigger asChild>{triggerButton}</Dialog.Trigger>

            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
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
