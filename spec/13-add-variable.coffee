describe 'Add Variable', ->
  tpl = null
  ret = null
  key = 'v1'
  value = 'variable'

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'addVariable').andCallThrough()
    ret = tpl.addVariable key, value

  it 'should have been called', ->
    expect(tpl.addVariable).toHaveBeenCalled()

  it 'should return the current instance', ->
    expect(ret).toBe tpl

  it 'should add variable', ->
    expect(ret.dat.v1).toBeDefined()

  it 'should add variable with correct value', ->
    expect(ret.dat.v1).toEqual 'variable'
