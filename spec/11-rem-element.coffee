describe 'Remove Element', ->
  tpl = null
  ret = null
  elements =
    e1: 'e1'
    e2: 'e2'

  beforeEach ->
    tpl = new Beard '', {}, elements
    spyOn(tpl, 'remElement').andCallThrough()

  describe 'Before', ->
    it 'element should exist', ->
      expect(tpl.elements.e1).toBeDefined()

  describe 'After', ->
    beforeEach ->
      ret = tpl.remElement 'e1'

    it 'should have been called', ->
      expect(tpl.remElement).toHaveBeenCalled()

    it 'should return the current object instance', ->
      expect(ret).toEqual tpl

    it 'element shouldn\'t exist', ->
      expect(tpl.elements.e1).toBeUndefined()

    it 'unremoved element should exist', ->
      expect(tpl.elements.e2).toBeDefined()
