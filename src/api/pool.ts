import api from './index'

type Pool = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  options: Option[];
}

type Option = {
  title: string;
  votes: string[];
}

const binId = "6127b0e4076a223676b18a88"

const all = () => api.get(binId).then(response => response.record)

const get = (id: string) => all().then(pools => pools.find((p: Pool) => p.id === id))

const create = (pool: Pool) => all().then(pools => api.put(binId, [...pools, pool]))

const update = (pool: Pool) => all().then(pools => {
  const newPools = pools.map((p: Pool) => (p.id === pool.id) ? pool : p)
  api.put(binId, newPools)
})

const delete_ = (id: string) => all().then(pools => {
  const newPools = pools.filter((p: Pool) => p.id !== id)
  api.put(binId, newPools)
})

const vote = (userId: string, vote: string, pool: Pool) => all().then(pools => {
  const newPools = pools.map((p: Pool) => {
    if (p.id !== pool.id) {
      return p
    }

    const newOptions = p.options.map((option: Option) => {
      if (option.title !== vote) {
        return { ...option, votes: option.votes.filter(vote => userId !== vote) }
      }

      return { ...option, votes: Array.from(new Set([...option.votes, userId])) }
    })

    return {
      ...p,
      options: newOptions
    }
  })

  api.put(binId, newPools)
})


const methods = {
  all,
  get,
  create,
  update,
  delete_,
  vote,
}

export default methods
