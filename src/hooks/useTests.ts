import api from "../api/tester_app_backend";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query"
import { Test } from "./types";

async function fetchTests (ctx: QueryFunctionContext) {
    const [_,requestId] = ctx.queryKey
    const { data } = await api.get<Test[]>(`/requests/${requestId}/tests/`)
    return data
}

export function useFetchTests (requestId: string = "0") {
    return useQuery(["tests",requestId], fetchTests)
}