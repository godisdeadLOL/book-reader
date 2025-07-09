import { Box, HStack } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "preact/hooks"

type AppbarProps = {
	hideOnScroll?: boolean
	children: any
}
export const Appbar = ({ hideOnScroll=false, children }: any) => {
	const [hidden, setHidden] = useState(false)

	const lastScroll = useRef(0)

	useEffect(() => {
		if(!hideOnScroll) return

		lastScroll.current = window.scrollY

		const handleScroll = () => {
			const current = window.scrollY
			const delta = current - lastScroll.current

			setHidden(current > 64 && delta > 0)

			lastScroll.current = current
		}

		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	return (
		<Box transition="all 0.4s" style={{ translate: hidden ? "0% -100%" : "0% 0%" }} position={"sticky"} backgroundColor={"Background"} zIndex="max" top={0} px={4} h={14} borderBottom={1} borderStyle={"solid"} borderColor={"border"} asChild>
			<HStack gap={3} >
				{children}
			</HStack>
		</Box>
	)
}
