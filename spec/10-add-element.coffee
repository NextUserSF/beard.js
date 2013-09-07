describe 'Add Element', ->
  tpl = null
  ret = null
  id = 'e1'
  element = 'element'

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'addElement').andCallThrough()
    ret = tpl.addElement id, element

  it 'should have been called', ->
    expect(tpl.addElement).toHaveBeenCalled()

  it 'should return the current instance', ->
    expect(ret).toBe tpl

  it 'should add element', ->
    expect(ret.elements.e1).toBeDefined()

  it 'should add element with correct value', ->
    expect(ret.elements.e1).toEqual 'element'
