


import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import NFTBox from "./NFTBox"
import Link from "next/link"



// Rindexer Stuff
const GRAPH_QL_QUERY_GET_RECENT_NFTS = `
query AllItemListeds {
  allItemListeds(first: 20, orderBy: [BLOCK_NUMBER_DESC, TX_INDEX_DESC]) {
    nodes {
			rindexerId
      seller
      nftAddress
      price
      tokenId
      contractAddress
      txHash
			blockNumber
    }
  }

  allItemCanceleds {
    nodes {
      nftAddress
      tokenId
    }
  }

  allItemBoughts {
    nodes {
      nftAddress
      tokenId
    }
  }
}
`

interface NFTItem {
	rindexerId: string
	seller: string
	nftAddress: string
	price: string
	tokenId: string
	contractAddress: string
	txHash: string
	blockNumber: string
}

interface NFTItemShort {
	nftAddress: string
	tokenId: string
}

interface NFTQueryResponse {
	data: {
		allItemListeds: {
			nodes: NFTItem[]
		},
		allItemCanceleds: {
			nodes: NFTItemShort[]
		},
		allItemBoughts: {
			nodes: NFTItemShort[]
		} 
	}
}

async function fetchNFTs(): Promise<NFTQueryResponse> {
	const response = await fetch("/api/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			query: GRAPH_QL_QUERY_GET_RECENT_NFTS
		})
	})

	return await response.json()
}

function useRecenlyListedNFTs() {
	const { data, isLoading, error } = useQuery<NFTQueryResponse>({
		queryKey: ["recentNFTs"],
		queryFn: fetchNFTs
	})

	const nftList = useMemo(() => {
		if (!data) return []

		const boughtNFTs = new Set<string>()
		const cancelledNFTs = new Set<string>()

		data.data.allItemBoughts.nodes.forEach(item => {
			boughtNFTs.add(`${item.nftAddress}—${item.tokenId}`)
		})

		data.data.allItemCanceleds.nodes.forEach(item => {
			boughtNFTs.add(`${item.nftAddress}—${item.tokenId}`)
		})

		const availableNFTs = data.data.allItemListeds.nodes.filter(item => {
			if (!item.nftAddress || !item.tokenId) return false
			const key = `${item.nftAddress}—${item.tokenId}`
			return !boughtNFTs.has(key) && !cancelledNFTs.has(key)
		})

		return availableNFTs.map(nft => ({
			tokenId: nft.tokenId,
			contractAddress: nft.contractAddress,
			price: nft.price
		}))
	}, [data])

	return { nftList, isLoading, error }
}



// Main component that uses the custom hook
export default function RecentlyListedNFTs() {

		const { nftList, error, isLoading } = useRecenlyListedNFTs()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mt-8 text-center">
                <Link
                    href="/list-nft"
                    className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    List Your NFT
                </Link>
            </div>
            <h2 className="text-2xl font-bold mb-6">Recently Listed NFTs</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                { nftList.map(nft => (
									<Link key={`${nft.contractAddress}—${nft.tokenId}`} href={`/buy-nft/${nft.contractAddress}/${nft.tokenId}`}>
										<NFTBox 
											key={`${nft.contractAddress}—${nft.tokenId}`}
											tokenId={nft.tokenId}
											contractAddress={nft.contractAddress}
											price={nft.price}
										/>
									</Link>
								))}
            </div>
        </div>
    )
}