import { api } from "./api"
import { endpoints } from "./endpoint"

const getUsersAPI = async () => {
    let config = {
        method: 'GET',
        url: endpoints.getUsers
    }

    const response = await api(config)
    return response[0]
}

const addUserAPI = async (data) => {
    let config = {
        method: 'POST',
        url: endpoints.addUser,
        data: data
    }

    const response = await api(config)
    return response
}

export const user = {
    getUsersAPI,
    addUserAPI
}