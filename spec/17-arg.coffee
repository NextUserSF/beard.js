describe 'Argument', ->
  tpl = null
  ret = null

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'arg').andCallThrough()

  describe 'Empty', ->
    beforeEach ->
      ret = tpl.arg ''

    it 'should have been called', ->
      expect(tpl.arg).toHaveBeenCalled()

    it 'should return an empty string', ->
      expect(ret).toEqual ''

  describe 'True', ->
    beforeEach ->
      ret = tpl.arg 'true'

    it 'should have been called', ->
      expect(tpl.arg).toHaveBeenCalled()

    it 'should return true', ->
      expect(ret).toBeTruthy()

  describe 'False', ->
    beforeEach ->
      ret = tpl.arg 'false'

    it 'should have been called', ->
      expect(tpl.arg).toHaveBeenCalled()

    it 'should return false', ->
      expect(ret).toBeFalsy()

  describe 'Null', ->
    beforeEach ->
      ret = tpl.arg 'null'

    it 'should have been called', ->
      expect(tpl.arg).toHaveBeenCalled()

    it 'should return null', ->
      expect(ret).toBeNull()

  describe 'Undefined', ->
    beforeEach ->
      ret = tpl.arg 'undefined'

    it 'should have been called', ->
      expect(tpl.arg).toHaveBeenCalled()

    it 'should return undefined', ->
      expect(ret).toBeUndefined()

  describe 'Float', ->
    beforeEach ->
      ret = tpl.arg '3.14159'

    it 'should have been called', ->
      expect(tpl.arg).toHaveBeenCalled()

    it 'should return π', ->
      expect(ret).toEqual 3.14159

  describe 'Integer', ->
    beforeEach ->
      ret = tpl.arg '1024'

    it 'should have been called', ->
      expect(tpl.arg).toHaveBeenCalled()

    it 'should return 2¹⁰', ->
      expect(ret).toEqual 1024

  describe 'String', ->
    beforeEach ->
      ret = tpl.arg 'String'

    it 'should have been called', ->
      expect(tpl.arg).toHaveBeenCalled()

    it 'should return a string', ->
      expect(ret).toEqual 'String'
