describe 'Helpers', ->
  tpl = null
  ret = null

  beforeEach ->
    tpl = new Beard()

  afterEach ->
    tpl = null

  describe 'Block Helpers', ->
    beforeEach ->
      Beard.registerHelper 'block', (data, options) ->
        data = data[0]
        data = data.toUpperCase() if data?
        this.data = data
        options.fn(this)

    it 'should compile program', ->
      tpl.set '<% block %>Helper<% endblock %>'
      ret = tpl.render()

      expect(ret).toEqual 'Helper'

    it 'should process passed data', ->
      tpl.set '<% block v1 %><%= data %><% endblock %>'
      tpl.addVariable 'v1', 'data'
      ret = tpl.render()

      expect(ret).toEqual 'DATA'

    it 'should throw an error if syntax error', ->
      tpl.set '<% block %>Helper<% endfoo %>'
      expect(-> tpl.render()).toThrow()

    it 'should access «local» and «global» variables', ->
      tpl.set '<% block v1 %><%= v1 %> is <%= data %><% endblock %>'
      tpl.addVariable 'v1', 'data'
      ret = tpl.render()

      expect(ret).toEqual 'data is DATA'

    it 'should throw an error if helper is missing', ->
      tpl.set '<% missing %>Test<% endmissing %>'
      expect(-> tpl.render()).toThrow()

  describe 'Inline Helpers', ->
    beforeEach ->
      Beard.registerHelper 'inline', (args, options) -> 'Inline'
      Beard.registerHelper 'toUpper', (args, options) -> args.map((x) ->
        x.toUpperCase() if typeof x == 'string'
      ).join(' ')
      Beard.registerHelper 'asset', (args, options) ->
        this.new_var = 'New Variable'
        return

    it 'should return correct value', ->
      tpl.set '<%~ inline %>'
      ret = tpl.render()

      expect(ret).toEqual 'Inline'

    it 'should handle passed data', ->
      tpl.set '<%~ toUpper "upper case" %>'
      ret = tpl.render()

      expect(ret).toEqual 'UPPER CASE'

    it 'should handle passed variable', ->
      tpl.set '<%~ toUpper v1 %>'
      tpl.addVariable 'v1', 'variable'
      ret = tpl.render()

      expect(ret).toEqual 'VARIABLE'

    it 'should handle multiple passed arguments', ->
      tpl.set '<%~ toUpper v1, "test", f1() %>'
      tpl.addVariable 'v1', 'variable'
      tpl.addVariable 'f1', -> 'function'
      ret = tpl.render()

      expect(ret).toEqual 'VARIABLE TEST FUNCTION'

    it 'should be able to change «global» scope variables', ->
      tpl.set '<%~ asset %><%= new_var %>'
      ret = tpl.render()

      expect(ret).toEqual 'New Variable'
