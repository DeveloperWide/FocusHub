import { useContext, createContext, useMemo, useState } from "react";

// 1. Create Context
const AppContext = createContext();

// 2. Create a Provider Component
export function AppProvider({children}){
    const [user, setUser] = useState("Mahesh");

    return (
        <AppContext.Provider value={{user, setUser}}>
            {children}
        </AppContext.Provider>
    );
}

// Custom Hook 
export function useAppContext(){
    return (useContext(AppContext));
}

