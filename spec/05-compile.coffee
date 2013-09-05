describe 'Compile', ->
  tpl = null
  tplStr = '<%@ e1 %> <%@ e2 %> <%@ e3 %> <%= v1 %> <%= v2 %> <%= v3 %>'
  tplStrErr = '<%@ e1 %> <%@ e2 %> <%@ e3 %> <%= v1 <%= v2 %> <%= v3 %>'
  data =
    v1: 'v1'
    v2: 'v2'
    v3: 'v3'
  elements =
    e1: 'e1'
    e2: 'e2'
    e3: 'e3'
  ret = null

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'compile').andCallThrough()

  describe 'Elements, Variables and Template', ->
    beforeEach ->
      tpl.addElements elements
      ret = tpl.compile tplStr, data

    it 'should have been called', ->
      expect(tpl.compile).toHaveBeenCalled()

    it 'should return correct compiled template', ->
      expect(ret).toEqual 'e1 e2 e3 v1 v2 v3'

  describe 'Elements, no Variables and Template', ->
    beforeEach ->
      tpl.addElements elements
      ret = tpl.compile tplStr

    it 'should have been called', ->
      expect(tpl.compile).toHaveBeenCalled()

    it 'should return correct compiled template', ->
      expect(ret).toEqual 'e1 e2 e3'

  describe 'Variables, no Elements and Template', ->
    beforeEach ->
      ret = tpl.compile tplStr, data

    it 'should have been called', ->
      expect(tpl.compile).toHaveBeenCalled()

    it 'should return correct compiled template', ->
      expect(ret).toEqual 'Element e1 not found Element e2 not found Element e3 not found v1 v2 v3'

  describe 'Template, no Variables and no Elements', ->
    beforeEach ->
      ret = tpl.compile tplStr

    it 'should have been called', ->
      expect(tpl.compile).toHaveBeenCalled()

    it 'should return correct compiled template', ->
      expect(ret).toEqual 'Element e1 not found Element e2 not found Element e3 not found'

  describe 'Variables, Elements, no Template', ->
    beforeEach ->
      tpl.addElements elements
      ret = tpl.compile '', data

    it 'should have been called', ->
      expect(tpl.compile).toHaveBeenCalled()

    it 'should return correct compiled template', ->
      expect(ret).toEqual ''

  describe 'Invalid template', ->
    beforeEach ->
      tpl.addElements elements
      ret = tpl.compile tplStrErr, data

    it 'should have been called', ->
      expect(tpl.compile).toHaveBeenCalled()

    it 'should throw error', ->
      expect(tpl.compile).toThrow()
