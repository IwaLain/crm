import { endpoints } from "./endpoint"
const baseURL = 'http://crm.local'
let response = []

const login = async (configs) => {
    const path = `${baseURL + configs.url}`

    response = await fetch(path, {
        method: configs.method,
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(configs.data)
    })

    return await response.json()
}

export const loginAPI = async (data) => {
    let config = {
        method: 'POST',
        url: endpoints.login,
        data: data
    }

    const response = await login(config)
    return response
}