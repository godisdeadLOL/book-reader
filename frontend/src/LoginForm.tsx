import { Box, Button, Center, Heading } from "@chakra-ui/react"
import { PasswordInput } from "./components/ui/password-input"
import { useSessionStorage } from "@uidotdev/usehooks"
import { useState } from "preact/hooks"

export const LoginForm = () => {
	const [value, setValue] = useState("")
	const [token, setToken] = useSessionStorage<string | null>("token", null)

	return (
		<Center h={"100dvh"} p={4}>
			<Box w="100%" maxW="sm" bg={"Background"} border={"ActiveBorder"} borderStyle={"solid"} borderWidth={1} rounded="sm" p={4}>
				<Heading textAlign="center" mb={8}>
					{token ? "Токен введен" : "Введите токен"}
				</Heading>

				{token ? (
					<Button onClick={() => setToken(null)} w={"100%"} alignSelf={"stretch"} colorPalette="red">
						Очистить
					</Button>
				) : (
					<>
						<PasswordInput value={value} onChange={(e) => setValue(e.currentTarget.value)} />
						<Button onClick={() => setToken(value)} w={"100%"} alignSelf={"stretch"} mt={6} colorPalette="green">
							Сохранить
						</Button>
					</>
				)}
			</Box>
		</Center>
	)
}
