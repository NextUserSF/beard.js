describe 'Get Required', ->
  tpl = null
  tplStrEV = '<%@ e1 %> <%@ e2 %> <%@ e3 %> <%= v1 %> <%= v2 %> <%= v3 %>'
  tplStrE = '<%@ e1 %> <%@ e2 %> <%@ e3 %>'
  tplStrV = '<%= v1 %> <%= v2 %> <%= v3 %>'
  ret = null

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'getRequired').andCallThrough()

  describe 'Elements and Variables (object template)', ->
    beforeEach ->
      tpl.set tplStrEV
      ret = tpl.getRequired()

    it 'should have been called', ->
      expect(tpl.getRequired).toHaveBeenCalled()

    it 'should return object', ->
      expect(ret).toEqual(jasmine.any Object)

    describe 'Elements', ->
      it 'should be an array', ->
        expect(ret.elements).toEqual(jasmine.any Array)

      it 'should be an array with three items', ->
        expect(ret.elements.length).toEqual 3

      it 'should contain correct value', ->
        expect(ret.elements).toContain 'e1'

      it 'should not contain incorrect value', ->
        expect(ret.elements).not.toContain 'v1'

    describe 'Variables', ->
      it 'should be an array', ->
        expect(ret.variables).toEqual(jasmine.any Array)

      it 'should be an array with three items', ->
        expect(ret.variables.length).toEqual 3

      it 'should contain correct value', ->
        expect(ret.variables).toContain 'v1'

      it 'should not contain incorrect value', ->
        expect(ret.variables).not.toContain 'e1'

  describe 'Elements and Variables (passed template)', ->
    beforeEach ->
      ret = tpl.getRequired tplStrEV

    it 'should have been called', ->
      expect(tpl.getRequired).toHaveBeenCalled()

    it 'should return object', ->
      expect(ret).toEqual(jasmine.any Object)

    describe 'Elements', ->
      it 'should be an array', ->
        expect(ret.elements).toEqual(jasmine.any Array)

      it 'should be an array with three items', ->
        expect(ret.elements.length).toEqual 3

      it 'should contain correct value', ->
        expect(ret.elements).toContain 'e1'

      it 'should not contain incorrect value', ->
        expect(ret.elements).not.toContain 'v1'

    describe 'Variables', ->
      it 'should be an array', ->
        expect(ret.variables).toEqual(jasmine.any Array)

      it 'should be an array with three items', ->
        expect(ret.variables.length).toEqual 3

      it 'should contain correct value', ->
        expect(ret.variables).toContain 'v1'

      it 'should not contain incorrect value', ->
        expect(ret.variables).not.toContain 'e1'

  describe 'Elements, not Variables (object template)', ->
    beforeEach ->
      tpl.set tplStrE
      ret = tpl.getRequired()

    it 'should have been called', ->
      expect(tpl.getRequired).toHaveBeenCalled()

    it 'should return object', ->
      expect(ret).toEqual(jasmine.any Object)

    describe 'Elements', ->
      it 'should be an array', ->
        expect(ret.elements).toEqual(jasmine.any Array)

      it 'should be an array with three items', ->
        expect(ret.elements.length).toEqual 3

      it 'should contain correct value', ->
        expect(ret.elements).toContain 'e1'

      it 'should not contain incorrect value', ->
        expect(ret.elements).not.toContain 'v1'

    describe 'Variables', ->
      it 'should be an array', ->
        expect(ret.variables).toEqual(jasmine.any Array)

      it 'should be an array with no items', ->
        expect(ret.variables.length).toEqual 0

  describe 'Elements, not Variables (passed template)', ->
    beforeEach ->
      ret = tpl.getRequired tplStrE

    it 'should have been called', ->
      expect(tpl.getRequired).toHaveBeenCalled()

    it 'should return object', ->
      expect(ret).toEqual(jasmine.any Object)

    describe 'Elements', ->
      it 'should be an array', ->
        expect(ret.elements).toEqual(jasmine.any Array)

      it 'should be an array with three items', ->
        expect(ret.elements.length).toEqual 3

      it 'should contain correct value', ->
        expect(ret.elements).toContain 'e1'

      it 'should not contain incorrect value', ->
        expect(ret.elements).not.toContain 'v1'

    describe 'Variables', ->
      it 'should be an array', ->
        expect(ret.variables).toEqual(jasmine.any Array)

      it 'should be an array with no items', ->
        expect(ret.variables.length).toEqual 0

  describe 'Variables, not Elements (object template)', ->
    beforeEach ->
      tpl.set tplStrV
      ret = tpl.getRequired()

    it 'should have been called', ->
      expect(tpl.getRequired).toHaveBeenCalled()

    it 'should return object', ->
      expect(ret).toEqual(jasmine.any Object)

    describe 'Elements', ->
      it 'should be an array', ->
        expect(ret.elements).toEqual(jasmine.any Array)

      it 'should be an array with no items', ->
        expect(ret.elements.length).toEqual 0

    describe 'Variables', ->
      it 'should be an array', ->
        expect(ret.variables).toEqual(jasmine.any Array)

      it 'should be an array with three items', ->
        expect(ret.variables.length).toEqual 3

      it 'should contain correct value', ->
        expect(ret.variables).toContain 'v1'

      it 'should not contain incorrect value', ->
        expect(ret.variables).not.toContain 'e1'

  describe 'Variables, not Elements (passed template)', ->
    beforeEach ->
      ret = tpl.getRequired tplStrV

    it 'should have been called', ->
      expect(tpl.getRequired).toHaveBeenCalled()

    it 'should return object', ->
      expect(ret).toEqual(jasmine.any Object)

    describe 'Elements', ->
      it 'should be an array', ->
        expect(ret.elements).toEqual(jasmine.any Array)

      it 'should be an array with no items', ->
        expect(ret.elements.length).toEqual 0

    describe 'Variables', ->
      it 'should be an array', ->
        expect(ret.variables).toEqual(jasmine.any Array)

      it 'should be an array with three items', ->
        expect(ret.variables.length).toEqual 3

      it 'should contain correct value', ->
        expect(ret.variables).toContain 'v1'

      it 'should not contain incorrect value', ->
        expect(ret.variables).not.toContain 'e1'

  describe 'No Variables, no Elements', ->
    beforeEach ->
      ret = tpl.getRequired()

    it 'should have been called', ->
      expect(tpl.getRequired).toHaveBeenCalled()

    it 'should return object', ->
      expect(ret).toEqual(jasmine.any Object)

    describe 'Elements', ->
      it 'should be an array', ->
        expect(ret.elements).toEqual(jasmine.any Array)

      it 'should be an array with no items', ->
        expect(ret.elements.length).toEqual 0

    describe 'Variables', ->
      it 'should be an array', ->
        expect(ret.variables).toEqual(jasmine.any Array)

      it 'should be an array with no items', ->
        expect(ret.variables.length).toEqual 0
