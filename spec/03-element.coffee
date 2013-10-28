describe 'Element Tag', ->
  tpl = null
  ret = null

  beforeEach ->
    tpl = new Beard()

  afterEach ->
    tpl = null

  describe 'Plain Element', ->
    it 'should return correct value', ->
      tpl.set '<%@ element %>'
      tpl.addElement 'element', 'Element'
      ret = tpl.render()

      expect(ret).toEqual 'Element'

  describe 'Element with Variable', ->
    it 'should return correct value', ->
      tpl.set '<%@ element %>'
      tpl.addElement 'element', '<%= variable %>'
      tpl.addVariable 'variable', 'Variable'
      ret = tpl.render()

      expect(ret).toEqual 'Variable'

  describe 'Element with Element', ->
    it 'should return correct value', ->
      tpl.set '<%@ element %>'
      tpl.addElement 'element', '<%@ another_element %>'
      tpl.addElement 'another_element', 'Element'
      ret = tpl.render()

      expect(ret).toEqual 'Element'

  describe 'Invalid Element', ->
    it 'should do something sane', ->
      tpl.set '<%@ element %>'

      expect(-> tpl.render()).toThrow 'The element is missing'
