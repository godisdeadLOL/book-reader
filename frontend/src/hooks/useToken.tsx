import { useSessionStorage } from "@uidotdev/usehooks"

export const useToken = () => {
	const [token] = useSessionStorage<string | null>("token", null)
    return token
}
