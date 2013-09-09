describe 'Reset Data Object', ->
  tpl = null
  ret = null
  data =
    v1: 'v1'
    v2: 'v2'

  beforeEach ->
    tpl = new Beard '', data
    spyOn(tpl, 'resetDataObject').andCallThrough()
    ret = tpl.resetDataObject()

  it 'should have been called', ->
    expect(tpl.resetDataObject).toHaveBeenCalled()

  it 'should return the current object instance', ->
    expect(ret).toBe tpl

  it 'should have empty data', ->
    expect(tpl.dat).toEqual {}
