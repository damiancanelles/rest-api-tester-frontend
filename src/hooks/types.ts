export interface Repos {
    id: number
    name: string
    html_url: string
    language: string
    description: string
}

export interface Profile {
    login: string
    avatar_url: string
    html_url: string
    name: string
    location: string
    bio: string
}

export interface App {
    name: string
    id: number
}

export interface KeyValue {
    key: string
    value: string
}

export interface RequestBody {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    headers: KeyValue[]
    params: KeyValue[]
    body: object
}

export interface CreateRequestBody {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
    headers: KeyValue[]
    params: KeyValue[]
    body: string
}

export interface Request {
    id: number
    url: string
    description: string
    body: RequestBody
    seach_params: KeyValue[]
}

export interface CreateRequest {
    url: string
    description: string
    body: CreateRequestBody
    seach_params: KeyValue[]
}

export interface CreateRequestObject {
    url: string
    description: string
    body: RequestBody
    seach_params: KeyValue[]
}

export interface Test {
    id: number
    passed: boolean
    response: object
    created_date: string
}