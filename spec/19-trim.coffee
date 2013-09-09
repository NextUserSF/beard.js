describe 'Trim', ->
  tpl = null
  ret = null

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'trim').andCallThrough()

  describe 'Empty string', ->
    beforeEach ->
      ret = tpl.trim ''

    it 'should have been called', ->
      expect(tpl.trim).toHaveBeenCalled()

    it 'should return an empty string', ->
      expect(ret).toEqual ''

  describe 'Whitespaces', ->
    it 'should trim spaces from the left', ->
      ret = tpl.trim '   s'
      expect(ret).toEqual 's'

    it 'should trim spaces from the right', ->
      ret = tpl.trim 's   '
      expect(ret).toEqual 's'

    it 'should trim spaces from the both ends', ->
      ret = tpl.trim '   s   '
      expect(ret).toEqual 's'

    it 'should trim tab-spaces and new-line characters', ->
      ret = tpl.trim '\t\t\ts\n\n\n'
      expect(ret).toEqual 's'

  describe 'Tokens', ->
    it 'should trim tokens from the left', ->
      ret = tpl.trim '"""s', '"'
      expect(ret).toEqual 's'

    it 'should trim tokens from the right', ->
      ret = tpl.trim 's"""', '"'
      expect(ret).toEqual 's'

    it 'should trim tokens from the both ends', ->
      ret = tpl.trim '"""s"""', '"'
      expect(ret).toEqual 's'

    it 'should trim multi-char tokens', ->
      ret = tpl.trim 'foosfoo', 'foo'
      expect(ret).toEqual 's'

    it 'should trim wide-char tokens', ->
      ret = tpl.trim '☺s☺', '☺'
      expect(ret).toEqual 's'
