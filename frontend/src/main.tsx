import { render } from "preact"
import { App } from "@/App"
import { Provider } from "@/components/ui/provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

render(
	<Provider>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</Provider>,
	document.getElementById("app")!
)
