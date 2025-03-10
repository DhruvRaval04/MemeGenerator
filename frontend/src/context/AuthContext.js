import {createContext, useReducer, useEffect} from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action)=> {
    console.log('Action received:', action) // Debug log
    switch (action.type){
        case 'LOGIN':
            console.log('LOGIN payload:', action.payload) 
            return{user: action.payload}
        case 'LOGOUT':
            return {user: null}
        default: 
            return state

    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {user: null})

    useEffect(() =>{
        const user = JSON.parse(localStorage.getItem('user'))
        if (user){
            dispatch({type: 'LOGIN', payload: user})
        }
    }, [])

    console.log('AuthContext state: ', state)

    return (
        <AuthContext.Provider value = {{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
    
}