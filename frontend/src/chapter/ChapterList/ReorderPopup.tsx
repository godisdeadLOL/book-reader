import { Portal, Box, HStack, Button } from "@chakra-ui/react"

type ReorderPopupProps = {
    open: boolean
    onCancel?: () => void
}
export const ReorderPopup = ({ open, onCancel = undefined }: ReorderPopupProps) => {
    return <Portal>
        {open && <Box position="fixed" bottom={4} left={0} right={0} px={4}>
            <HStack mx="auto" w="fit" bg="bg.panel" px={6} py={4} borderWidth={1} borderColor="border" rounded="md" gap={4}>
                <Box>
                    <Box fontSize="md">Изменение позиции главы</Box>
                    <Box fontSize="sm" color="GrayText">Выберите новую позицию главы</Box>
                </Box>

                <Button onClick={onCancel} variant="outline" size="md"> Отмена </Button>
            </HStack>
        </Box>}
    </Portal>
}