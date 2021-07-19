import { useState, useRef, useEffect } from 'react'

import Head from 'next/head'

import styles from '../styles/home.module.scss'

import { Loading } from '../components/Loading'
import { FollowerCard } from '../components/FollowerCard'

import { githubApi } from '../services/github'

import { formatGithubFollowers } from '../utils/formatGithubFollowers'

type Follower = {
  id: number
  login: string
  avatarUrl: string
  profileUrl: string
}

export default function Home() {
  const [followers, setFollowers] = useState<Follower[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(0)
  const [hasNext, setHasNext] = useState(true)

  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setCurrentPage(page => page + 1)
      }
    })

    intersectionObserver.observe(!!sentinelRef.current && sentinelRef.current)

    return () => intersectionObserver.disconnect()
  }, [])

  const loadFollowersFromGithub = async () => {
    if (isLoading) return

    if (!hasNext) return

    if (currentPage <= 0) return

    setIsLoading(true)

    githubApi
      .get('/users/vinisilvag/followers', {
        params: {
          per_page: 8,
          page: currentPage,
          order: 'DESC'
        }
      })
      .then(response => {
        const formattedFollowers = formatGithubFollowers(response.data)

        setHasNext(!!response.data.length)

        setFollowers(prev => [...prev, ...formattedFollowers])
      })
      .catch(err => {
        console.log(err)

        alert('Search for followers failed')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    loadFollowersFromGithub()
  }, [currentPage])

  return (
    <div>
      <Head>
        <title>Infinite Scroll</title>
        <meta name="description" content="A Github followers Infinite Scroll" />
      </Head>

      <div className={styles.wrapper}>
        <main className={styles.container}>
          <h1 className={styles.title}>Github followers Infinite Scroll!</h1>

          <section className={styles.followersList}>
            {followers.map(follower => (
              <FollowerCard key={follower.id} follower={follower} />
            ))}

            {isLoading && <Loading />}

            <div ref={sentinelRef} className={styles.sentinel} />
          </section>
        </main>
      </div>
    </div>
  )
}
