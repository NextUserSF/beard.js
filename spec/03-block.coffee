describe 'Block Helpers', ->
  tpl = null
  ret = null

  beforeEach ->
    tpl = new Beard()

  afterEach ->
    tpl = null

  describe 'Foreach Iterator (Array)', ->
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

  describe 'Foreach Iterator (Object)', ->
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

  describe 'Foreach Iterator (No Data)', ->
    it 'should return nothing', ->
      tpl.set '<% foreach planets %><%= key %><%= value %><% endforeach %>'
      ret = tpl.render()

      expect(ret).toEqual ''

  describe 'Foreach Iterator (Invalid Data)', ->
    it 'should throw an error', ->
      tpl.set '<% foreach planets %><%= key %><%= value %><% endforeach %>'
      tpl.addVariable 'planets', 1024

      expect(-> tpl.render()).toThrow()

  describe 'Tests', ->
    it 'should return correct value', ->
      tpl.set '<% if v1 = true %>True<% endif %>'
      tpl.addVariable 'v1', true
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should return alternate value', ->
      tpl.set '<% if v1 = true%>True<% else %>False<% endif %>'
      tpl.addVariable 'v1', false
      ret = tpl.render()

      expect(ret).toEqual 'False'
