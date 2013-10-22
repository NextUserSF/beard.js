describe 'Foreach Helper', ->
  tpl = null
  ret = null

  beforeEach ->
    tpl = new Beard()

  afterEach ->
    tpl = null

  describe 'Array', ->
    beforeEach ->
      tpl.addVariable 'planets', ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']

    it 'should return correct values', ->
      tpl.set '<% foreach planets %>Hello <%= value %> <% endforeach %>'
      ret = tpl.render()

      expect(ret).toEqual 'Hello Mercury Hello Venus Hello Earth Hello Mars Hello Jupiter Hello Saturn Hello Uranus Hello Neptune '

    it 'should return correct keys', ->
      tpl.set '<% foreach planets %><%= key %><% endforeach %>'
      ret = tpl.render()

      expect(ret).toEqual '01234567'

    it 'should return correct keys and values', ->
      tpl.set '<% foreach planets %><%= key %><%= value %><% endforeach %>'
      ret = tpl.render()

      expect(ret).toEqual '0Mercury1Venus2Earth3Mars4Jupiter5Saturn6Uranus7Neptune'

  describe 'Object', ->
    beforeEach ->
      tpl.addVariable 'planets',
        me: 'Mercury',
        ve: 'Venus',
        ea: 'Earth',
        ma: 'Mars',
        ju: 'Jupiter',
        sa: 'Saturn',
        ur: 'Uranus',
        ne: 'Neptune'

    it 'should return correct values', ->
      tpl.set '<% foreach planets %><%= value %><% endforeach %>'
      ret = tpl.render()

      expect(ret).toEqual 'MercuryVenusEarthMarsJupiterSaturnUranusNeptune'

    it 'should return correct keys', ->
      tpl.set '<% foreach planets %><%= key %><% endforeach %>'
      ret = tpl.render()

      expect(ret).toEqual 'meveeamajusaurne'

    it 'should return correct keys and values', ->
      tpl.set '<% foreach planets %><%= key %><%= value %><% endforeach %>'
      ret = tpl.render()

      expect(ret).toEqual 'meMercuryveVenuseaEarthmaMarsjuJupitersaSaturnurUranusneNeptune'

  describe 'No Data', ->
    it 'should return nothing', ->
      tpl.set '<% foreach planets %><%= key %><%= value %><% endforeach %>'
      ret = tpl.render()

      expect(ret).toEqual ''

  describe 'Invalid Data', ->
    it 'should throw an error', ->
      tpl.set '<% foreach planets %><%= key %><%= value %><% endforeach %>'
      tpl.addVariable 'planets', 1024

      expect(-> tpl.render()).toThrow()
