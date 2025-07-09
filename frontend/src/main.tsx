import { render } from "preact"
import { App } from "@/App"
import { Provider } from "@/components/ui/provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "preact/compat"

const queryClient = new QueryClient()

render(
	<React.StrictMode>
		<Provider>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById("app")!
)
