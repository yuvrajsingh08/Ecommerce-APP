import { createContext, useState } from "react";
import SummaryApi from "../common";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

// const Context = createContext(null);


// export default Context;\

export const AppContext = createContext();

export default function AppContextProvider({ children }) {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  const fetchUserDetails = async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: "include",
    });

    const dataApi = await dataResponse.json();
    // console.log(dataApi.data);
    if (dataApi.success) {
      dispatch(setUserDetails(dataApi.data));
    }
  };

  const fetchUserAddToCart = async () => {
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
      method: SummaryApi.addToCartProductCount.method,
      credentials: "include",
    });

    const dataApi = await dataResponse.json();

    setCartProductCount(dataApi?.data?.count);
    // console.log("cart Count", cartProductCount);
  };

  const value = {
    fetchUserDetails, // user detail fetch
    cartProductCount, // current user add to cart product count,
    fetchUserAddToCart,
    cartProductCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

