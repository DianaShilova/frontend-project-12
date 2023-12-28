import { useEffect } from "react"
import axios from "axios";
import { useDispatch } from "react-redux";
import { addChannels } from '../slices/channelsSlice.js'
import { addMessages } from "../slices/messagesSlice.js";

export const useData = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        axios.get('/api/v1/data', { 
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then((response) => {
            dispatch(addChannels(response.data.channels));
            dispatch(addMessages(response.data.messages))
        })
    }, []);
}