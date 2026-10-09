import { v4 as uuid } from "uuid"

export async function POST(request: Request) {
	try {
		const { address } = await request.json()

		if (!address) {
			return Response.json({ success: false, message: "Address is requred" }, { status: 400 })
		}

		const idempotencyKey = uuid()

		const apiKey = process.env.CIRCLE_API_KEY

		const response = await fetch("https://api.circle.com/v1/w3s/compliance/screening/addresses", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				idempotencyKey,
				address,
				chain: "ETH-SEPOLIA",
			}),
		})

		const data = await response.json()

		const isApproved = data?.data?.result === "APPROVED"

		return Response.json({
			success: true,
			isApproved,
			data: data?.data,
		})
	} catch (error) {
		return Response.json(
			{
				success: false,
			},
			{
				status: 500,
			},
		)
	}
}
