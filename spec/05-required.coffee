describe 'Get Required', ->
  tpl = null
  ret = null

  beforeEach ->
    tpl = new Beard()

  afterEach ->
    tpl = null

  describe 'Variables', ->
    it 'should return correct object', ->
      obj =
        variables: ['v1', 'v2', 'v3']
        elements: []

      tpl.set '<%= v1 %><%= v2 %><%= v3 %>'
      ret = tpl.getRequired()

      expect(ret).toEqual obj

  describe 'Elements', ->
    it 'should return correct object', ->
      obj =
        variables: []
        elements: ['e1', 'e2', 'e3']

      tpl.set '<%@ e1 %><%@ e2 %><%@ e3 %>'
      ret = tpl.getRequired()

      expect(ret).toEqual obj

  describe 'Elements and Variables', ->
    it 'should return correct object', ->
      obj =
        variables: ['v1', 'v2', 'v3']
        elements: ['e1', 'e2', 'e3']

      tpl.set '<%= v1 %><%@ e1 %><%= v2 %><%@ e2 %><%= v3 %><%@ e3 %>'
      ret = tpl.getRequired()

      expect(ret).toEqual obj
