import { Portal, Button, CloseButton, Dialog } from "@chakra-ui/react";
import { useClickAway } from "@uidotdev/usehooks";
import { useState } from "preact/hooks";

type ActionDialogueProps = {
	title: string
	description: string

	open?: boolean
	setOpen?: (open: boolean) => void

	promise: () => Promise<any>

	disabled?: boolean
	children: any
};
export const ActionDialogue = ({ title, description, open = undefined, setOpen = undefined, promise, disabled = false, children }: ActionDialogueProps) => {
	const [internalOpen, setInternalOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	open = open ?? internalOpen
	setOpen = setOpen ?? setInternalOpen

	const clickAwayRef = useClickAway<any>(() => { if (!loading) setOpen(false); });

	const onAction = async () => {
		setLoading(true);
		promise().then(() => setOpen(false)).finally(() => setLoading(false))
	};

	return <Dialog.Root closeOnInteractOutside={false} open={open} onOpenChange={(details) => setOpen(details.open)}>
		{children && <Dialog.Trigger asChild>{children}</Dialog.Trigger>}

		<Portal>
			<Dialog.Backdrop />

			<Dialog.Positioner>
				<Dialog.Content ref={clickAwayRef}>

					<Dialog.Header><Dialog.Title>{title}</Dialog.Title></Dialog.Header>

					<Dialog.Body><p>{description}</p></Dialog.Body>

					<Dialog.Footer>
						<Dialog.ActionTrigger asChild>
							<Button variant="outline" disabled={loading || disabled}>Отмена</Button>
						</Dialog.ActionTrigger>

						<Button colorPalette="red" disabled={disabled} loading={loading} onClick={onAction}>Подтвердить</Button>
					</Dialog.Footer>

					<Dialog.CloseTrigger disabled={loading} asChild><CloseButton size="sm" /></Dialog.CloseTrigger>
				</Dialog.Content>
			</Dialog.Positioner>

		</Portal>
	</Dialog.Root>;
};
