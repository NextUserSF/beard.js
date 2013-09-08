describe 'Evaluate', ->
  tpl = null
  ret = null
  commentStr = '# comment'
  funcStr = '= func()'
  keyStr = '= test.key'
  variableStr = '= variable'
  elementStr = '@ element'
  str = 'Not an element'
  data =
    func: ->
      'Function call'
    test:
      key: 'Test key'
    variable: 'Test variable'
  elements =
    element: 'Test element'

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'evaluate').andCallThrough()

  describe 'Comment', ->
    beforeEach ->
      ret = tpl.evaluate commentStr, data

    it 'should have been called', ->
      expect(tpl.evaluate).toHaveBeenCalled()

    it 'should return an empty string', ->
      expect(ret).toEqual ''

  describe 'Function', ->
    beforeEach ->
      spyOn(data, 'func').andCallThrough()
      ret = tpl.evaluate funcStr, data

    it 'should have been called', ->
      expect(tpl.evaluate).toHaveBeenCalled()

    it 'function should have been called', ->
      expect(data.func).toHaveBeenCalled()

    it 'should return the result of the call', ->
      expect(ret).toEqual 'Function call'

  describe 'Key', ->
    beforeEach ->
      ret = tpl.evaluate keyStr, data

    it 'should have been called', ->
      expect(tpl.evaluate).toHaveBeenCalled()

    it 'should return the correct value', ->
      expect(ret).toEqual 'Test key'

  describe 'Variable', ->
    beforeEach ->
      ret = tpl.evaluate variableStr, data

    it 'should have been called', ->
      expect(tpl.evaluate).toHaveBeenCalled()

    it 'should return the correct value', ->
      expect(ret).toEqual 'Test variable'

  describe 'Element', ->
    beforeEach ->
      tpl.addElements elements
      spyOn(tpl, 'evaluateElement').andCallThrough()
      ret = tpl.evaluate elementStr

    it 'should have been called', ->
      expect(tpl.evaluate).toHaveBeenCalled()

    it 'should call evaluateElement method', ->
      expect(tpl.evaluateElement).toHaveBeenCalled()

    it 'should return the correct value', ->
      expect(ret).toEqual 'Test element'

  describe 'Not a parseable element', ->
    beforeEach ->
      ret = tpl.evaluate str

    it 'should have been called', ->
      expect(tpl.evaluate).toHaveBeenCalled()

    it 'should return the string unchanged', ->
      expect(ret).toEqual 'Not an element'
