const apiUrl = "https://api.jsonbin.io/v3/b/"

const headers = new Headers()
headers.append("X-Master-Key", "$2b$10$DauQdl9cSyohG7H7n3Z/7.7QcjO5xFiMO.zM1LYYbKH3Jo50j0U6G")

const get = (endpoint: string) => fetch(apiUrl + endpoint, { headers }).then(response => {
  if (response.ok) {
    return response.json()
  }
  throw new Error("error")
})

export default {
  get
}
