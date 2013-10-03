describe 'If-Else Helper', ->
  tpl = null
  ret = null

  beforeEach ->
    tpl = new Beard()

  afterEach ->
    tpl = null

  describe 'Equals = (variable — parameter)', ->
    beforeEach ->
      tpl.set '<% if v1 = true %>True<% else %>False<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', 1
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', 0
      ret = tpl.render()

      expect(ret).toEqual 'False'

  describe 'Equals = (variable — variable)', ->
    beforeEach ->
      tpl.set '<% if v1 = v2 %>True<% else %>False<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', 1
      tpl.addVariable 'v2', 1
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', 1
      tpl.addVariable 'v2', 0
      ret = tpl.render()

      expect(ret).toEqual 'False'

  describe 'Equals == (variable — parameter)', ->
    beforeEach ->
      tpl.set '<% if v1 == true %>True<% else %>False<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', 1
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', 0
      ret = tpl.render()

      expect(ret).toEqual 'False'

  describe 'Equals == (variable — variable)', ->
    beforeEach ->
      tpl.set '<% if v1 == v2 %>True<% else %>False<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', 1
      tpl.addVariable 'v2', true
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', 1
      tpl.addVariable 'v2', 0
      ret = tpl.render()

      expect(ret).toEqual 'False'

  describe 'Equals === (variable — parameter)', ->
    beforeEach ->
      tpl.set '<% if v1 === true %>True<% else %>False<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', true
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', 1
      ret = tpl.render()

      expect(ret).toEqual 'False'

  describe 'Equals === (variable — variable)', ->
    beforeEach ->
      tpl.set '<% if v1 === v2 %>True<% else %>False<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', true
      tpl.addVariable 'v2', true
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', 1
      tpl.addVariable 'v2', true
      ret = tpl.render()

      expect(ret).toEqual 'False'

  describe 'Greater than (variable — parameter)', ->
    beforeEach ->
      tpl.set '<% if v1 > 512 %>Greater<% else %>Lesser<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', 1024
      ret = tpl.render()

      expect(ret).toEqual 'Greater'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', 256
      ret = tpl.render()

      expect(ret).toEqual 'Lesser'

  describe 'Greater than (variable — variable)', ->
    beforeEach ->
      tpl.set '<% if v1 > v2 %>Greater<% else %>Lesser<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', 1024
      tpl.addVariable 'v2', 512
      ret = tpl.render()

      expect(ret).toEqual 'Greater'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', 256
      tpl.addVariable 'v2', 512
      ret = tpl.render()

      expect(ret).toEqual 'Lesser'

  describe 'Lesser than (variable — parameter)', ->
    beforeEach ->
      tpl.set '<% if v1 < 512 %>Lesser<% else %>Greater<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', 256
      ret = tpl.render()

      expect(ret).toEqual 'Lesser'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', 1024
      ret = tpl.render()

      expect(ret).toEqual 'Greater'

  describe 'Lesser than (variable — variable)', ->
    beforeEach ->
      tpl.set '<% if v1 < v2 %>Lesser<% else %>Greater<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', 256
      tpl.addVariable 'v2', 512
      ret = tpl.render()

      expect(ret).toEqual 'Lesser'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', 1024
      tpl.addVariable 'v2', 512
      ret = tpl.render()

      expect(ret).toEqual 'Greater'

  describe 'AND (variable — parameter)', ->
    beforeEach ->
      tpl.set '<% if v1 && true %>True<% else %>False<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', true
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', false
      ret = tpl.render()

      expect(ret).toEqual 'False'

  describe 'AND (variable — variable)', ->
    beforeEach ->
      tpl.set '<% if v1 && v2 %>True<% else %>False<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', true
      tpl.addVariable 'v2', true
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', false
      tpl.addVariable 'v2', true
      ret = tpl.render()

      expect(ret).toEqual 'False'

  describe 'OR (variable — parameter)', ->
    beforeEach ->
      tpl.set '<% if v1 || false %>True<% else %>False<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', true
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', false
      ret = tpl.render()

      expect(ret).toEqual 'False'

  describe 'OR (variable — variable)', ->
    beforeEach ->
      tpl.set '<% if v1 || v2 %>True<% else %>False<% endif %>'

    it 'should return correct value', ->
      tpl.addVariable 'v1', true
      tpl.addVariable 'v2', false
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should return alternate value', ->
      tpl.addVariable 'v1', false
      tpl.addVariable 'v2', false
      ret = tpl.render()

      expect(ret).toEqual 'False'

  describe 'Truthy/Falsy conditions', ->
    beforeEach ->
      tpl.set '<% if v1 %>True<% else %>False<% endif %>'

    it 'should accept boolean true', ->
      tpl.addVariable 'v1', true
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should accept boolean false', ->
      tpl.addVariable 'v1', false
      ret = tpl.render()

      expect(ret).toEqual 'False'

    it 'should accept integer 1', ->
      tpl.addVariable 'v1', 1
      ret = tpl.render()

      expect(ret).toEqual 'True'

    it 'should accept integer 0', ->
      tpl.addVariable 'v1', 0
      ret = tpl.render()

      expect(ret).toEqual 'False'

    it 'should accept null', ->
      tpl.addVariable 'v1', null
      ret = tpl.render()

      expect(ret).toEqual 'False'

    it 'should accept undefined', ->
      ret = tpl.render()

      expect(ret).toEqual 'False'
