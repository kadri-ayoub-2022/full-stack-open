import { useState } from "react";


 export const useNotification = (message, time) => {
    const [notification, setNotification] = useState(message);
    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => {
            setNotification("");
        }, time);
    }
    return {notification, showNotification};
}

export const useField = (type) => {
    const [value, setValue] = useState('');
    const onChange = (event) => {
        setValue(event.target.value);
    }
    const reset = () => {
        setValue('');
    }
    return {
        type,
        value,
        onChange,
        reset
    };
}
