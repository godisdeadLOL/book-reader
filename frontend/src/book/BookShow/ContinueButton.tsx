import { useCurrentParams } from "@/hooks/queries"
import { useBookmarkData } from "@/hooks/useBookmark"
import { useNavigateChapter } from "@/hooks/useNavigateChapter"
import { isSameChapter } from "@/types"
import { chakra, Menu, Icon, ButtonGroup, Button, Box, IconButton } from "@chakra-ui/react"
import { useClickAway } from "@uidotdev/usehooks"
import { useState } from "preact/hooks"
import { LuBookmark, LuBookOpen, LuChevronDown, LuEye } from "react-icons/lu"
import { Link, useNavigate } from "react-router"

const ContinueButtonMenu = chakra(({ activeBookmark, passiveBookmark, open, setOpen, ...other }: any) => {
    const ref = useClickAway(() => setOpen?.(false))

    const { generatePath } = useNavigateChapter()
    return <Menu.Root open={open}>
        <Menu.Content ref={ref} {...other}>

            <Menu.Item value="menu" asChild>
                <Link to={generatePath(passiveBookmark)}>
                    <Icon color="red.400"><LuEye /></Icon>
                    {passiveBookmark.getRepr()}
                </Link>
            </Menu.Item>

            <Menu.Item value="lol" asChild>
                <Link to={generatePath(activeBookmark)}>
                    <Icon color="red.400"><LuBookmark /></Icon>
                    {activeBookmark.getRepr()}
                </Link>
            </Menu.Item>

        </Menu.Content>
    </Menu.Root>
})

export const ContinueButton = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    const { bookId } = useCurrentParams()

    const { activeBookmark, passiveBookmark } = useBookmarkData(bookId!)
    const latestChapter = (!!activeBookmark?.chapter && !!passiveBookmark) ?
        (activeBookmark.chapter.isLater(passiveBookmark) ? activeBookmark.chapter : passiveBookmark) :
        (activeBookmark?.chapter || passiveBookmark)

    const displayContext = !!activeBookmark?.chapter && !!passiveBookmark && !isSameChapter(activeBookmark.chapter, passiveBookmark)
    const { generatePath } = useNavigateChapter()

    return <ButtonGroup size="xs" variant="outline" attached position="relative" zIndex={10}>
        {displayContext && <ContinueButtonMenu
            activeBookmark={activeBookmark.chapter}
            passiveBookmark={passiveBookmark}
            open={menuOpen} setOpen={setMenuOpen} position="absolute" top="calc(100% + 0.5rem)" left={0} w="100%"
        />}

        <Button asChild>
            <Link to={generatePath(latestChapter!)}>
                <LuBookOpen />

                <Box>
                    Продолжить
                    <chakra.span ml={1} fontSize="x-small" fontFamily="mono" verticalAlign="baseline">{latestChapter?.getRepr()}</chakra.span>
                </Box>

                {/* display={"none"} md={{ display: "block" }}
                <Box md={{ display: "none" }}>
                    {latestChapter?.getRepr()}
                </Box> */}
            </Link>
        </Button>

        {displayContext && <IconButton onClick={() => setMenuOpen(true)}><LuChevronDown /></IconButton>}
    </ButtonGroup >
}