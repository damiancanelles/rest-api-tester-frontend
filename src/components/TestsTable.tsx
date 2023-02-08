import { useFetchTests } from "../hooks/useTests"

interface TableProps {
    requestId?: string
}

const TestsTable: React.FC<TableProps> = ({ requestId }) => {
    const { data, isLoading } = useFetchTests(requestId)

    if (isLoading) {
        return <div> ...Loading </div>
    }

    return (
        <table className="table w-full">
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Datetime</th>
                </tr>
            </thead>
            <tbody>
                {   
                    data?.map((test) => (
                        <tr key={test.id}>
                            <td>{test.passed ? <div className="badge badge-info">Pass</div> : <div className="badge badge-secondary">Error</div>}</td>
                            <td>{test.created_date}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default TestsTable