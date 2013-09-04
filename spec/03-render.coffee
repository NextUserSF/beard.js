describe 'Render', ->
  tpl = null
  tplStr = '<b>Hello <%= who %>!</b>'
  data =
    who: 'world'
  ret = null

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'render').andCallThrough()

  describe 'Render with template and data', ->
    beforeEach ->
      tpl.set tplStr
      ret = tpl.render data

    it 'should have been called', ->
      expect(tpl.render).toHaveBeenCalled()

    it 'should have been called with data', ->
      expect(tpl.render).toHaveBeenCalledWith data

    it 'should return string', ->
      expect(ret).toEqual(jasmine.any String)

    it 'should return correct string', ->
      expect(ret).toEqual '<b>Hello world!</b>'

  describe 'Render with template and no data', ->
    beforeEach ->
      tpl.set tplStr
      ret = tpl.render()

    it 'should have been called', ->
      expect(tpl.render).toHaveBeenCalled()

    it 'should have been called without data', ->
      expect(tpl.render).toHaveBeenCalledWith()

    it 'should return string', ->
      expect(ret).toEqual(jasmine.any String)

    it 'should return correct string', ->
      expect(ret).toEqual '<b>Hello !</b>'

  describe 'Render without template but with data', ->
    beforeEach ->
      ret = tpl.render data

    it 'should have been called', ->
      expect(tpl.render).toHaveBeenCalled()

    it 'should have been called with data', ->
      expect(tpl.render).toHaveBeenCalledWith data

    it 'should return string', ->
      expect(ret).toEqual(jasmine.any String)

    it 'should return correct string', ->
      expect(ret).toEqual ''

  describe 'Render without template and without data', ->
    beforeEach ->
      ret = tpl.render()

    it 'should have been called', ->
      expect(tpl.render).toHaveBeenCalled()

    it 'should have been called without data', ->
      expect(tpl.render).toHaveBeenCalledWith()

    it 'should return string', ->
      expect(ret).toEqual(jasmine.any String)

    it 'should return correct string', ->
      expect(ret).toEqual ''
