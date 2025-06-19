import { Button, IconButton } from "@chakra-ui/react"

export const AdaptiveButton = ({ label, icon, onClick = null, variant = "subtle", size="sm", colorPalette = "gray", disabled = false }: any) => {
	return (
		<>
			<Button disabled={disabled} onClick={onClick} display={{ base: "none", md: "flex" }} size={size} colorPalette={colorPalette} variant={variant}>
				{icon} {label}
			</Button>

			<IconButton disabled={disabled} onClick={onClick} display={{ md: "none" }} colorPalette={colorPalette} variant={variant}>
				{icon}
			</IconButton>
		</>
	)
}
