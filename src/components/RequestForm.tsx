import { useMutation } from "@tanstack/react-query"
import React from "react"
import { useForm } from "react-hook-form"
import api from "../api/tester_app_backend"
import { CreateRequest, CreateRequestObject, KeyValue, Request, SearchParam } from "../hooks/types"
import queryClient from "../queryCient"
import TestsTable from "./TestsTable"

type RequestProps = {
    data?: Request,
    requestId?: string
}

const RequestForm: React.FC<RequestProps> = ({ data, requestId }) => {

    const { register, handleSubmit } = useForm<CreateRequest>()
    const [index, setIndex] = React.useState(1)
    const [key, setKey] = React.useState("")
    const [value, setVal] = React.useState("")
    const [keySearch, setKeySearch] = React.useState("status")
    const [valueSearch, setValSearch] = React.useState("")
    const [relationSearch, setRelationSearch] = React.useState("igual")
    const [name, _] = React.useState<string>(() => { return (data == undefined) ? "" : data.name})
    const [headers, setHeaders] = React.useState<KeyValue[]>(() => { return (data == undefined) ? [] : data.body.headers})
    const [params, setParams] = React.useState<KeyValue[]>(() => { return (data == undefined) ? [] : data.body.params})
    const [seach_params, setSeachParams] = React.useState<SearchParam[]>(() => { return (data == undefined) ? [] : data.seach_params})
    const [response, setResponse] = React.useState("{}")

    const testRequestMutation = useMutation({
        mutationFn: async (requestId: string = "0") => {
            const request = await api.get(`/requests/${requestId}/test/`)
            return request.data
        },
        async onSuccess () {
            await queryClient.invalidateQueries(["tests"])
        }
    })

    const updateRequestMutation = useMutation({
        mutationFn: async (body: CreateRequestObject) => {
            const request = await api.patch(`/requests/${requestId}/`,body)
            return request.data
        },
        async onSuccess () {
            await queryClient.invalidateQueries(["requests"])
            setResponse(JSON.stringify(updateRequestMutation.data.response))
        }
    })

    const handleAddHeaders = () => {
        const object = {
            "key": key,
            "value": value
        }
        const headers_list = headers
        headers_list.push(object)
        setHeaders(headers_list)
        setKey("")
        setVal("")
    }

    const handleAddParams = () => {
        const object = {
            "key": key,
            "value": value
        }
        const params_list = params
        params_list.push(object)
        setParams(params_list)
        setKey("")
        setVal("")
    }

    const handleAddSearch = () => {
        const search_object = {
            "key": keySearch,
            "value": valueSearch,
            "relation": relationSearch
        }
        const search_list = seach_params
        search_list.push(search_object)
        setSeachParams(search_list)
        setKeySearch("status")
        setValSearch("")
        setRelationSearch("igual")
    }

    const onSubmit = (requestData: CreateRequest) => {
        const body = {
            name: name,
            frecuency: requestData.frecuency,
            url: requestData.url,
            seach_params: seach_params,
            description: requestData.description,
            body: {
                method: requestData.body.method,
                params: params,
                headers: headers,
                body: JSON.parse(requestData.body.body)
            }
        }
        updateRequestMutation.mutate(body)
    }

    return (
        <>
            <div className="flex flex-row p-4 space-x-4 w-full">
                <div>
                    <label className="label">
                        <span className="label-text">Método</span>
                    </label>
                    <select {...register("body.method")} defaultValue={data?.body.method} className="select select-bordered">
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>PATCH</option>
                        <option>DELETE</option>
                    </select>
                </div>
                <div>
                    <label className="label">
                        <span className="label-text">Url</span>
                    </label>
                    <input {...register("url")} defaultValue={data?.url} type="text" placeholder="Url" className="input input-bordered w-[900px]" />
                </div>
                <div className="pt-9">
                    <button onClick={handleSubmit(onSubmit)} className="btn">Save</button>
                </div>
                <div className="pt-9">
                    <button className="btn btn-info" onClick={() => {testRequestMutation.mutate(requestId)}}>Test</button>
                </div>
            </div>
            <div className="flex flex-row p-4 space-x-4 w-full">
                <div>
                    <label className="label">
                        <span className="label-text">Descripción</span>
                    </label>
                    <textarea {...register("description")} defaultValue={data?.description} className="textarea textarea-bordered w-[500px]" placeholder="Descripción"></textarea>
                </div>
                <div>
                    <label className="label">
                        <span className="label-text">JSON</span>
                    </label>
                    <textarea {...register("body.body")} defaultValue={JSON.stringify(data?.body.body)} className="textarea textarea-bordered w-[500px]" placeholder="JSON"></textarea>
                </div>
                <div>
                    <label className="label">
                        <span className="label-text">Frecuencia</span>
                    </label>
                    <select {...register("frecuency")} defaultValue={data?.frecuency} className="select select-bordered">
                        <option>nunca</option>
                        <option>diario</option>
                        <option>semanal</option>
                        <option>mensual</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-row p-4 space-x-4 w-full">
                <div className="overflow-x-auto">
                    <div className="tabs pb-2">
                        <a onClick={() => {setIndex(1)}} className={`tab tab-bordered ${ index == 1 ? "tab-active" : ""}`}>Search Params</a> 
                        <a onClick={() => {setIndex(2)}} className={`tab tab-bordered ${ index == 2 ? "tab-active" : ""}`}>Params</a> 
                        <a onClick={() => {setIndex(3)}} className={`tab tab-bordered ${ index == 3 ? "tab-active" : ""}`}>Headers</a>
                    </div>
                    {
                        index != 1 && (
                            <div className="flex flex-row space-x-2 pb-2">
                                <div>
                                    <input value={key} onChange={(e) => {setKey(e.target.value)}} type="text" placeholder="Clave" className="input input-bordered" />
                                </div>
                                <div>
                                    <input value={value} onChange={(e) => {setVal(e.target.value)}} type="text" placeholder="Valor" className="input input-bordered" />
                                </div>
                                <div>
                                    <button className="btn" onClick={() => {
                                        index == 2 ? handleAddParams() : handleAddHeaders()
                                    }}>Agregar</button>
                                </div>
                            </div>
                        )
                    }
                    {
                        index == 1 && (
                            <div className="flex flex-row space-x-2 pb-2">
                                <div>
                                    <select defaultValue={"status"} value={keySearch} onChange={(e) => {setKeySearch(e.target.value)}} className="select select-bordered">
                                        <option>status</option>
                                        <option>body</option>
                                        <option>headers</option>
                                        <option>params</option>
                                    </select>
                                </div>
                                <div>
                                    <select value={relationSearch} onChange={(e) => {setRelationSearch(e.target.value)}} className="select select-bordered">
                                        <option>igual</option>
                                        <option>contiene</option>
                                        <option>menor</option>
                                        <option>mayor</option>
                                    </select>
                                </div>
                                <div>
                                    <input value={valueSearch} onChange={(e) => {setValSearch(e.target.value)}} type="text" placeholder="Valor" className="input input-bordered" />
                                </div>
                                <div>
                                    <button className="btn" onClick={() => {
                                        handleAddSearch()
                                    }}>Agregar</button>
                                </div>
                            </div>
                        )
                    }
                    <table className="table w-full">
                        <thead>
                        {
                            index != 1 && (
                                <tr>
                                    <th>Clave</th>
                                    <th>Valor</th>
                                </tr>
                            )
                        }
                        {
                            index == 1 && (
                                <tr>
                                    <th>Clave</th>
                                    <th>Relación</th>
                                    <th>Valor</th>
                                </tr>
                            )
                        }
                        </thead>
                        {
                            index == 1 && (
                                <tbody>
                                    {
                                        seach_params.map((search: SearchParam, index: number) => (
                                            <tr key={index}>
                                                <th>{search.key}</th>
                                                <th>{search.relation}</th>
                                                <th>{search.value}</th>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            )
                        }
                        {
                            index == 2 && (
                                <tbody>
                                    {
                                        params.map((param: KeyValue, index: number) => (
                                            <tr key={index}>
                                                <th>{param.key}</th>
                                                <th>{param.value}</th>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            )
                        }
                        {
                            index == 3 && (
                                <tbody>
                                    {
                                        headers.map((header: KeyValue, index: number) => (
                                            <tr key={index}>
                                                <th>{header.key}</th>
                                                <th>{header.value}</th>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            )
                        }
                    </table>
                </div>
                <div className="w-[500px]">
                    <TestsTable requestId={requestId}></TestsTable>
                </div>
            </div>
            <div className="p-4 space-x-4 w-full">
                <label className="label">
                    <span className="label-text">Respuesta</span>
                </label>
                <textarea readOnly className="textarea textarea-bordered w-[1000px]" value={response} placeholder="Respuesta"></textarea>
            </div>
        </>
    )
}

export default RequestForm