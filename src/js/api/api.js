const baseURL = 'http://crm.local'
let response = []

export const api = async (configs) => {
    const token = localStorage.getItem('token')
    const path = `${baseURL + configs.url + 'access-token=' + token}`
    switch (configs.method) {

        case 'GET':
            response = await fetch(path, {
                method: configs.method
            }) 
            break
        case 'POST':
            response = await fetch(path, {
                method: configs.method,
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(configs.data)
            })  
            break
        case 'PUT':
            console.log(path)
            console.log(configs)
            response = await fetch(path, {
                method: configs.method,
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(configs.data)
            })  
            break
        default:
            break
    }

    return await response.json()
}