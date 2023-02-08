import { useMutation } from "@tanstack/react-query"
import React from "react"
import { useForm } from "react-hook-form"
import api from "../api/tester_app_backend"
import { CreateRequest, CreateRequestObject, KeyValue, Request } from "../hooks/types"
import queryClient from "../queryCient"
import TestsTable from "./TestsTable"

type RequestProps = {
    data?: Request,
    requestId?: string
}

const RequestForm: React.FC<RequestProps> = ({ data, requestId }) => {

    console.log(data)

    const { register, handleSubmit } = useForm<CreateRequest>()
    const [index, setIndex] = React.useState(1)
    const [key, setKey] = React.useState("")
    const [value, setVal] = React.useState("")
    const [headers, setHeaders] = React.useState<KeyValue[]>(() => { return (data == undefined) ? [] : data.body.headers})
    const [params, setParams] = React.useState<KeyValue[]>(() => { return (data == undefined) ? [] : data.body.params})
    const [seach_params, setSeachParams] = React.useState<KeyValue[]>(() => { return (data == undefined) ? [] : data.seach_params})
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
            "key": key,
            "value": value
        }
        const search_list = seach_params
        search_list.push(search_object)
        setSeachParams(search_list)
        setKey("")
        setVal("")
    }

    const onSubmit = (requestData: CreateRequest) => {
        const body = {
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
                    <select {...register("body.method")} defaultValue={data?.body.method} className="select select-bordered">
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>PATCH</option>
                        <option>DELETE</option>
                    </select>
                </div>
                <div>
                    <input {...register("url")} defaultValue={data?.url} type="text" placeholder="Url" className="input input-bordered w-[900px]" />
                </div>
                <div>
                    <button onClick={handleSubmit(onSubmit)} className="btn">Save</button>
                </div>
                <div>
                    <button className="btn btn-info" onClick={() => {testRequestMutation.mutate(requestId)}}>Test</button>
                </div>
            </div>
            <div className="flex flex-row p-4 space-x-4 w-full">
                <div>
                    <textarea {...register("description")} defaultValue={data?.description} className="textarea textarea-bordered w-[500px]" placeholder="Description"></textarea>
                </div>
                <div>
                    <textarea {...register("body.body")} defaultValue={JSON.stringify(data?.body.body)} className="textarea textarea-bordered w-[500px]" placeholder="Body"></textarea>
                </div>
            </div>
            <div className="flex flex-row p-4 space-x-4 w-full">
                <div className="overflow-x-auto">
                    <div className="tabs pb-2">
                        <a onClick={() => {setIndex(1)}} className={`tab tab-bordered ${ index == 1 ? "tab-active" : ""}`}>Search Params</a> 
                        <a onClick={() => {setIndex(2)}} className={`tab tab-bordered ${ index == 2 ? "tab-active" : ""}`}>Params</a> 
                        <a onClick={() => {setIndex(3)}} className={`tab tab-bordered ${ index == 3 ? "tab-active" : ""}`}>Headers</a>
                    </div>
                    <div className="flex flex-row space-x-2 pb-2">
                        <div>
                            <input value={key} onChange={(e) => {setKey(e.target.value)}} type="text" placeholder="Key" className="input input-bordered" />
                        </div>
                        <div>
                            <input value={value} onChange={(e) => {setVal(e.target.value)}} type="text" placeholder="Value" className="input input-bordered" />
                        </div>
                        <div>
                            <button className="btn" onClick={() => {
                                index == 1 ? handleAddSearch() : index == 2 ? handleAddParams() : handleAddHeaders()
                            }}>Add</button>
                        </div>
                    </div>
                    <table className="table w-full">
                        <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                        </tr>
                        </thead>
                        {
                            index == 1 && (
                                <tbody>
                                    {
                                        seach_params.map((search: KeyValue) => (
                                            <tr>
                                                <th>{search.key}</th>
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
                                        params.map((param: KeyValue) => (
                                            <tr>
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
                                        headers.map((header: KeyValue) => (
                                            <tr>
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
                <textarea readOnly className="textarea textarea-bordered w-[1000px]" value={response} placeholder="Response"></textarea>
            </div>
        </>
    )
}

export default RequestForm