import { describe, it, expect } from 'vitest'
import {
  sampleWords,
  shuffleArray,
  getStarRating,
  formatTime,
} from '@/utils/gameUtils'

describe('sampleWords(words, n)', () => {
  const words = [
    { id: 1, english: 'cat', slovene: 'mačka' },
    { id: 2, english: 'dog', slovene: 'pes' },
    { id: 3, english: 'house', slovene: 'hiša' },
    { id: 4, english: 'tree', slovene: 'drevo' },
    { id: 5, english: 'book', slovene: 'knjiga' },
  ]

  it('returns exactly n pairs when words.length >= n', () => {
    const result = sampleWords(words, 3)
    expect(result).toHaveLength(3)
  })

  it('returns all words when words.length < n', () => {
    const result = sampleWords(words, 10)
    expect(result).toHaveLength(5)
  })

  it('returned pairs are a subset of input', () => {
    const result = sampleWords(words, 3)
    const inputIds = words.map((w) => w.id)
    result.forEach((w) => {
      expect(inputIds).toContain(w.id)
    })
  })

  it('no duplicate pairs in result', () => {
    const result = sampleWords(words, 4)
    const ids = result.map((w) => w.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('empty input → empty output', () => {
    expect(sampleWords([], 5)).toEqual([])
  })

  it('n=0 → empty output', () => {
    expect(sampleWords(words, 0)).toEqual([])
  })
})

describe('shuffleArray(arr)', () => {
  it('same length, same elements', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = shuffleArray(arr)
    expect(result).toHaveLength(arr.length)
    expect(result.sort()).toEqual(arr.sort())
  })

  it('does not mutate original', () => {
    const arr = [1, 2, 3, 4, 5]
    const copy = [...arr]
    shuffleArray(arr)
    expect(arr).toEqual(copy)
  })

  it('empty array → empty array', () => {
    expect(shuffleArray([])).toEqual([])
  })

  it('single element → same element', () => {
    expect(shuffleArray([42])).toEqual([42])
  })
})

describe('getStarRating(mistakes)', () => {
  it('0 → 3', () => expect(getStarRating(0)).toBe(3))
  it('1 → 2', () => expect(getStarRating(1)).toBe(2))
  it('2 → 2', () => expect(getStarRating(2)).toBe(2))
  it('3 → 1', () => expect(getStarRating(3)).toBe(1))
  it('99 → 1', () => expect(getStarRating(99)).toBe(1))
})

describe('formatTime(seconds)', () => {
  it('0 → "0:00"', () => expect(formatTime(0)).toBe('0:00'))
  it('59 → "0:59"', () => expect(formatTime(59)).toBe('0:59'))
  it('60 → "1:00"', () => expect(formatTime(60)).toBe('1:00'))
  it('125 → "2:05"', () => expect(formatTime(125)).toBe('2:05'))
})
