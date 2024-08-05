"use server"

import appConfig from "@/config/appConfig"
import { ApiResponseType } from "@/types"


const API_BASE_URL = appConfig.API_BASE_URL
export async function fetchOrders() {
    try {
        const request = await fetch(`${API_BASE_URL}/orders`)
        const response: ApiResponseType = await request.json()   
        return response
    } catch (error) {
        console.log('Checkout error',error)
    }
    
}


export async function fetchSingleOrders(orderId: string) {
    try {
        const request = await fetch(`${API_BASE_URL}/orders/${orderId}`)
        const response: ApiResponseType = await request.json()   
        
        return response
    } catch (error) {
        console.log('Checkout error',error)
    }
    
}

type UpdateType = {
    orderId: string,
    status: string,
    payment_status: string
}

export async function updateOrder({orderId, status, payment_status }: UpdateType) {
    const payload = {payment_status, status}
    try {
        const request = await fetch(`${API_BASE_URL}/order/update/${orderId}`,{
            method: "post",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const response: ApiResponseType = await request.json()   
        console.log(response)
        return response
    } catch (error) {
        console.log('Checkout error',error)
    }
    
}