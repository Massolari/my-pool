import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Guid } from "js-guid"
import poolApi from '../../api/pool'

type Loading = {
  state: "loading";
  id: string;
}

type Error = {
  state: "error";
}

type Success = {
  state: "loaded";
  pool: Pool;
}

type Pool = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  options: string[];
}

type Pools
  = Loading
  | Error
  | Success

type PoolFormProps = {
  id: string | undefined
}

const getEmptyPool = (): Pool => ({
  id: Guid.newGuid().toString(),
  title: "",
  description: "",
  createdBy: localStorage.getItem("guestId") || "",
  options: []
})

export default function PoolForm(props: PoolFormProps) {
  const initialState = (props.id) ?
    { state: "loading", id: props.id }
    :
    { state: "loaded", pool: getEmptyPool() }

  const [state, setState] = useState(initialState as Pools)

  const history = useHistory()

  switch (state.state) {
    case "loading":
      poolApi
        .get(state.id)
        .then((pool: Pool) => setState({ state: "loaded", pool }))
        .catch(() => setState({ state: "error" }))
      return <div>Loading...</div>

    case "loaded":
      const { pool } = state
      return (
        <form>
          <div>
            <span>Pool title</span>
            <input value={pool.title} />
          </div>
          <div>
            <span>Description</span>
            <input value={pool.description} />
          </div>
          <div>
            <span>Options</span>
            <section>
              <ul>
                {pool.options.map(option => (
                  <li>
                    <span>{option}</span>
                    <button>Delete</button>
                  </li>
                ))}
              </ul>
              <button>New option</button>
            </section>
          </div>
          <button>Save</button>
        </form>
      )

    case "error":
      return <div>An error has occurred.</div>
  }

}


