describe 'Template', ->
  tpl = null
  tplStr = '<b>Hello world!</b>'
  ret= null

  beforeEach ->
    tpl = new Beard()

  describe 'Set', ->
    beforeEach ->
      spyOn(tpl, 'set').andCallThrough()
      ret = tpl.set tplStr

    it 'should have beed called', ->
      expect(tpl.set).toHaveBeenCalled()

    it 'should not throw exceptions', ->
      expect(tpl.set).not.toThrow()

    it 'should have been called with proper argument', ->
      expect(tpl.set).toHaveBeenCalledWith '<b>Hello world!</b>'

    it 'should return current instance', ->
      expect(ret).toEqual tpl

  describe 'Set (empty)', ->
    beforeEach ->
      spyOn(tpl, 'set').andCallThrough()
      ret = tpl.set()

    it 'should have beed called', ->
      expect(tpl.set).toHaveBeenCalled()

    it 'should not throw exceptions', ->
      expect(tpl.set).not.toThrow()

    it 'should have been called with no argument', ->
      expect(tpl.set).toHaveBeenCalledWith()

    it 'should return current instance', ->
      expect(ret).toEqual tpl

  describe 'Get', ->
    beforeEach ->
      tpl.set tplStr
      spyOn(tpl, 'get').andCallThrough()
      ret = tpl.get()

    it 'should have beed called', ->
      expect(tpl.get).toHaveBeenCalled()

    it 'should not throw exceptions', ->
      expect(tpl.get).not.toThrow()

    it 'should return current template', ->
      expect(ret).toEqual '<b>Hello world!</b>'

  describe 'Get (empty)', ->
    beforeEach ->
      tpl.set()
      spyOn(tpl, 'get').andCallThrough()
      ret = tpl.get()

    it 'should have beed called', ->
      expect(tpl.get).toHaveBeenCalled()

    it 'should not throw exceptions', ->
      expect(tpl.get).not.toThrow()

    it 'should return empty string', ->
      expect(ret).toEqual ''
