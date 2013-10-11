describe 'Content', ->
  tpl = null
  ret = null

  beforeEach ->
    tpl = new Beard()

  afterEach ->
    tpl = null

  it 'should return content', ->
    tpl.set 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fermentum elementum metus, ac suscipit lectus pulvinar.'
    ret = tpl.render()

    expect(ret).toBe 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fermentum elementum metus, ac suscipit lectus pulvinar.'
