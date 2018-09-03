import convert from './month-index-to-range'

describe('Month Index To Range', () => {
  it('returns a full month range given a month index', () => {
    const range = convert(2)

    expect(range.from).toEqual('2018-03-01T00:00:00Z')
    expect(range.to).toEqual('2018-03-31T23:59:59Z')
  })
})
