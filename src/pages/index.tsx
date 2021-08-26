import { useHistory } from 'react-router-dom'
import PoolList from '../components/PoolList'

export default function Home() {
  const history = useHistory()

  return (
    <div>
      <header>
        <span>Welcome to</span>
        <h2>My-pool</h2>
      </header>
      <main>
        <span>Your pools</span>
        <section>
          <PoolList />
        </section>
        <button onClick={() => history.push('/new')}>New pool</button>
      </main>
    </div>
  )
}
