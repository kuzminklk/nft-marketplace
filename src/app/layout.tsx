import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/Header"
import { type ReactNode/* , useEffect, useState */ } from "react"
import { Providers } from "./providers"
import { useAccount } from "wagmi"

export const metadata: Metadata = {
	title: "NftMarketplace",
	description: "A non-custodial marketplace for NFTs",
}

export default function RootLayout(props: { children: ReactNode }) {

/* 	const [isApproved, setIsApproved] = useState(false)

	const { address } = useAccount()

	async function checkCompliance() {
		if (!address) return

		const reponse = await fetch("/api/compliance", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ address })
		})

		const result = await reponse.json()

		setIsApproved(result.success && result.isApproved)
	}

	useEffect(() => {
		if (address) { checkCompliance() }
	}, [address]) */


	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/nft-marketplace.png" sizes="any" />
			</head>
			<body className="bg-zinc-50">
				<Providers>
					<Header />
					{/* { 
					isApproved ? 
						props.children : 
						<h1>Access denied</h1>
					}	 */}
					{ props.children }
				</Providers>
			</body>
		</html>
	)
}
