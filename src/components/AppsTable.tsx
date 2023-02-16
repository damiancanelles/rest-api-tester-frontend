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
                    <th align="left">Nombre</th>
                    <th>
                        <div className="flex flex-row justify-end">
                            <input type="text" placeholder="Crea una nueva aplicación" className="input w-full max-w-xs" value={appName} onChange={(e) => {setAppName(e.target.value)}} />
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
                        const linkTests = `/apps/${app.id}/tests/`
                        return (
                            <tr key={app.id}>
                                <td align="left">
                                <Link
                                        to={link} 
                                    >{app.name}</Link>
                                </td>
                                <td>
                                    <div className="flex flex-row justify-end">
                                        <div className="btn btn-ghost">
                                            <Link to={linkTests}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 10-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25L12.75 9" />
                                                </svg>
                                            </Link>
                                        </div>
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