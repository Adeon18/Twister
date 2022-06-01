import { Link } from "react-router-dom";
import bird from './img/bird.png'

const HomeButton = () => {
    return <Link to={'/'} className={"butonckik-home"}>
        <button><img src={bird} alt={"Bird"}></img></button>
    </Link>
}

export default HomeButton