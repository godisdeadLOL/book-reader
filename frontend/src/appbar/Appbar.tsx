import { AppbarBase } from "@/appbar/AppbarBase"
import { AdaptiveButton } from "@/components/AdaptiveButton"
import { Title } from "@/components/Title"
import { ColorModeButton } from "@/components/ui/color-mode"
import { useCurrentParams } from "@/hooks/queries"
import { useToken } from "@/hooks/useToken"
import { IconButton } from "@chakra-ui/react"
import { LuArrowLeft, LuBookCopy, LuBookPlus, LuBook } from "react-icons/lu"
import { useLocation, useNavigate } from "react-router"

export const Appbar = ({ title }: any) => {
	const { book_id } = useCurrentParams()
	const token = useToken()

	const { pathname } = useLocation()
	let mode: string | null = pathname.split("/").slice(-1)[0]
	if (["book_create", "book_edit", "chapter_create", "chapter_edit"].indexOf(mode) == -1) mode = null

	const navigate = useNavigate()
	const navigateBack = () => {
		if (!!mode) {
			if (!!book_id) navigate(`/${book_id}`)
			else navigate("/")
		} else {
			navigate("/")
		}
	}

	const backButton = (!!mode || !!book_id) && (
		<IconButton onClick={navigateBack} variant={"ghost"} size={"xs"}>
			<LuArrowLeft />
		</IconButton>
	)

	const controls = (
		<>
			{!!token && !book_id && <AdaptiveButton onClick={() => navigate(`/book_create`)} label={"Добавить книгу"} icon={<LuBookCopy />} variant="subtle" />}
			{!!token && !!book_id && <AdaptiveButton onClick={() => navigate(`/${book_id}/chapter_create`)} label={"Добавить главу"} icon={<LuBookPlus />} variant="subtle" />}
			<AdaptiveButton onClick={() => navigate("/")} colorPalette={"blue"} label={"Каталог"} icon={<LuBook />} variant="solid" />
			<ColorModeButton />
		</>
	)

	return <AppbarBase backButton={backButton} title={<Title>{title}</Title>} controls={controls} />
}
