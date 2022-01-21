import React, {createContext, useReducer, useContext} from 'react'

const initialState = {
  userInfo: {}
}

function reducer(state, action) {
  switch (action.type) {
    case 'setUserInfo':
      return {userInfo: action.userInfo}
    case 'getUserInfo':
      return state.userInfo
    default:
      throw new Error();
  }
}

const StateContext = createContext()
const DispatchContext = createContext()

function useStateStore() {
  return useContext(StateContext)
}

function useDispatchStore() {
  return useContext(DispatchContext)
}

function StoreProvider({children}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export {useStateStore, useDispatchStore, StoreProvider}