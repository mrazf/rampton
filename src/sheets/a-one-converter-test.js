import xy from './a-one-converter'

describe('A1 converter', () => {
  it('converts 1, 1 to A1', () => {
    expect(xy(1, 1)).toEqual('A1')
  })
})
