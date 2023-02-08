import { useMutation } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { useFetchApps } from "../hooks/useApps"
import api from "../api/tester_app_backend"
import queryClient from "../queryCient"
import React from "react"

interface AppI {
    name: string
    id: number
}

const AppsTable = () => {
    const [appName, setAppName] = React.useState("")
    const { data, isLoading } = useFetchApps()
    
    const createAppMutation = useMutation({
        mutationFn: async (appName: string) => {
            const request = await api.post(`/apps/`,{ name: appName })
            return request.data
        },
        async onSuccess () {
            await queryClient.invalidateQueries(["apps"])
        }
    })
    
    const deteleAppMutation = useMutation({
        mutationFn: async (request_id: number) => {
            const request = await api.delete(`/apps/${request_id}/`)
            return request.data
        },
        async onSuccess () {
            await queryClient.invalidateQueries(["apps"])
        }
    })

    const handleCreateApp = async () => {
        await createAppMutation.mutate(appName)
        setAppName("")
    }

    if (isLoading) {
        return <div> ...Loading </div>
    }

    return (
        <div className="overflow-x-auto m-10 rounded border-2 border-base-300">
            <table className="table w-full">
                <thead>
                <tr>
                    <th align="left">Name</th>
                    <th>
                        <div className="flex flex-row justify-end">
                            <input type="text" placeholder="Add new app" className="input w-full max-w-xs" value={appName} onChange={(e) => {setAppName(e.target.value)}} />
                            <div className="btn btn-ghost" onClick={() => {handleCreateApp()}}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    data?.map((app: AppI) => {
                        const link = `/apps/${app.id}`
                        return (
                            <tr key={app.id}>
                                <td align="left">
                                <Link
                                        to={link} 
                                    >{app.name}</Link>
                                </td>
                                <td>
                                    <div className="flex flex-row justify-end">
                                        <div className="btn btn-ghost" onClick={() => {deteleAppMutation.mutate(app.id)}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
</div>
    )
}

export default AppsTable