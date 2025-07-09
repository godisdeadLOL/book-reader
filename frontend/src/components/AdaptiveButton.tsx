import { Button, chakra, IconButton } from "@chakra-ui/react"
import { forwardRef } from "preact/compat"

const AdaptiveButtonBase = ({ label, icon, ...other }: any) => {
	return (
		<>
			<Button display={{ base: "none", md: "flex" }} {...other} >
				{icon} {label}
			</Button>

			<IconButton display={{ md: "none" }} {...other}>
				{icon}
			</IconButton>
		</>
	)
}

export const AdaptiveButton = chakra(AdaptiveButtonBase)