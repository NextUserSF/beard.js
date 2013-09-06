describe 'Add Elements', ->
  tpl = null
  ret = null
  elements =
    e1: 'e1'
    e2: 'e2'
    e3: 'e3'

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'addElements').andCallThrough()
    ret = tpl.addElements elements

  it 'should have been called', ->
    expect(tpl.addElements).toHaveBeenCalled()

  it 'should return the current instance', ->
    expect(ret).toEqual tpl

  it 'should add correct first element', ->
    expect(ret.elements.e1).toEqual 'e1'

  it 'should add correct second element', ->
    expect(ret.elements.e2).toEqual 'e2'

  it 'should add correct third element', ->
    expect(ret.elements.e3).toEqual 'e3'
