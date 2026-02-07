import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        removeNotification() {
            return ''
        }
    }
})

const { setNotification, removeNotification } = notificationSlice.actions

export const printNotification = (notification) => {
    return async dispatch => {
        dispatch(setNotification(notification))
        setTimeout(() => {
            dispatch(removeNotification())
        }, 2000)
    }
}

export default notificationSlice.reducer