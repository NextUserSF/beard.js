// Generated by CoffeeScript 1.6.3
(function() {
  describe('Content', function() {
    var ret, tpl;
    tpl = null;
    ret = null;
    beforeEach(function() {
      return tpl = new Beard();
    });
    afterEach(function() {
      return tpl = null;
    });
    it('should return content', function() {
      tpl.set('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fermentum elementum metus, ac suscipit lectus pulvinar.');
      ret = tpl.render();
      return expect(ret).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur fermentum elementum metus, ac suscipit lectus pulvinar.');
    });
    it('should compile an empty string', function() {
      tpl.set('');
      ret = tpl.render();
      return expect(ret).toBe('');
    });
    return it('should compile undefined string', function() {
      tpl.set(void 0);
      ret = tpl.render();
      return expect(ret).toBe('');
    });
  });

  describe('Data Tag', function() {
    var ret, tpl;
    tpl = null;
    ret = null;
    beforeEach(function() {
      return tpl = new Beard();
    });
    afterEach(function() {
      return tpl = null;
    });
    describe('String', function() {
      return it('should return correct value', function() {
        tpl.set('<%= "Test" %>');
        ret = tpl.render();
        return expect(ret).toBe('Test');
      });
    });
    describe('String + Content', function() {
      return it('should return correct value', function() {
        tpl.set('Hello, <%= "World" %>!');
        ret = tpl.render();
        return expect(ret).toBe('Hello, World!');
      });
    });
    describe('Integer', function() {
      return it('should return correct value', function() {
        tpl.set('<%= 1024 %>');
        ret = tpl.render();
        return expect(ret).toBe(1024);
      });
    });
    describe('Integer + Content', function() {
      return it('should return correct value', function() {
        tpl.set('2^10=<%= 1024 %>');
        ret = tpl.render();
        return expect(ret).toBe('2^10=1024');
      });
    });
    describe('Boolean', function() {
      return it('should return correct value', function() {
        tpl.set('<%= true %>');
        ret = tpl.render();
        return expect(ret).toBe(true);
      });
    });
    describe('Boolean + Content', function() {
      return it('should return correct value', function() {
        tpl.set('True is <%= true %>');
        ret = tpl.render();
        return expect(ret).toBe('True is true');
      });
    });
    describe('Plain Variable', function() {
      beforeEach(function() {
        return tpl.set('<%= variable | "Default" %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('variable', 'Variable');
        ret = tpl.render();
        return expect(ret).toEqual('Variable');
      });
      it('should return default value', function() {
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
      return it('should handle 0 correctly', function() {
        tpl.addVariable('variable', 0);
        ret = tpl.render();
        return expect(ret).toBe(0);
      });
    });
    describe('Nested Variable', function() {
      it('should return correct value', function() {
        tpl.set('<%= nested.variable %>');
        tpl.addVariable('nested', {
          variable: 'Nested Variable'
        });
        ret = tpl.render();
        return expect(ret).toEqual('Nested Variable');
      });
      return it('should return default value', function() {
        tpl.set('<%= nested.variable | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
    });
    describe('Plain Function Call', function() {
      it('should return correct value', function() {
        tpl.set('<%= func() %>');
        tpl.addVariable('func', function() {
          return 'Function call';
        });
        ret = tpl.render();
        return expect(ret).toEqual('Function call');
      });
      it('should return default value', function() {
        tpl.set('<%= func() | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
      return it('should handle `this` correct', function() {
        tpl.set('<%= full_name() %>');
        tpl.addVariable('first_name', 'John');
        tpl.addVariable('last_name', 'Doe');
        tpl.addVariable('full_name', function() {
          return "" + this.first_name + " " + this.last_name;
        });
        ret = tpl.render();
        return expect(ret).toEqual('John Doe');
      });
    });
    describe('Plain Function Call with Arguments', function() {
      it('should return correct value', function() {
        tpl.set('<%= func("Function call") %>');
        tpl.addVariable('func', function(x) {
          return x;
        });
        ret = tpl.render();
        return expect(ret).toEqual('Function call');
      });
      return it('should return default value', function() {
        tpl.set('<%= func("Function call") | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
    });
    describe('Nested Function Call', function() {
      it('should return correct value', function() {
        tpl.set('<%= nested.func() | "Default" %>');
        tpl.addVariable('nested', {
          func: function() {
            return 'Function call';
          }
        });
        ret = tpl.render();
        return expect(ret).toEqual('Function call');
      });
      it('should return default value', function() {
        tpl.set('<%= nested.func() | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
      return it('should handle `this` correct', function() {
        tpl.set('<%= nested.full_name() %>');
        tpl.addVariable('first_name', 'Robert');
        tpl.addVariable('last_name', 'Roe');
        tpl.addVariable('full_name', function() {
          return "" + this.first_name + " " + this.last_name;
        });
        tpl.addVariable('nested', {
          first_name: 'John',
          last_name: 'Doe',
          full_name: function() {
            return "" + this.first_name + " " + this.last_name;
          }
        });
        ret = tpl.render();
        return expect(ret).toEqual('Robert Roe');
      });
    });
    describe('Nested Function Call with Arguments', function() {
      return it('should return correct value', function() {
        tpl.set('<%= nested.func("Function call") | "Default" %>');
        tpl.addVariable('nested', {
          func: function(x) {
            return x;
          }
        });
        ret = tpl.render();
        return expect(ret).toEqual('Function call');
      });
    });
    describe('Plain Function-Variable mixture', function() {
      it('should return correct value', function() {
        tpl.set('<%= func().variable %>');
        tpl.addVariable('func', function() {
          return {
            variable: 'Variable'
          };
        });
        ret = tpl.render();
        return expect(ret).toEqual('Variable');
      });
      return it('should return default value', function() {
        tpl.set('<%= func().variable | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
    });
    describe('Plain Function-Variable mixture (Arguments)', function() {
      it('should return correct value', function() {
        tpl.set('<%= func("variable", "Variable").variable %>');
        tpl.addVariable('func', function(x, y) {
          var o;
          o = {};
          o[x] = y;
          return o;
        });
        ret = tpl.render();
        return expect(ret).toEqual('Variable');
      });
      return it('should return default value', function() {
        tpl.set('<%= func("variable", "Variable").variable | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
    });
    describe('Nested Function-Variable mixture', function() {
      it('should return correct value', function() {
        tpl.set('<%= nested.func().nested.variable %>');
        tpl.addVariable('nested', {
          func: function() {
            return {
              nested: {
                variable: 'Variable'
              }
            };
          }
        });
        ret = tpl.render();
        return expect(ret).toEqual('Variable');
      });
      return it('should return default value', function() {
        tpl.set('<%= nested.func().nested.variable | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
    });
    describe('Nested Function-Variable mixture (Arguments)', function() {
      it('should return correct value', function() {
        tpl.set('<%= nested.func("nested", "variable", "Variable").nested.variable %>');
        tpl.addVariable('nested', {
          func: function(x, y, z) {
            var o;
            o = {};
            o[x] = {};
            o[x][y] = z;
            return o;
          }
        });
        ret = tpl.render();
        return expect(ret).toEqual('Variable');
      });
      return it('should return default value', function() {
        tpl.set('<%= nested.func("nested", "varialbe", "Variable").nested.variable | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
    });
    describe('Plain Function-Function mixture', function() {
      it('should return correct value', function() {
        tpl.set('<%= func().func() %>');
        tpl.addVariable('func', function() {
          return {
            func: function() {
              return 'Function call';
            }
          };
        });
        ret = tpl.render();
        return expect(ret).toEqual('Function call');
      });
      return it('should return default value', function() {
        tpl.set('<%= func().func() | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
    });
    describe('Plain Function-Function mixture (Arguments)', function() {
      it('should return correct value', function() {
        tpl.set('<%= func("Function").func("call") %>');
        tpl.addVariable('func', function(x) {
          return {
            func: function(y) {
              return "" + x + " " + y;
            }
          };
        });
        ret = tpl.render();
        return expect(ret).toEqual('Function call');
      });
      return it('should return default value', function() {
        tpl.set('<%= func("Function").func("call") | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
    });
    describe('Nested Function-Function mixture', function() {
      it('should return correct value', function() {
        tpl.set('<%= nested.func().nested.func() %>');
        tpl.addVariable('nested', {
          func: function() {
            return {
              nested: {
                func: function() {
                  return 'Function call';
                }
              }
            };
          }
        });
        ret = tpl.render();
        return expect(ret).toEqual('Function call');
      });
      return it('should return default value', function() {
        tpl.set('<%= nested.func().nested.func() | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
    });
    describe('Nested Function-Function mixture (Arguments)', function() {
      it('should return correct value', function() {
        tpl.set('<%= nested.func("Function").nested.func("call") %>');
        tpl.addVariable('nested', {
          func: function(x) {
            return {
              nested: {
                func: function(y) {
                  return "" + x + " " + y;
                }
              }
            };
          }
        });
        ret = tpl.render();
        return expect(ret).toEqual('Function call');
      });
      return it('should return default value', function() {
        tpl.set('<%= nested.func("Function").nested.func("call") | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
    });
    return describe('Default parameters', function() {
      it('should return String', function() {
        tpl.set('<%= variable | "Default" %>');
        ret = tpl.render();
        return expect(ret).toEqual('Default');
      });
      it('should return Integer', function() {
        tpl.set('<%= variable | 1024 %>');
        ret = tpl.render();
        return expect(ret).toBe(1024);
      });
      return it('should return Boolean', function() {
        tpl.set('<%= variable | true %>');
        ret = tpl.render();
        return expect(ret).toBe(true);
      });
    });
  });

  describe('Comment Tag', function() {
    var ret, tpl;
    tpl = null;
    ret = null;
    beforeEach(function() {
      tpl = new Beard();
      tpl.set('<%# This is comment %>');
      return ret = tpl.render();
    });
    afterEach(function() {
      return tpl = null;
    });
    return it('should return undefined', function() {
      return expect(ret).not.toBeDefined();
    });
  });

  describe('Element Tag', function() {
    var ret, tpl;
    tpl = null;
    ret = null;
    beforeEach(function() {
      return tpl = new Beard();
    });
    afterEach(function() {
      return tpl = null;
    });
    describe('Plain Element', function() {
      return it('should return correct value', function() {
        tpl.set('<%@ element %>');
        tpl.addElement('element', 'Element');
        ret = tpl.render();
        return expect(ret).toEqual('Element');
      });
    });
    describe('Element with Variable', function() {
      return it('should return correct value', function() {
        tpl.set('<%@ element %>');
        tpl.addElement('element', '<%= variable %>');
        tpl.addVariable('variable', 'Variable');
        ret = tpl.render();
        return expect(ret).toEqual('Variable');
      });
    });
    return describe('Element with Element', function() {
      return it('should return correct value', function() {
        tpl.set('<%@ element %>');
        tpl.addElement('element', '<%@ another_element %>');
        tpl.addElement('another_element', 'Element');
        ret = tpl.render();
        return expect(ret).toEqual('Element');
      });
    });
  });

  describe('Foreach Helper', function() {
    var ret, tpl;
    tpl = null;
    ret = null;
    beforeEach(function() {
      return tpl = new Beard();
    });
    afterEach(function() {
      return tpl = null;
    });
    describe('Array', function() {
      beforeEach(function() {
        return tpl.addVariable('planets', ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']);
      });
      it('should return correct values', function() {
        tpl.set('<% foreach planets %>Hello <%= value %> <% endforeach %>');
        ret = tpl.render();
        return expect(ret).toEqual('Hello Mercury Hello Venus Hello Earth Hello Mars Hello Jupiter Hello Saturn Hello Uranus Hello Neptune ');
      });
      it('should return correct keys', function() {
        tpl.set('<% foreach planets %><%= key %><% endforeach %>');
        ret = tpl.render();
        return expect(ret).toEqual('01234567');
      });
      return it('should return correct keys and values', function() {
        tpl.set('<% foreach planets %><%= key %><%= value %><% endforeach %>');
        ret = tpl.render();
        return expect(ret).toEqual('0Mercury1Venus2Earth3Mars4Jupiter5Saturn6Uranus7Neptune');
      });
    });
    describe('Object', function() {
      beforeEach(function() {
        return tpl.addVariable('planets', {
          me: 'Mercury',
          ve: 'Venus',
          ea: 'Earth',
          ma: 'Mars',
          ju: 'Jupiter',
          sa: 'Saturn',
          ur: 'Uranus',
          ne: 'Neptune'
        });
      });
      it('should return correct values', function() {
        tpl.set('<% foreach planets %><%= value %><% endforeach %>');
        ret = tpl.render();
        return expect(ret).toEqual('MercuryVenusEarthMarsJupiterSaturnUranusNeptune');
      });
      it('should return correct keys', function() {
        tpl.set('<% foreach planets %><%= key %><% endforeach %>');
        ret = tpl.render();
        return expect(ret).toEqual('meveeamajusaurne');
      });
      return it('should return correct keys and values', function() {
        tpl.set('<% foreach planets %><%= key %><%= value %><% endforeach %>');
        ret = tpl.render();
        return expect(ret).toEqual('meMercuryveVenuseaEarthmaMarsjuJupitersaSaturnurUranusneNeptune');
      });
    });
    describe('No Data', function() {
      return it('should return nothing', function() {
        tpl.set('<% foreach planets %><%= key %><%= value %><% endforeach %>');
        ret = tpl.render();
        return expect(ret).toEqual('');
      });
    });
    return describe('Invalid Data', function() {
      return it('should throw an error', function() {
        tpl.set('<% foreach planets %><%= key %><%= value %><% endforeach %>');
        tpl.addVariable('planets', 1024);
        return expect(function() {
          return tpl.render();
        }).toThrow();
      });
    });
  });

  describe('If-Else Helper', function() {
    var ret, tpl;
    tpl = null;
    ret = null;
    beforeEach(function() {
      return tpl = new Beard();
    });
    afterEach(function() {
      return tpl = null;
    });
    describe('Equals == (no Else)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 == true %>True<% endif %>');
      });
      return it('should return correct value', function() {
        tpl.addVariable('v1', 1);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
    });
    describe('Equals == (variable — parameter)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 == true %>True<% else %>False<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', 1);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', 0);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
    describe('Equals == (parameter — variable)', function() {
      beforeEach(function() {
        return tpl.set('<% if true == v1 %>True<% else %>False<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', 1);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', 0);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
    describe('Equals == (variable — variable)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 == v2 %>True<% else %>False<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', 1);
        tpl.addVariable('v2', true);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', 1);
        tpl.addVariable('v2', 0);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
    describe('Equals === (variable — parameter)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 === true %>True<% else %>False<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', true);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', 1);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
    describe('Equals === (parameter — variable)', function() {
      beforeEach(function() {
        return tpl.set('<% if true === v1 %>True<% else %>False<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', true);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', 1);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
    describe('Equals === (variable — variable)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 === v2 %>True<% else %>False<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', true);
        tpl.addVariable('v2', true);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', 1);
        tpl.addVariable('v2', true);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
    describe('Greater than (variable — parameter)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 > 512 %>Greater<% else %>Lesser<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', 1024);
        ret = tpl.render();
        return expect(ret).toEqual('Greater');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', 256);
        ret = tpl.render();
        return expect(ret).toEqual('Lesser');
      });
    });
    describe('Greater than (parameter — variable)', function() {
      beforeEach(function() {
        return tpl.set('<% if 512 > v1 %>Greater<% else %>Lesser<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', 256);
        ret = tpl.render();
        return expect(ret).toEqual('Greater');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', 1024);
        ret = tpl.render();
        return expect(ret).toEqual('Lesser');
      });
    });
    describe('Greater than (variable — variable)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 > v2 %>Greater<% else %>Lesser<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', 1024);
        tpl.addVariable('v2', 512);
        ret = tpl.render();
        return expect(ret).toEqual('Greater');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', 256);
        tpl.addVariable('v2', 512);
        ret = tpl.render();
        return expect(ret).toEqual('Lesser');
      });
    });
    describe('Lesser than (variable — parameter)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 < 512 %>Lesser<% else %>Greater<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', 256);
        ret = tpl.render();
        return expect(ret).toEqual('Lesser');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', 1024);
        ret = tpl.render();
        return expect(ret).toEqual('Greater');
      });
    });
    describe('Lesser than (parameter — variable)', function() {
      beforeEach(function() {
        return tpl.set('<% if 512 < v1 %>Lesser<% else %>Greater<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', 1024);
        ret = tpl.render();
        return expect(ret).toEqual('Lesser');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', 256);
        ret = tpl.render();
        return expect(ret).toEqual('Greater');
      });
    });
    describe('Lesser than (variable — variable)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 < v2 %>Lesser<% else %>Greater<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', 256);
        tpl.addVariable('v2', 512);
        ret = tpl.render();
        return expect(ret).toEqual('Lesser');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', 1024);
        tpl.addVariable('v2', 512);
        ret = tpl.render();
        return expect(ret).toEqual('Greater');
      });
    });
    describe('AND (variable — parameter)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 && true %>True<% else %>False<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', true);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', false);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
    describe('AND (parameter — variable)', function() {
      beforeEach(function() {
        return tpl.set('<% if true && v1 %>True<% else %>False<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', true);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', false);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
    describe('AND (variable — variable)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 && v2 %>True<% else %>False<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', true);
        tpl.addVariable('v2', true);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', false);
        tpl.addVariable('v2', true);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
    describe('OR (variable — parameter)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 || false %>True<% else %>False<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', true);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', false);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
    describe('OR (parameter — variable)', function() {
      beforeEach(function() {
        return tpl.set('<% if false || v1 %>True<% else %>False<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', true);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', false);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
    describe('OR (variable — variable)', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 || v2 %>True<% else %>False<% endif %>');
      });
      it('should return correct value', function() {
        tpl.addVariable('v1', true);
        tpl.addVariable('v2', false);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      return it('should return alternate value', function() {
        tpl.addVariable('v1', false);
        tpl.addVariable('v2', false);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
    return describe('Truthy/Falsy conditions', function() {
      beforeEach(function() {
        return tpl.set('<% if v1 %>True<% else %>False<% endif %>');
      });
      it('should accept boolean true', function() {
        tpl.addVariable('v1', true);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      it('should accept boolean false', function() {
        tpl.addVariable('v1', false);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
      it('should accept integer 1', function() {
        tpl.addVariable('v1', 1);
        ret = tpl.render();
        return expect(ret).toEqual('True');
      });
      it('should accept integer 0', function() {
        tpl.addVariable('v1', 0);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
      it('should accept null', function() {
        tpl.addVariable('v1', null);
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
      return it('should accept undefined', function() {
        ret = tpl.render();
        return expect(ret).toEqual('False');
      });
    });
  });

  describe('Get Required', function() {
    var ret, tpl;
    tpl = null;
    ret = null;
    beforeEach(function() {
      return tpl = new Beard();
    });
    afterEach(function() {
      return tpl = null;
    });
    describe('Variables', function() {
      return it('should return correct object', function() {
        var obj;
        obj = {
          variables: ['v1', 'v2', 'v3'],
          elements: []
        };
        tpl.set('<%= v1 %><%= v2 %><%= v3 %>');
        ret = tpl.getRequired();
        return expect(ret).toEqual(obj);
      });
    });
    describe('Elements', function() {
      return it('should return correct object', function() {
        var obj;
        obj = {
          variables: [],
          elements: ['e1', 'e2', 'e3']
        };
        tpl.set('<%@ e1 %><%@ e2 %><%@ e3 %>');
        ret = tpl.getRequired();
        return expect(ret).toEqual(obj);
      });
    });
    return describe('Elements and Variables', function() {
      return it('should return correct object', function() {
        var obj;
        obj = {
          variables: ['v1', 'v2', 'v3'],
          elements: ['e1', 'e2', 'e3']
        };
        tpl.set('<%= v1 %><%@ e1 %><%= v2 %><%@ e2 %><%= v3 %><%@ e3 %>');
        ret = tpl.getRequired();
        return expect(ret).toEqual(obj);
      });
    });
  });

  describe('Helpers', function() {
    var ret, tpl;
    tpl = null;
    ret = null;
    beforeEach(function() {
      return tpl = new Beard();
    });
    afterEach(function() {
      return tpl = null;
    });
    describe('Block Helpers', function() {
      beforeEach(function() {
        return Beard.registerHelper('block', function(data, options) {
          data = data[0];
          if (data != null) {
            data = data.toUpperCase();
          }
          this.data = data;
          return options.fn(this);
        });
      });
      it('should compile program', function() {
        tpl.set('<% block %>Helper<% endblock %>');
        ret = tpl.render();
        return expect(ret).toEqual('Helper');
      });
      it('should process passed data', function() {
        tpl.set('<% block v1 %><%= data %><% endblock %>');
        tpl.addVariable('v1', 'data');
        ret = tpl.render();
        return expect(ret).toEqual('DATA');
      });
      it('should throw an error if syntax error', function() {
        tpl.set('<% block %>Helper<% endfoo %>');
        return expect(function() {
          return tpl.render();
        }).toThrow();
      });
      it('should access «local» and «global» variables', function() {
        tpl.set('<% block v1 %><%= v1 %> is <%= data %><% endblock %>');
        tpl.addVariable('v1', 'data');
        ret = tpl.render();
        return expect(ret).toEqual('data is DATA');
      });
      return it('should throw an error if helper is missing', function() {
        tpl.set('<% missing %>Test<% endmissing %>');
        return expect(function() {
          return tpl.render();
        }).toThrow();
      });
    });
    return describe('Inline Helpers', function() {
      beforeEach(function() {
        Beard.registerHelper('inline', function(args, options) {
          return 'Inline';
        });
        Beard.registerHelper('toUpper', function(args, options) {
          return args.map(function(x) {
            if (typeof x === 'string') {
              return x.toUpperCase();
            }
          }).join(' ');
        });
        return Beard.registerHelper('asset', function(args, options) {
          this.new_var = 'New Variable';
        });
      });
      it('should return correct value', function() {
        tpl.set('<%~ inline %>');
        ret = tpl.render();
        return expect(ret).toEqual('Inline');
      });
      it('should handle passed data', function() {
        tpl.set('<%~ toUpper "upper case" %>');
        ret = tpl.render();
        return expect(ret).toEqual('UPPER CASE');
      });
      it('should handle passed variable', function() {
        tpl.set('<%~ toUpper v1 %>');
        tpl.addVariable('v1', 'variable');
        ret = tpl.render();
        return expect(ret).toEqual('VARIABLE');
      });
      it('should handle multiple passed arguments', function() {
        tpl.set('<%~ toUpper v1, "test", f1() %>');
        tpl.addVariable('v1', 'variable');
        tpl.addVariable('f1', function() {
          return 'function';
        });
        ret = tpl.render();
        return expect(ret).toEqual('VARIABLE TEST FUNCTION');
      });
      return it('should be able to change «global» scope variables', function() {
        tpl.set('<%~ asset %><%= new_var %>');
        ret = tpl.render();
        return expect(ret).toEqual('New Variable');
      });
    });
  });

}).call(this);
