import { useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import PoolForm from "../../components/PoolForm"

type EditPoolParams = {
  id?: string;
}
export default function EditPool() {
  const history = useHistory()

  const { id }: EditPoolParams = useParams()

  return (
    <div>
      <span onClick={() => history.push('/')}>&lt; Back to home</span>
      <span>Edit pool</span>
      <PoolForm id={id} />
    </div>
  )
}

