import { useSelector } from "react-redux";

const useAuth = () => {
  const { email, token, id } = useSelector((state) => state.auth);
  
  return {
    isAuth: !!email,
    email,
    token,
    id,
  };
};

export default useAuth;
