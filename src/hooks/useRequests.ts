import api from "../api/tester_app_backend";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query"
import { Request } from "./types";

async function fetchRequests (ctx: QueryFunctionContext) {
    const [_,appId] = ctx.queryKey
    const { data } = await api.get<Request[]>(`/apps/${appId}/request/`)
    return data
}

export function useFetchRequests (appId: string = "0") {
    return useQuery(["requests",appId], fetchRequests)
}