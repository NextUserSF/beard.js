describe 'List', ->
  tpl = null
  tplStr = 'Hello <%= v1 %> <%= v2 %> <%= v3 %> world'
  data = [
    { v1: 'v1' }
    { v2: 'v2' }
    { v3: 'v3' }
  ]
  ret = null

  beforeEach ->
    tpl = new Beard()
    spyOn(tpl, 'list').andCallThrough()
    ret = tpl.list tplStr, data

  it 'should have been called', ->
    expect(tpl.list).toHaveBeenCalled()

  it 'should return correct compiled template', ->
    expect(ret).toEqual('Hello v1 v2 v3 world')
