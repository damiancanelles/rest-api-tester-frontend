import Navbar from "../components/Navbar"
import { Outlet, useParams } from 'react-router-dom';
import { useFetchRequests } from "../hooks/useRequests";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../queryCient";
import api from "../api/tester_app_backend";
import { Link } from "react-router-dom";

type AppParams = {
    appId: string;
};

function Dashboard() {
    const { appId } = useParams<AppParams>()
    const { data, isLoading, isError } = useFetchRequests(appId)
    const [name, setName] = React.useState("")

    const createRequestMutation = useMutation({
        mutationFn: async (name: string) => {
            const request = await api.post(`/apps/${appId}/request/`,{
                name: name,
                frecuency: "nunca",
                url: "",
                description: "",
                seach_params: [],
                body: {
                    method: "GET",
                    headers: [],
                    params: [],
                    body: {}
                }
            })
            return request.data
        },
        async onSuccess () {
            await queryClient.invalidateQueries(["requests"])
        }
    })

    const deleteRequestMutation = useMutation({
        mutationFn: async (request_id: number) => {
            const request = await api.delete(`/apps/request/${request_id}/`)
            return request.data
        },
        async onSuccess () {
            await queryClient.invalidateQueries(["requests"])
        }
    })

    const handleCreateRequest = () => {
        createRequestMutation.mutate(name)
        setName("")
    }

    if (isLoading) {
        return <div> ...Loading </div>
    }

    return (
        <div data-theme="cmyk" className="h-screen">
            <Navbar></Navbar>
            <div className="flex flex-row">
                <div className="h-screen w-80 bg-base-300 border-r-4 border-base-300">
                    <div className="flex flex-row">
                            <input type="text" placeholder="Agrega una petición" className="input w-full max-w-xs m-2" value={name} onChange={(e) => {setName(e.target.value)}} />
                            <div className="btn btn-ghost m-2" onClick={() => {handleCreateRequest()}}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                    </div>
                    <ul className="menu px-2 text-base-content">
                    {
                        data?.map((data) => {
                            const link = `/apps/${appId}/request/${data.id}`
                            return (
                            <li key={data.id}>
                                <div className="flex flex-row">
                                    <div>
                                        {data.body.method}
                                    </div>
                                    <Link to={link} onClick={() => {queryClient.invalidateQueries(["request",data.id.toString()])}}>
                                        {data.name}
                                    </Link>
                                    <div className="btn btn-ghost" onClick={() => {deleteRequestMutation.mutate(data.id)}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </div>
                                </div>
                            </li>
                        )})
                    }
                    </ul>
                </div>
                <div>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    )
}

export default Dashboard