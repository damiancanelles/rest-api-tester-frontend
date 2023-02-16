import { useParams } from "react-router-dom"
import CustomTestsTable from "../components/CustomTestTable"
import Navbar from "../components/Navbar"
import { useFetchRequests } from "../hooks/useRequests"

type AppsProps = {
    appId: string
}

function Tests() {
    const { appId } = useParams<AppsProps>()
    const { data, isLoading, isRefetching } = useFetchRequests(appId)
    
    if (isLoading) {
        return <div> ...Loading </div>
    }
    if (isRefetching) {
        return <div> ...Refetching </div>
    }
    else {
        return (
            <div data-theme="cmyk" className="h-screen">
                <Navbar></Navbar>
                <CustomTestsTable data={data}></CustomTestsTable>
            </div>
        )
    }
}

export default Tests