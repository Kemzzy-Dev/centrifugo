"use server"

import appConfig from "@/config/appConfig";
import { CheckoutPayloadType, ApiResponseType } from "@/types";

const API_BASE_URL = appConfig.API_BASE_URL
export async function processCheckout(checkoutPayload: CheckoutPayloadType) {
    try {
        const request = await fetch(`${API_BASE_URL}/checkout`,{
            headers: {
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(checkoutPayload)
        })
        const response: ApiResponseType = await request.json()   
        return { statusCode: response.status_code, message: response.message}
    } catch (error) {
        console.log('Checkout error',error)
    }
    
}