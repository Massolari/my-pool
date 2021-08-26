import { ChangeEvent, FormEvent, useState } from 'react'
import { Guid } from "js-guid"
import poolApi from '../../api/pool'
import { useHistory } from 'react-router-dom'

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
  options: Option[];
}

type Option = {
  title: string;
  votes: string[];
}

type State
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
  const history = useHistory()

  const initialState = (props.id) ?
    { state: "loading", id: props.id }
    :
    { state: "loaded", pool: getEmptyPool() }

  const [state, setState] = useState(initialState as State)

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    if (state.state === "loaded") {
      setState({
        ...state,
        pool: { ...state.pool, title: event.target.value }
      })
    }
  }

  const handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
    if (state.state === "loaded") {
      setState({
        ...state,
        pool: { ...state.pool, description: event.target.value }
      })
    }
  }

  const handleChangeOption = (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
    if (state.state === "loaded") {
      const newOptions = state.pool.options.map((option, i) =>
        (i === index) ? { ...option, title: event.target.value } : option
      )
      setState({
        ...state,
        pool: { ...state.pool, options: newOptions }
      })
    }
  }

  const handleDeleteOption = (index: number) => {
    if (state.state === "loaded") {
      const newOptions = state.pool.options.filter((_, i) => i !== index)
      setState({
        ...state,
        pool: { ...state.pool, options: newOptions }
      })
    }
  }

  const handleAddOption = () => {
    if (state.state === "loaded") {
      setState({
        ...state,
        pool: { ...state.pool, options: [...state.pool.options, { title: "", votes: [] }] }
      })
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (state.state === "loaded") {
      if (props.id) {
        poolApi
          .update(state.pool)
          .then(() => {
            alert('Pool saved successfully')
            history.push('/')
          })
          .catch(() => alert('An error occurred while saving the pool'))
        return
      }
      poolApi
        .create(state.pool)
        .then(() => {
          alert('Pool created successfully')
          history.push('/')
        })
        .catch(() => alert('An error occurred while creating the pool'))
    }
  }

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
        <form onSubmit={handleSubmit}>
          <div>
            <span>Pool title</span>
            <input value={pool.title} onChange={handleChangeTitle} />
          </div>
          <div>
            <span>Description</span>
            <input value={pool.description} onChange={handleChangeDescription} />
          </div>
          <div>
            <span>Options</span>
            <section>
              <ul>
                {pool.options.map((option, index) => (
                  <li key={index}>
                    <span>
                      <input value={option.title} onChange={handleChangeOption(index)} />
                    </span>
                    <button type="button" onClick={() => handleDeleteOption(index)}>Delete</button>
                  </li>
                ))}
              </ul>
              <button type="button" onClick={handleAddOption}>New option</button>
            </section>
          </div>
          <button>Save</button>
        </form>
      )

    case "error":
      return <div>An error has occurred.</div>
  }

}


