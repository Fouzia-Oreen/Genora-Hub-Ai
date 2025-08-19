import { Link, useNavigate } from 'react-router-dom';
import genora from '../../assets/logo.png';
const Logo = () => {
  const navigate = useNavigate()
  return (
    <Link to="/" className="flex items-center">
      <img
        className="h-8"
        src={genora}
        alt="Genora Logo"
        onClick={() => navigate("/")}
      />
      <span className="text-color_4 text-[26px] font-bold pl-3 ">Genora.AI</span>
    </Link>
  )
}

export default Logo
