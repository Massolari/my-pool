import { useHistory } from 'react-router-dom'
import PoolList from '../components/PoolList'

export default function Home() {
  const history = useHistory()

  return (
    <div className="mt-24">
      <header className="text-center mb-16">
        <span className="text-lg">Welcome to</span>
        <h2 className="text-5xl italic font-semibold">My-pool</h2>
      </header>
      <main>
        <span className="font-medium italic text-2xl">Your pools</span>
        <section className="box">
          <PoolList />
          <button className="btn btn--green w-full" onClick={() => history.push('/new')}>New pool</button>
        </section>
      </main>
    </div>
  )
}
