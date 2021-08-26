const apiUrl = "https://api.jsonbin.io/v3/b/"

const headers = new Headers()
headers.append("X-Master-Key", "$2b$10$DauQdl9cSyohG7H7n3Z/7.7QcjO5xFiMO.zM1LYYbKH3Jo50j0U6G")
headers.append("Content-Type", "application/json")

const handleResponse = (response: Response) => {
  if (response.ok) {
    return response.json()
  }
  throw new Error("error")
}

const get = (endpoint: string) => fetch(apiUrl + endpoint, { headers }).then(handleResponse)

const put = (endpoint: string, body: any) =>
  fetch(apiUrl + endpoint, {
    headers,
    method: "PUT",
    body: JSON.stringify(body)
  }).then(handleResponse)

const methods = {
  get,
  put,
}

export default methods
