describe 'Evaluate Element', ->
  tpl = null
  ret = null
  elements =
    e1: 'e1'
    e2: 'Hello <%= v1 %> world'
  data =
    v1: 'v1'
    v2: 'v2'

  beforeEach ->
    tpl = new Beard
    spyOn(tpl, 'evaluateElement').andCallThrough()

  describe 'Plain Elements', ->
    beforeEach ->
      tpl.addElements elements
      ret = tpl.evaluateElement 'e1'

    it 'should have been called', ->
      expect(tpl.evaluateElement).toHaveBeenCalled()

    it 'should return the correct value', ->
      expect(ret).toEqual 'e1'

  describe 'Elements with', ->
    describe 'Object\'s variables', ->
      beforeEach ->
        tpl = new Beard '', data, elements
        spyOn(tpl, 'evaluateElement').andCallThrough()
        ret = tpl.evaluateElement 'e2'

      it 'should have been called', ->
        expect(tpl.evaluateElement).toHaveBeenCalled()

      it 'should return the correct value', ->
        expect(ret).toEqual 'Hello v1 world'

    describe 'Passed variables', ->
      beforeEach ->
        tpl = new Beard '', {}, elements
        spyOn(tpl, 'evaluateElement').andCallThrough()
        ret = tpl.evaluateElement 'e2', data

      it 'should have been called', ->
        expect(tpl.evaluateElement).toHaveBeenCalled()

      it 'should return the correct value', ->
        expect(ret).toEqual 'Hello v1 world'
