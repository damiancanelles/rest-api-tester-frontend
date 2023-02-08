import { useParams } from "react-router-dom"
import RequestForm from "../components/RequestForm"
import { useFetchRequest } from "../hooks/useRequest"

type RequestProps = {
    requestId: string
}

function Request() {
    const { requestId } = useParams<RequestProps>()
    const { data, isLoading, isRefetching } = useFetchRequest(requestId)
    
    if (isLoading) {
        return <div> ...Loading </div>
    }
    if (isRefetching) {
        return <div> ...Refetching </div>
    }
    else {
        return <RequestForm data={data} requestId={requestId}></RequestForm>
    }
    
}

export default Request