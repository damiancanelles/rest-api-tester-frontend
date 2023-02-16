import { useMutation } from "@tanstack/react-query"
import React from "react"
import api from "../api/tester_app_backend"
import { Request, SimpleTest } from "../hooks/types"
import queryClient from "../queryCient"

interface TableProps {
    data?: Request[]
}

const CustomTestsTable: React.FC<TableProps> = ({ data }) => {
    const [tests, setTests] = React.useState<SimpleTest[]>([])

    const handleAddTest = (id: number, passed: boolean, created_date: string) => {
        const test = {
            id: id,
            passed: passed,
            created_date: created_date
        }
        const test_list = tests
        test_list.push(test)
        setTests(test_list)
    }

    const testRequestMutation = useMutation({
        mutationFn: async (requestId: number = 0) => {
            const request = await api.get(`/requests/${requestId}/test/`)
            handleAddTest(request.data.id, request.data.passed, request.data.created_date)
            return request.data
        },
        async onSuccess () {
            await queryClient.invalidateQueries(["tests"])
        }
    })

    const handleStart = () => {
        setTests([])
        data?.map(async (request) => {
            await testRequestMutation.mutate(request.id)
        })
    }

    return (
        <div className="overflow-x-auto m-10 rounded border-2 border-base-300">
            <table className="table w-full">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Fecha y Hora</th>
                        <th>
                            <div className="flex flex-row justify-end">
                                <div className="btn btn-ghost" onClick={() => {handleStart()}}>
                                    Iniciar
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {   
                        tests?.map((test, index: number) => (
                            <tr key={index}>
                                <td>{data ? data[index].name : ""}</td>
                                <td>{test.passed ? <div className="badge badge-info">Exitoso</div> : <div className="badge badge-secondary">Fallido</div>}</td>
                                <td>{test.created_date}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default CustomTestsTable