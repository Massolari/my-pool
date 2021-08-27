import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import poolApi from "../../api/pool"
import Loader from "../../components/Loader"

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

  const handleVote = (newVote: string) => setVote(newVote)

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
        return <Loader />

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
      return <Loader />

    case "voting":
    case "voted":
    case "loaded":
      const { pool } = state
      const isSubmitting = state.state === "voting"

      return (
        <div className="mt-24">
          <header className="text-center mb-8">
            <h2 className="text-5xl italic font-semibold mb-2">{pool.title}</h2>
            <span className="font-medium text-xl">{pool.description}</span>
          </header>
          <section className="box">
            <ul className="list-none">
              {pool.options.map((option, index) =>
                <li key={index}>
                  <button
                    className={`
                      w-full
                      ${option.title === vote ? "bg-blue-400 text-white font-medium" : "bg-transparent "}
                      hover:bg-blue-300
                      rounded-full p-4 text-xl
                    `}
                    onClick={() => handleVote(option.title)}
                    disabled={isSubmitting}
                  >
                    {option.title}
                  </button>
                </li>
              )}
            </ul>
            <button
              className="btn btn--green w-full mt-12"
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
            >
              {getSubmitText()}
            </button>
          </section>
          <span>
            Create your own pool on&nbsp;
            <Link to="/" className="text-blue-500 font-bold">My-pool </Link>
          </span>

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
