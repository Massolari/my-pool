import { ChangeEvent, FormEvent, useState } from 'react'
import { Guid } from "js-guid"
import poolApi from '../../api/pool'
import { useHistory } from 'react-router-dom'
import Loader from '../Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

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

  const handleChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
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
      return <Loader />

    case "loaded":
      const { pool } = state
      return (
        <form onSubmit={handleSubmit} className="text-xl flex flex-col gap-6">
          <div className="field">
            <span className="field-label">Pool title</span>
            <input
              value={pool.title}
              onChange={handleChangeTitle}
              placeholder="My awesome pool"
              className="input-text"
            />
          </div>
          <div className="field">
            <span className="field-label">Description</span>
            <textarea
              className="textarea"
              placeholder="What do you think about..."
              onChange={handleChangeDescription}
              rows={2}
              value={pool.description}
            ></textarea>
          </div>
          <div className="field">
            <span className="field-label">Options</span>
            <section className="box box--white flex-1">
              <ul>
                {pool.options.map((option, index) => (
                  <li key={index} className="flex items-center gap-6 py-2">
                    <span>
                      <input
                        className="border-b border-black"
                        value={option.title}
                        onChange={handleChangeOption(index)}
                        placeholder={`Option ${index + 1}`}
                      />
                    </span>
                    <button className="btn btn--red w-14" type="button" onClick={() => handleDeleteOption(index)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                ))}
              </ul>
              <button className="btn btn--blue px-4 mx-auto" type="button" onClick={handleAddOption}>New option</button>
            </section>
          </div>
          <button className="btn btn--green w-full">Save</button>
        </form>
      )

    case "error":
      return <div>An error has occurred.</div>
  }

}


