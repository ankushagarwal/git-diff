import { Branch, BranchType } from '../models/branch'
import {
  isRepositoryWithGitHubRepository,
  Repository,
} from '../models/repository'
import { IBranchesState } from './app-state'

/**
 *
 * @param repository The repository to use.
 * @param branchesState The branches state of the repository.
 * @returns The default branch of the user's contribution target, or null if it's not known.
 *
 * This method will return the fork's upstream default branch, if the user
 * is contributing to the parent repository.
 *
 * Otherwise, this method will return the default branch of the passed in repository.
 */
export function findContributionTargetDefaultBranch(
  repository: Repository,
  { defaultBranch, upstreamDefaultBranch }: IBranchesState
): Branch | null {
  return isRepositoryWithGitHubRepository(repository)
    ? upstreamDefaultBranch ?? defaultBranch
    : defaultBranch
}

/**
 * Prefer the remote ref associated with a local comparison base. GitStore
 * filters tracked remote branches out of its branch list, so callers must use
 * the ref directly instead of trying to find a corresponding Branch object.
 */
export function getBranchComparisonBaseRef(
  branch: Branch,
  defaultRemoteName?: string
): string {
  if (branch.type === BranchType.Remote) {
    return branch.name
  }

  return (
    branch.upstream ??
    (defaultRemoteName === undefined
      ? branch.name
      : `${defaultRemoteName}/${branch.name}`)
  )
}
