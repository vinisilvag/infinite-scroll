import Image from 'next/image'

import styles from './styles.module.scss'

type FollowerData = {
  id: number
  login: string
  avatarUrl: string
  profileUrl: string
}

type FollowerProps = {
  follower: FollowerData
}

export const FollowerCard = ({ follower }: FollowerProps) => {
  return (
    <div className={styles.container}>
      <Image
        src={follower.avatarUrl}
        alt={follower.profileUrl}
        width={102}
        height={102}
      />

      <div className={styles.content}>
        <h2>{follower.login}</h2>
        <span>{follower.profileUrl}</span>
      </div>
    </div>
  )
}
