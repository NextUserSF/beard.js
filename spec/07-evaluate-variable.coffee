describe 'Evaluate Variable', ->
  tpl = null
  ret = null
  varStr = 'v1'
  varDefStr = 'v1 | Default value'
  noVarStr = 'x1'
  noVarDefStr = 'x1 | Default value'
  data =
    v1: 'v1'

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'evaluateVariable').andCallThrough()

  describe 'Existing Variable without Default', ->
    beforeEach ->
      ret = tpl.evaluateVariable varStr, data

    it 'should have been called', ->
      expect(tpl.evaluateVariable).toHaveBeenCalled()

    it 'should return variable\'s value', ->
      expect(ret).toEqual 'v1'

  describe 'Existing Variable with Default', ->
    beforeEach ->
      ret = tpl.evaluateVariable varDefStr, data

    it 'should have been called', ->
      expect(tpl.evaluateVariable).toHaveBeenCalled()

    it 'should return variable\'s value', ->
      expect(ret).toEqual 'v1'

  describe 'Inexisting Variable without Default', ->
    beforeEach ->
      ret = tpl.evaluateVariable noVarStr, data

    it 'should have been called', ->
      expect(tpl.evaluateVariable).toHaveBeenCalled()

    it 'should return an empty string', ->
      expect(ret).toEqual ''

  describe 'Inexisting Variable with Default', ->
    beforeEach ->
      ret = tpl.evaluateVariable noVarDefStr, data

    it 'should have been called', ->
      expect(tpl.evaluateVariable).toHaveBeenCalled()

    it 'should return the default value', ->
      expect(ret).toEqual 'Default value'
