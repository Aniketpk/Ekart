import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        cart: [],
        addresses:[],
        selectedAddress:null,
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setCart: (state, action) => {
            state.cart = action.payload
        },
        //address Mangement 
        addAddress:(state,action)=>{
            if(!state.addresses)state.addresses=[];
            state.addresses.push(action.payload);
        },
        setAddresses:(state,action)=>{
            state.addresses=action.payload;
        },
        deleteAddress:(state,action)=>{
            state.addresses=state.addresses.filter((_,index)=>index !== action.payload);
            //Reset Selected address if it was deleted
            if(state.selectedAddress === action.payload){
                state.selectedAddress=null;
            }
        },
        setSelectedAddress:(state, action) => {
            state.selectedAddress = action.payload
        }
    }
})

export const { setProducts, setCart, addAddress, setAddresses, setSelectedAddress, deleteAddress } = productsSlice.actions
export default productsSlice.reducer
