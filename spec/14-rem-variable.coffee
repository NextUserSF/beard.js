describe 'Remove Variable', ->
  tpl = null
  ret = null
  data =
    v1: 'v1'
    v2: 'v2'

  beforeEach ->
    tpl = new Beard '', data
    spyOn(tpl, 'remVariable').andCallThrough()

  describe 'Before', ->
    it 'variable should exist', ->
      expect(tpl.dat.v1).toBeDefined()

  describe 'After', ->
    beforeEach ->
      ret = tpl.remVariable 'v1'

    it 'should have been called', ->
      expect(tpl.remVariable).toHaveBeenCalled()

    it 'should return the current object instance', ->
      expect(ret).toBe tpl

    it 'element shouldn\'t exist', ->
      expect(tpl.dat.v1).toBeUndefined()

    it 'unremoved element should exist', ->
      expect(tpl.dat.v2).toBeDefined()
