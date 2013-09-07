describe 'Remove all Elements', ->
  tpl = null
  ret = null
  elements =
    e1: 'e1'
    e2: 'e2'

  beforeEach ->
    tpl = new Beard '', {}, elements
    spyOn(tpl, 'remElements').andCallThrough()
    ret = tpl.remElements()

  it 'should have been called', ->
    expect(tpl.remElements).toHaveBeenCalled()

  it 'should return the current object instance', ->
    expect(ret).toBe tpl

  it 'should have empty elements', ->
    expect(tpl.elements).toEqual {}
