describe 'Nested Variables', ->
  tpl = null
  ret = null
  data =
    v0: 'Level 0'
    v1:
      v1_1: 'Level 1'
    v2:
      v2_1:
        v2_1_1: 'Level 2'

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'key').andCallThrough()

  describe 'Variable', ->
    describe 'Level Zero', ->
      beforeEach ->
        ret = tpl.key data, 'v0'

      it 'should have been called', ->
        expect(tpl.key).toHaveBeenCalled()

      it 'should return the correct value', ->
        expect(ret).toEqual 'Level 0'

    describe 'Level One', ->
      beforeEach ->
        ret = tpl.key data, 'v1.v1_1'

      it 'should have been called', ->
        expect(tpl.key).toHaveBeenCalled()

      it 'should return the correct value', ->
        expect(ret).toEqual 'Level 1'

    describe 'Level Two', ->
      beforeEach ->
        ret = tpl.key data, 'v2.v2_1.v2_1_1'

      it 'should have been called', ->
        expect(tpl.key).toHaveBeenCalled()

      it 'should return the correct value', ->
        expect(ret).toEqual 'Level 2'

  describe 'Parent', ->
    describe 'Level Zero', ->
      beforeEach ->
        ret = tpl.key data, 'v0', true

      it 'should have been called', ->
        expect(tpl.key).toHaveBeenCalled()

      it 'should return parent', ->
        expect(ret.parent).toEqual data

      it 'should return the correct value', ->
        expect(ret.ref).toEqual 'Level 0'

    describe 'Level One', ->
      beforeEach ->
        ret = tpl.key data, 'v1.v1_1', true

      it 'should have been called', ->
        expect(tpl.key).toHaveBeenCalled()

      it 'should return parent', ->
        expect(ret.parent).toEqual data.v1

      it 'should return the correct value', ->
        expect(ret.ref).toEqual 'Level 1'

    describe 'Level Two', ->
      beforeEach ->
        ret = tpl.key data, 'v2.v2_1.v2_1_1', true

      it 'should have been called', ->
        expect(tpl.key).toHaveBeenCalled()

      it 'should return parent', ->
        expect(ret.parent).toEqual data.v2.v2_1

      it 'should return the correct value', ->
        expect(ret.ref).toEqual 'Level 2'
