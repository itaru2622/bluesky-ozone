import { CollectionId } from '@/reports/helpers/subject'
import {
  ChatBubbleLeftIcon,
  UserGroupIcon,
  PuzzlePieceIcon,
  LifebuoyIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline'
import { useKBar, Action, useRegisterActions, createAction } from 'kbar'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import {
  isBlueSkyAppUrl,
  getFragmentsFromBlueSkyAppUrl,
  isValidDid,
  isValidHandle,
} from '../../../lib/util'

const PostIcon = ChatBubbleLeftIcon
const RepoIcon = UserGroupIcon
const iconClassName = 'h-7 w-7'

const buildItemForProfile = ({
  type,
  search,
  profileKey,
  router,
}: {
  type: 'did' | 'handle'
  profileKey: string
  search: string
  router: AppRouterInstance
}): Action[] => {
  const actions = [
    {
      id: `view-profile-by-${type}`,
      name: `Profile for ${profileKey}`,
      section: 'Details',
      keywords: `${search},view,${type}`,
      icon: <RepoIcon className={iconClassName} />,
      subtitle: `Go to profile page and of this ${type}`,
      perform: () => {
        router.push(`/repositories/${profileKey.replace('@', '')}`)
      },
    },
    {
      id: `search-reports-by-${type}`,
      name: `Reports by ${profileKey}`,
      keywords: `${search},search,reports-by,${type}`,
      icon: <MegaphoneIcon className={iconClassName} />,
      subtitle: `See all reports created by this ${type}`,
      section: 'Reports',
      perform: () => {
        router.push(`/reports?term=reporters:${profileKey}`)
      },
    },
  ]

  // Right now, we can't search reports by a handle
  if (type !== 'handle') {
    actions.push(
      {
        id: `search-reports-for-${type}`,
        name: `Reports for ${profileKey}`,
        keywords: `${search},search,reports-for,${type}`,
        icon: <RepoIcon className={iconClassName} />,
        subtitle: `See all reports for this ${type}`,
        section: 'Reports',
        perform: () => {
          router.push(`/reports?term=${profileKey}`)
        },
      },
      {
        id: `search-reports-actioned-by-${type}`,
        name: `Reports actioned by ${profileKey}`,
        keywords: `${search},search,${type}`,
        icon: <LifebuoyIcon className={iconClassName} />,
        subtitle: `Go to reports page and see all reports actioned by this moderator`,
        section: 'Reports',
        perform: () => {
          router.push(`/reports?term=actionedBy:${profileKey}`)
        },
      },
    )
  }

  return actions
}

export const useCommandPaletteAsyncSearch = () => {
  const router = useRouter()
  const { search } = useKBar<{ search: string }>((state) => ({
    search: state.searchQuery,
  }))

  const memoizedActions = useMemo(() => {
    const actions: Action[] = []
    if (search?.length < 2) {
      return actions
    }

    if (search.trim() === 'tetris') {
      actions.push({
        id: 'tetris',
        name: `Tetris`,
        icon: <PuzzlePieceIcon className={iconClassName} />,
        keywords: `tetris, surprise`,
        subtitle: 'Take a quick break!',
        perform: () => {
          router.push(`/surprise-me`)
        },
      })
    } else if (isBlueSkyAppUrl(search)) {
      const fragments = getFragmentsFromBlueSkyAppUrl(search)

      if (fragments?.cid) {
        actions.push(
          {
            id: 'view-post',
            name: `View post ${fragments.cid}`,
            section: 'Details',
            icon: <PostIcon className={iconClassName} />,
            keywords: `${search},view,post`,
            subtitle: 'Go to post record',
            perform: () => {
              router.push(
                `/repositories/${fragments.did || fragments.handle}/${
                  CollectionId.Post
                }/${fragments.cid}`,
              )
            },
          },
          {
            id: 'search-reports-by-post',
            name: `Reports for post ${fragments.cid}`,
            section: 'Reports',
            icon: <PostIcon className={iconClassName} />,
            keywords: `${search},search,report,post`,
            subtitle: 'Go to reports page and filter by this post',
            perform: () => {
              router.push(
                `/reports?term=at://${fragments.did || fragments.handle}/${
                  CollectionId.Post
                }/${fragments.cid}`,
              )
            },
          },
        )
      }

      if (fragments?.did) {
        actions.push(
          ...buildItemForProfile({
            search,
            router,
            type: 'did',
            profileKey: fragments.did,
          }),
        )
      }

      if (fragments?.handle) {
        actions.push(
          ...buildItemForProfile({
            search,
            router,
            type: 'handle',
            profileKey: fragments.handle,
          }),
        )
      }
    } else if (isValidDid(search)) {
      actions.push(
        ...buildItemForProfile({
          search,
          router,
          type: 'did',
          profileKey: search,
        }),
      )
    } else if (isValidHandle(search)) {
      actions.push(
        ...buildItemForProfile({
          search,
          router,
          type: 'handle',
          profileKey: search,
        }),
      )
    }

    return actions.map(createAction)
  }, [search])

  useRegisterActions(memoizedActions, [search])
}