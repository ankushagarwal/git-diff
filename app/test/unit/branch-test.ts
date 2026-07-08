import { describe, it } from 'node:test'
import assert from 'node:assert'
import { getBranchComparisonBaseRef } from '../../src/lib/branch'
import { Branch, BranchType } from '../../src/models/branch'

const tip = { sha: 'deadbeef' }

describe('branch/getBranchComparisonBaseRef', () => {
  it('prefers the remote ref tracked by a local branch', () => {
    const local = new Branch(
      'master',
      'origin/master',
      tip,
      BranchType.Local,
      'refs/heads/master'
    )
    assert.equal(getBranchComparisonBaseRef(local), 'origin/master')
  })

  it('falls back to the local branch without remote metadata', () => {
    const local = new Branch(
      'master',
      null,
      tip,
      BranchType.Local,
      'refs/heads/master'
    )

    assert.equal(getBranchComparisonBaseRef(local), 'master')
  })

  it('uses the default remote when upstream metadata is unavailable', () => {
    const local = new Branch(
      'master',
      null,
      tip,
      BranchType.Local,
      'refs/heads/master'
    )
    assert.equal(getBranchComparisonBaseRef(local, 'origin'), 'origin/master')
  })

  it('keeps an existing remote comparison branch', () => {
    const remote = new Branch(
      'origin/master',
      null,
      tip,
      BranchType.Remote,
      'refs/remotes/origin/master'
    )

    assert.equal(getBranchComparisonBaseRef(remote), 'origin/master')
  })
})
