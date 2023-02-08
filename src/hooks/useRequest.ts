import api from "../api/tester_app_backend";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query"
import { Request } from "./types";

async function fetchRequest (ctx: QueryFunctionContext) {
    const [_,requestId] = ctx.queryKey
    const { data } = await api.get<Request>(`/requests/${requestId}/`)
    return data
}

export function useFetchRequest (requestId: string = "0") {
    return useQuery(["request",requestId], fetchRequest)
}