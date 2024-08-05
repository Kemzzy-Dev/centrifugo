'use server'
import appConfig from "@/config/appConfig";
import { CategoryType, ProductType, ProductUploadType, ApiResponseType } from "@/types";

const API_BASE_URL = appConfig.API_BASE_URL

export async function getAllProducts() {
    try {
        const request = await fetch(`${API_BASE_URL}/products`)
        const response: ApiResponseType = await request.json()
        const products: ProductType[] = response.result.products

        return { data: products }
    } catch (error) {
        throw error
    }
}

export async function createProduct(payload: any) {
    try {
        const request = await fetch(`${API_BASE_URL}/product/create`,{
            method: "POST",
            body: payload
        })
        const response: ApiResponseType = await request.json()
        return { ...response, statusCode: response.status_code }

    } catch (error) {
        throw new Error(JSON.stringify(error))
    }
}

export async function updateProduct({ identifier, payload }:{identifier: string, payload: any}) {
    try {
        const request = await fetch(`${API_BASE_URL}/product/update/${identifier}`,{
            method: "PATCH",
            body: payload
        })
        const response: ApiResponseType = await request.json()
        return { ...response, statusCode: response.status_code }

    } catch (error) {
        throw new Error(JSON.stringify(error))
    }
}

export async function getProductById(id: string) {
    try {
        const request = await fetch(`${API_BASE_URL}/products/${id}`)
        const response: ApiResponseType = await request.json()
        return { ...response, statusCode: response.status_code}
    } catch (error) {
        throw error
    }
}

export async function getAllCategories() {
    try {
        const request = await fetch(`${API_BASE_URL}/categories`);
        const response: ApiResponseType = await request.json()
        const categories: CategoryType[] = response.result
        return {data: categories}
    } catch (error) {
        throw error
    }
}