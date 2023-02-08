import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="navbar bg-base-300">
            <Link to="/" className="btn btn-ghost normal-case text-xl">Api Tester App</Link>
        </div>
    )
}

export default Navbar