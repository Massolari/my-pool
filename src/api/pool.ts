import api from './index'

type Pool = {
  id: String;
  title: String;
  description: String;
  createdBy: String;
  options: String[];
}

const all = () => api.get("6127b0e4076a223676b18a88").then(response => response.record)

const get = (id: string) => all().then(pools => pools.find((p: Pool) => p.id === id))

export default {
  all,
  get
}
