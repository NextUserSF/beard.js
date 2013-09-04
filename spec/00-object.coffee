describe 'Object', ->
  tpl = null

  beforeEach ->
    spyOn window, 'Beard'
    tpl = new Beard()

  it 'should instantiate', ->
    expect(window.Beard).toHaveBeenCalled()

  it 'should not throw exceptions', ->
    expect(window.Beard).not.toThrow()
