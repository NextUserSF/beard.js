describe 'Data Tag', ->
  tpl = null
  ret = null

  beforeEach ->
    tpl = new Beard()

  afterEach ->
    tpl = null

  describe 'Plain Variable', ->
    it 'should return correct value', ->
      tpl.set '<%= variable | "Default" %>'
      tpl.addVariable 'variable', 'Variable'
      ret = tpl.render()

      expect(ret).toEqual 'Variable'

    it 'should return default value', ->
      tpl.set '<%= variable | "Default" %>'
      ret = tpl.render()

      expect(ret).toEqual 'Default'


  describe 'Nested Variable', ->
    it 'should return correct value', ->
      tpl.set '<%= nested.variable | "Default" %>'
      tpl.addVariable 'nested', variable: 'Nested Variable'
      ret = tpl.render()

      expect(ret).toEqual 'Nested Variable'

    it 'should return default value', ->
      tpl.set '<%= nested.variable | "Default" %>'
      ret = tpl.render()

      expect(ret).toEqual 'Default'

  describe 'Plain Function call', ->
    it 'should return correct value', ->
      tpl.set '<%= func() | "Default" %>'
      tpl.addVariable 'func', -> 'Function call'
      ret = tpl.render()

      expect(ret).toEqual 'Function call'

    it 'should return default value', ->
      tpl.set '<%= func() | "Default" %>'
      ret = tpl.render()

      expect(ret).toEqual 'Default'

    it 'should handle `this` correct', ->
      tpl.set '<%= full_name() %>'
      tpl.addVariable 'first_name', 'John'
      tpl.addVariable 'last_name', 'Doe'
      tpl.addVariable 'full_name', -> "#{this.first_name} #{this.last_name}"

      ret = tpl.render()

      expect(ret).toEqual 'John Doe'

  describe 'Plain Function call with Arguments', ->
    it 'should return correct value', ->
      tpl.set '<%= func("Function call") | "Default" %>'
      tpl.addVariable 'func', (x) -> x
      ret = tpl.render()

      expect(ret).toEqual 'Function call'
