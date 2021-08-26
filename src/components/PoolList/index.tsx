import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import poolApi from '../../api/pool'

type Loading = {
  state: "loading";
}

type Error = {
  state: "error";
}

type Success = {
  state: "loaded";
  pools: Pool[];
}

type Pool = {
  id: String;
  title: String;
  createdBy: String;
}

type Pools
  = Loading
  | Error
  | Success

export default function PoolList() {
  const [pools, setPools] = useState({ state: "loading" } as Pools)

  const history = useHistory()

  switch (pools.state) {
    case "loading":
      poolApi
        .all()
        .then((pools: Pool[]) => setPools({ state: "loaded", pools }))
        .catch(() => setPools({ state: "error" }))
      return <div>Loading...</div>

    case "loaded":
      if (pools.pools.length === 0) {
        return <div>You dont' have any pools yet! Create one!</div>
      }
      return (
        <ul>
          {pools
            .pools
            .map((pool: Pool) => (
              <li>
                <span>{pool.title}</span>
                <button onClick={() => history.push(`/edit/${pool.id}`)}>Edit</button>
                <button>View</button>
                <button>Delete</button>
              </li>
            )
            )
          }
        </ul>
      )

    case "error":
      return <div>An error has occurred.</div>
  }

}

