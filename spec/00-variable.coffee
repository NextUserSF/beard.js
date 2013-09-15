describe 'Data Tag', ->
  tpl = null
  ret = null

  beforeEach ->
    tpl = new Beard()

  afterEach ->
    tpl = null

  describe 'Plain Variable', ->
    it 'should return correct value', ->
      tpl.set '<%= variable %>'
      tpl.addVariable 'variable', 'Variable'
      ret = tpl.render()

      expect(ret).toEqual 'Variable'

    it 'should return default value', ->
      tpl.set '<%= variable | "Default" %>'
      ret = tpl.render()

      expect(ret).toEqual 'Default'


  describe 'Nested Variable', ->
    it 'should return correct value', ->
      tpl.set '<%= nested.variable %>'
      tpl.addVariable 'nested', variable: 'Nested Variable'
      ret = tpl.render()

      expect(ret).toEqual 'Nested Variable'

    it 'should return default value', ->
      tpl.set '<%= nested.variable | "Default" %>'
      ret = tpl.render()

      expect(ret).toEqual 'Default'

  describe 'Plain Function Call', ->
    it 'should return correct value', ->
      tpl.set '<%= func() %>'
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

  describe 'Plain Function Call with Arguments', ->
    it 'should return correct value', ->
      tpl.set '<%= func("Function call") %>'
      tpl.addVariable 'func', (x) -> x
      ret = tpl.render()

      expect(ret).toEqual 'Function call'

    it 'should return default value', ->
      tpl.set '<%= func("Function call") | "Default" %>'
      ret = tpl.render()

      expect(ret).toEqual 'Default'

  describe 'Nested Function Call', ->
    it 'should return correct value', ->
      tpl.set '<%= nested.func() | "Default" %>'
      tpl.addVariable 'nested', func: -> 'Function call'
      ret = tpl.render()

      expect(ret).toEqual 'Function call'

    it 'should return default value', ->
      tpl.set '<%= nested.func() | "Default" %>'
      ret = tpl.render()

      expect(ret).toEqual 'Default'

    it 'should handle `this` correct', ->
      tpl.set '<%= nested.full_name() %>'
      tpl.addVariable 'first_name', 'Robert'
      tpl.addVariable 'last_name', 'Roe'
      tpl.addVariable 'full_name', -> "#{this.first_name} #{this.last_name}"
      tpl.addVariable 'nested',
        first_name: 'John'
        last_name: 'Doe'
        full_name: -> "#{this.first_name} #{this.last_name}"

      ret = tpl.render()

      expect(ret).toEqual 'John Doe'

  describe 'Nested Function Call with Arguments', ->
    it 'should return correct value', ->
      tpl.set '<%= nested.func("Function call") | "Default" %>'
      tpl.addVariable 'nested', func: (x) -> x
      ret = tpl.render()

      expect(ret).toEqual 'Function call'

  describe 'Plain Function-Value mixture', ->
    it 'should return correct value', ->
      tpl.set '<%= func().variable %>'
      tpl.addVariable 'func', -> variable: 'Variable'
      ret = tpl.render()

      expect(ret).toEqual 'Variable'

  describe 'Default parameters', ->
    it 'should return String', ->
      tpl.set '<%= variable | "Default" %>'
      ret = tpl.render()

      expect(ret).toEqual 'Default'

    it 'should return Integer', ->
      tpl.set '<%= variable | 1024 %>'
      ret = tpl.render()

      expect(ret).toEqual '1024'

    it 'should return Boolean', ->
      tpl.set '<%= variable | true %>'
      ret = tpl.render()

      expect(ret).toEqual 'true'
