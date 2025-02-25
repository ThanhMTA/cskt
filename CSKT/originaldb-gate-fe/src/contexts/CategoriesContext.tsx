import { IEndPoint } from "@app/interfaces/common.interface";
import { globalStore } from "@app/store/global.store";
import { createContext, useContext, useEffect } from "react";

interface ICategoriesContext {
    endPoints: IEndPoint[]
}
const initValue: ICategoriesContext = {
    endPoints: []
}
const CategoriesContext = createContext(initValue);
export const useCategories = () => useContext(CategoriesContext);
type Props = {
    children: JSX.Element;
    value: ICategoriesContext
}
export const CategoriesProvider = ({ children, value }: Props) =>{
    const {setCurrEndpoints} = globalStore()
    useEffect(()=>{
        setCurrEndpoints(value.endPoints)
    },[value?.endPoints])
    return (
        <CategoriesContext.Provider value={value}>
            {children}
        </CategoriesContext.Provider>
    )
};