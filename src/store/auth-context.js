import React, { useCallback, useEffect, useState } from "react";;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token, expiryTime) => {},
    logout: () => {}
});

const calculateRemainingTime = (expiryTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expiryTime).getTime();
    const remainingDuration = adjExpirationTime - currentTime;
    return remainingDuration;
};

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('idToken');
    const storedExpirationDate = localStorage.getItem('time');
    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if (remainingTime <= 0) {
        localStorage.removeItem('idToken');
        localStorage.removeItem('time');
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime,
    };
};

 export const AuthContextProvider = (props) => {

    const tokenData = retrieveStoredToken();
    let initialToken;
    if (tokenData) {
        initialToken = tokenData.token;
    }

    // const initialToken = localStorage.getItem('idToken');

    const [token, setToken] = useState(initialToken);

    const isLoggedInHandler = !! token;

    const logoutHandler = useCallback(() => {
        setToken(null);
    }, []);



    const loginHandler = (token, expiryTime) => {
        setToken(token);
        localStorage.setItem('idToken', token);
        localStorage.setItem('time', expiryTime);

        const remainingTime = calculateRemainingTime(expiryTime);
        setTimeout(logoutHandler, remainingTime);
    };

    useEffect(() => {
        if (tokenData) {
            setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);

    // const loginHandler = (token, expiryTime) => {
    //     setToken(token);
    //     localStorage.setItem('idToken', token);
    //   localStorage.setItem('time', expiryTime)

    //   const remainingTime = calculateRemainingTime(expiryTime);
    // setTimeout(logoutHandler, remainingTime);
    // };

    

    // const logoutHandler = () => {
    //     setToken(null);
    // };


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