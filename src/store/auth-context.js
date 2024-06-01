import React, { useState } from "react";;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
});

 export const AuthContextProvider = (props) => {

    const initialToken = localStorage.getItem('idToken');

    const [token, setToken] = useState(initialToken);

    const isLoggedInHandler = !! token;

    const loginHandler = (token) => {
        setToken(token);
    };

    const logoutHandler = () => {
        setToken(null);
    };
    const cartCtx = {
    token: token,
    isLoggedIn: isLoggedInHandler,
    login: loginHandler,
    logout: logoutHandler
    }

    return (
        <AuthContext.Provider value={cartCtx}>{props.children}</AuthContext.Provider>
    );
};

export default AuthContext;