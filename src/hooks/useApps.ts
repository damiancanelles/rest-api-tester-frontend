import api from "../api/tester_app_backend";
import { useQuery } from "@tanstack/react-query"
import { App } from "./types";
async function fetchApps () {
    const { data } = await api.get<App[]>(`/apps/`)
    return data
}

export function useFetchApps () {
    return useQuery(["apps"], fetchApps)
}