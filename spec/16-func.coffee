describe 'Function', ->
  tpl = null
  ret = null
  data =
    f1: -> 'Plain function call'
    o: f2: -> 'Nested function call'
    hello: (who) -> "Hello, #{who}!"

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'func').andCallThrough()

  describe 'Plain', ->
    beforeEach ->
      ret = tpl.func data, 'f1()'

    it 'should have been called', ->
      expect(tpl.func).toHaveBeenCalled()

    it 'should return correct value', ->
      expect(ret).toEqual 'Plain function call'

  describe 'Nested', ->
    beforeEach ->
      ret = tpl.func data, 'o.f2()'

    it 'should have been called', ->
      expect(tpl.func).toHaveBeenCalled()

    it 'should return correct value', ->
      expect(ret).toEqual 'Nested function call'

  describe 'With Argument', ->
    beforeEach ->
      ret = tpl.func data, 'hello(world)'

    it 'should have been called', ->
      expect(tpl.func).toHaveBeenCalled()

    it 'should return correct value', ->
      expect(ret).toEqual 'Hello, world!'
