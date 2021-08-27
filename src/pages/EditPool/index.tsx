import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useHistory, useParams } from "react-router-dom"
import PoolForm from "../../components/PoolForm"

type EditPoolParams = {
  id?: string;
}
export default function EditPool() {
  const history = useHistory()

  const { id }: EditPoolParams = useParams()

  const action = (id) ? "Edit" : "Create"

  return (
    <div>
      <header className="grid grid-rows-1 grid-cols-3 mt-8 text-2xl">
        <span className="justify-self-start cursor-pointer" onClick={() => history.push('/')}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to home
        </span>
        <span className="justify-self-center italic">{action} pool</span>
      </header>
      <section className="box">
        <PoolForm id={id} />
      </section>
    </div>
  )
}

