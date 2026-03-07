import React, { createContext, useReducer } from 'react';

const StoreContext = createContext();

const initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
        shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {},
        paymentMethod: 'Razorpay'
    },
    userLogin: {
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
    }
};

function reducer(state, action) {
    switch (action.type) {
        // CART
        case 'CART_ADD_ITEM':
            const item = action.payload;
            const existItem = state.cart.cartItems.find(x => x.product === item.product);
            if (existItem) {
                return { ...state, cart: { ...state.cart, cartItems: state.cart.cartItems.map(x => x.product === existItem.product ? item : x) } };
            } else {
                return { ...state, cart: { ...state.cart, cartItems: [...state.cart.cartItems, item] } };
            }
        case 'CART_REMOVE_ITEM':
            return { ...state, cart: { ...state.cart, cartItems: state.cart.cartItems.filter(x => x.product !== action.payload) } };
        case 'CART_SAVE_SHIPPING_ADDRESS':
            return { ...state, cart: { ...state.cart, shippingAddress: action.payload } };
        case 'CART_CLEAR_ITEMS':
            return { ...state, cart: { ...state.cart, cartItems: [] } };

        // USER
        case 'USER_LOGIN_SUCCESS':
            return { ...state, userLogin: { userInfo: action.payload } };
        case 'USER_LOGOUT':
            return { ...state, userLogin: { userInfo: null } };

        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <StoreContext.Provider value={value}>{props.children}</StoreContext.Provider>;
}

export default StoreContext;
