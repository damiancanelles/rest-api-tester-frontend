import AppsTable from "../components/AppsTable"
import Navbar from "../components/Navbar"

function Home() {
    return (
        <div data-theme="cmyk" className="h-screen">
            <Navbar></Navbar>
            <AppsTable></AppsTable>
        </div>
    )
}

export default Home