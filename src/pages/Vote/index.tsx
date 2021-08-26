import { ChangeEvent, useState } from "react"
import { useParams } from "react-router-dom"
import poolApi from "../../api/pool"

type Loading = {
  state: "loading";
}

type Error = {
  state: "error";
}

type Loaded = {
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

type Voting = {
  state: "voting";
  pool: Pool;
}

type Voted = {
  state: "voted";
  pool: Pool;
}

type State
  = Loading
  | Error
  | Loaded
  | Voting
  | Voted

type UrlParams = {
  id: string
}

const guestId = localStorage.getItem('guestId') || ""

export default function Vote() {
  const { id } = useParams<UrlParams>()

  const [state, setState] = useState({ state: "loading" } as State)
  const [vote, setVote] = useState("")

  const handleVote = (event: ChangeEvent<HTMLInputElement>) => {
    setVote(event.target.value)
  }

  const handleSubmit = () => {
    if (state.state === "loaded" || state.state === "voted") {
      setState({
        ...state,
        state: "voting"
      })
      poolApi
        .vote(guestId, vote, state.pool)
        .then(() => {
          alert("Voted successfully")
          setState({
            ...state,
            state: "voted"
          })
        })
        .catch(() => alert("An error occurred while voting"))
    }
  }

  const getSubmitText = () => {
    switch (state.state) {
      case "voting":
        return "Voting..."

      case "voted":
        return "Change vote"

      default:
        return "Submit"
    }
  }

  switch (state.state) {
    case "loading":
      poolApi
        .get(id)
        .then((pool: Pool) => {
          const votedOption = (pool.options.find((option: Option) => option.votes.includes(guestId)))
          let newState: "voted" | "loaded" = "loaded"
          if (votedOption) {
            newState = "voted"
            setVote(votedOption.title)
          }
          setState({ state: newState, pool })
        })
        .catch(() => setState({ state: "error" }))
      return <div>Loading...</div>

    case "voting":
    case "voted":
    case "loaded":
      const { pool } = state
      const isSubmitting = state.state === "voting"

      return (
        <div>
          <h2>{pool.title}</h2>
          <span>{pool.description}</span>
          <ul>
            {pool.options.map((option, index) =>
              <li key={index}>
                <label>
                  <input
                    type="radio"
                    name="vote"
                    value={option.title}
                    checked={option.title === vote}
                    onChange={handleVote}
                    disabled={isSubmitting}
                  />
                  {option.title}
                </label>
              </li>
            )}
          </ul>
          <button
            onClick={() => handleSubmit()}
            disabled={isSubmitting}
          >
            {getSubmitText()}
          </button>
        </div>
      )

    case "error":
      return (<div>
        <p>An error has occurred while fetching the pool.</p>
        <p>Please, make sure the pool link is correct or try again later</p>
      </div>
      )
  }

}
