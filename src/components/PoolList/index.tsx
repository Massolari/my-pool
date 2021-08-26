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
  id: string;
  title: string;
  createdBy: string;
  options: Option[];
}

type Option = {
  votes: string[];
}

type Pools
  = Loading
  | Error
  | Success

const guestId = localStorage.getItem('guestId') || ""

export default function PoolList() {
  const [pools, setPools] = useState({ state: "loading" } as Pools)

  const history = useHistory()

  const handleDelete = (pool: Pool) => {
    if (pools.state === "loaded") {
      const hasConfirmedDelete = window.confirm(`Do you really want to delete the pool ${pool.title}?`)
      if (!hasConfirmedDelete) {
        return
      }

      poolApi
        .delete_(pool.id)
        .then(() => {
          alert("Pool deleted successfully")
          setPools({
            ...pools,
            pools: pools.pools.filter((p: Pool) => p.id !== pool.id)
          })
        })
        .catch(() => alert("An error occurred while deleting the pool"))
    }
  }

  const getTotalVotes = (pool: Pool) => pool.options.reduce((total, option) => option.votes.length + total, 0)

  const handleShare = (pool: Pool) => alert(`This pool link is:\n${window.location.origin}/vote/${pool.id}\n\nShare with your friends!`)

  switch (pools.state) {
    case "loading":
      poolApi
        .all()
        .then((pools: Pool[]) => pools.filter((pool: Pool) => pool.createdBy === guestId))
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
              <li key={pool.id}>
                <span>{`${pool.title} (${getTotalVotes(pool)} votes)`}</span>
                <button onClick={() => handleShare(pool)}>Share</button>
                <button onClick={() => history.push(`/edit/${pool.id}`)}>Edit</button>
                <button>View</button>
                <button onClick={() => handleDelete(pool)}>Delete</button>
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

