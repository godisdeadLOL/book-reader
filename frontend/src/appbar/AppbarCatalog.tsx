import { Appbar } from "@/appbar/Appbar"
import { AdaptiveButton } from "@/components/AdaptiveButton"
import { Title } from "@/components/Title"
import { ColorModeButton } from "@/components/ui/color-mode"
import { useCurrentParams } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { Box, IconButton } from "@chakra-ui/react"
import { LuArrowLeft, LuBookCopy, LuBookPlus, LuBook } from "react-icons/lu"
import { useNavigate } from "react-router"

export const AppbarCatalog = ({ title }: any) => {
	const { bookId, mode } = useCurrentParams()
	const token = useToken()

	const navigate = useNavigate()
	const navigateBack = () => {
		if (!!mode) {
			if (bookId) navigate(`/${bookId}`)
			else navigate("/")
		} else {
			navigate("/")
		}
	}

	return <Appbar>
		{(mode || !!bookId) && <IconButton variant="ghost" size="xs" onClick={navigateBack}>
			<LuArrowLeft />
		</IconButton>}

		<Title display={(bookId || mode) ? "none" : "block"} sm={{ display: "block" }}>{title ?? document.title}</Title>

		<Box mx="auto" />

		{token && !bookId && <AdaptiveButton onClick={() => navigate(`/book_create`)} label={"Добавить книгу"} icon={<LuBookCopy />} variant="subtle" />}
		{token && bookId && <AdaptiveButton onClick={() => navigate(`/${bookId}/chapter_create`)} label={"Добавить главу"} icon={<LuBookPlus />} variant="subtle" />}

		<AdaptiveButton onClick={() => navigate("/")} colorPalette={"blue"} label={"Каталог"} icon={<LuBook />} variant="solid" />
		<ColorModeButton />
	</Appbar>
}
