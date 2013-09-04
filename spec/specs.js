// Generated by CoffeeScript 1.6.3
(function() {
  describe('Object', function() {
    var tpl;
    tpl = null;
    beforeEach(function() {
      spyOn(window, 'Beard');
      return tpl = new Beard();
    });
    it('should instantiate', function() {
      return expect(window.Beard).toHaveBeenCalled();
    });
    return it('should not throw exceptions', function() {
      return expect(window.Beard).not.toThrow();
    });
  });

  describe('Template', function() {
    var ret, tpl, tplStr;
    tpl = null;
    tplStr = '<b>Hello world!</b>';
    ret = null;
    beforeEach(function() {
      return tpl = new Beard();
    });
    describe('Set', function() {
      beforeEach(function() {
        spyOn(tpl, 'set').andCallThrough();
        return ret = tpl.set(tplStr);
      });
      it('should have beed called', function() {
        return expect(tpl.set).toHaveBeenCalled();
      });
      it('should not throw exceptions', function() {
        return expect(tpl.set).not.toThrow();
      });
      it('should have been called with proper argument', function() {
        return expect(tpl.set).toHaveBeenCalledWith('<b>Hello world!</b>');
      });
      return it('should return current instance', function() {
        return expect(ret).toEqual(tpl);
      });
    });
    describe('Set (empty)', function() {
      beforeEach(function() {
        spyOn(tpl, 'set').andCallThrough();
        return ret = tpl.set();
      });
      it('should have beed called', function() {
        return expect(tpl.set).toHaveBeenCalled();
      });
      it('should not throw exceptions', function() {
        return expect(tpl.set).not.toThrow();
      });
      it('should have been called with no argument', function() {
        return expect(tpl.set).toHaveBeenCalledWith();
      });
      return it('should return current instance', function() {
        return expect(ret).toEqual(tpl);
      });
    });
    describe('Get', function() {
      beforeEach(function() {
        tpl.set(tplStr);
        spyOn(tpl, 'get').andCallThrough();
        return ret = tpl.get();
      });
      it('should have beed called', function() {
        return expect(tpl.get).toHaveBeenCalled();
      });
      it('should not throw exceptions', function() {
        return expect(tpl.get).not.toThrow();
      });
      return it('should return current template', function() {
        return expect(ret).toEqual('<b>Hello world!</b>');
      });
    });
    return describe('Get (empty)', function() {
      beforeEach(function() {
        tpl.set();
        spyOn(tpl, 'get').andCallThrough();
        return ret = tpl.get();
      });
      it('should have beed called', function() {
        return expect(tpl.get).toHaveBeenCalled();
      });
      it('should not throw exceptions', function() {
        return expect(tpl.get).not.toThrow();
      });
      return it('should return empty string', function() {
        return expect(ret).toEqual('');
      });
    });
  });

  describe('Render', function() {
    var data, ret, tpl, tplStr;
    tpl = null;
    tplStr = '<b>Hello <%= who %>!</b>';
    data = {
      who: 'world'
    };
    ret = null;
    beforeEach(function() {
      tpl = new Beard();
      return spyOn(tpl, 'render').andCallThrough();
    });
    describe('Render with template and data', function() {
      beforeEach(function() {
        tpl.set(tplStr);
        return ret = tpl.render(data);
      });
      it('should have been called', function() {
        return expect(tpl.render).toHaveBeenCalled();
      });
      it('should have been called with data', function() {
        return expect(tpl.render).toHaveBeenCalledWith(data);
      });
      it('should return string', function() {
        return expect(ret).toEqual(jasmine.any(String));
      });
      return it('should return correct string', function() {
        return expect(ret).toEqual('<b>Hello world!</b>');
      });
    });
    describe('Render with template and no data', function() {
      beforeEach(function() {
        tpl.set(tplStr);
        return ret = tpl.render();
      });
      it('should have been called', function() {
        return expect(tpl.render).toHaveBeenCalled();
      });
      it('should have been called without data', function() {
        return expect(tpl.render).toHaveBeenCalledWith();
      });
      it('should return string', function() {
        return expect(ret).toEqual(jasmine.any(String));
      });
      return it('should return correct string', function() {
        return expect(ret).toEqual('<b>Hello !</b>');
      });
    });
    describe('Render without template but with data', function() {
      beforeEach(function() {
        return ret = tpl.render(data);
      });
      it('should have been called', function() {
        return expect(tpl.render).toHaveBeenCalled();
      });
      it('should have been called with data', function() {
        return expect(tpl.render).toHaveBeenCalledWith(data);
      });
      it('should return string', function() {
        return expect(ret).toEqual(jasmine.any(String));
      });
      return it('should return correct string', function() {
        return expect(ret).toEqual('');
      });
    });
    return describe('Render without template and without data', function() {
      beforeEach(function() {
        return ret = tpl.render();
      });
      it('should have been called', function() {
        return expect(tpl.render).toHaveBeenCalled();
      });
      it('should have been called without data', function() {
        return expect(tpl.render).toHaveBeenCalledWith();
      });
      it('should return string', function() {
        return expect(ret).toEqual(jasmine.any(String));
      });
      return it('should return correct string', function() {
        return expect(ret).toEqual('');
      });
    });
  });

  describe('Get Required', function() {
    var ret, tpl, tplStrE, tplStrEV, tplStrV;
    tpl = null;
    tplStrEV = '<%@ e1 %> <%@ e2 %> <%@ e3 %> <%= v1 %> <%= v2 %> <%= v3 %>';
    tplStrE = '<%@ e1 %> <%@ e2 %> <%@ e3 %>';
    tplStrV = '<%= v1 %> <%= v2 %> <%= v3 %>';
    ret = null;
    beforeEach(function() {
      tpl = new Beard();
      return spyOn(tpl, 'getRequired').andCallThrough();
    });
    describe('Elements and Variables (object template)', function() {
      beforeEach(function() {
        tpl.set(tplStrEV);
        return ret = tpl.getRequired();
      });
      it('should have been called', function() {
        return expect(tpl.getRequired).toHaveBeenCalled();
      });
      it('should return object', function() {
        return expect(ret).toEqual(jasmine.any(Object));
      });
      describe('Elements', function() {
        it('should be an array', function() {
          return expect(ret.elements).toEqual(jasmine.any(Array));
        });
        it('should be an array with three items', function() {
          return expect(ret.elements.length).toEqual(3);
        });
        it('should contain correct value', function() {
          return expect(ret.elements).toContain('e1');
        });
        return it('should not contain incorrect value', function() {
          return expect(ret.elements).not.toContain('v1');
        });
      });
      return describe('Variables', function() {
        it('should be an array', function() {
          return expect(ret.variables).toEqual(jasmine.any(Array));
        });
        it('should be an array with three items', function() {
          return expect(ret.variables.length).toEqual(3);
        });
        it('should contain correct value', function() {
          return expect(ret.variables).toContain('v1');
        });
        return it('should not contain incorrect value', function() {
          return expect(ret.variables).not.toContain('e1');
        });
      });
    });
    describe('Elements and Variables (passed template)', function() {
      beforeEach(function() {
        return ret = tpl.getRequired(tplStrEV);
      });
      it('should have been called', function() {
        return expect(tpl.getRequired).toHaveBeenCalled();
      });
      it('should return object', function() {
        return expect(ret).toEqual(jasmine.any(Object));
      });
      describe('Elements', function() {
        it('should be an array', function() {
          return expect(ret.elements).toEqual(jasmine.any(Array));
        });
        it('should be an array with three items', function() {
          return expect(ret.elements.length).toEqual(3);
        });
        it('should contain correct value', function() {
          return expect(ret.elements).toContain('e1');
        });
        return it('should not contain incorrect value', function() {
          return expect(ret.elements).not.toContain('v1');
        });
      });
      return describe('Variables', function() {
        it('should be an array', function() {
          return expect(ret.variables).toEqual(jasmine.any(Array));
        });
        it('should be an array with three items', function() {
          return expect(ret.variables.length).toEqual(3);
        });
        it('should contain correct value', function() {
          return expect(ret.variables).toContain('v1');
        });
        return it('should not contain incorrect value', function() {
          return expect(ret.variables).not.toContain('e1');
        });
      });
    });
    describe('Elements, not Variables (object template)', function() {
      beforeEach(function() {
        tpl.set(tplStrE);
        return ret = tpl.getRequired();
      });
      it('should have been called', function() {
        return expect(tpl.getRequired).toHaveBeenCalled();
      });
      it('should return object', function() {
        return expect(ret).toEqual(jasmine.any(Object));
      });
      describe('Elements', function() {
        it('should be an array', function() {
          return expect(ret.elements).toEqual(jasmine.any(Array));
        });
        it('should be an array with three items', function() {
          return expect(ret.elements.length).toEqual(3);
        });
        it('should contain correct value', function() {
          return expect(ret.elements).toContain('e1');
        });
        return it('should not contain incorrect value', function() {
          return expect(ret.elements).not.toContain('v1');
        });
      });
      return describe('Variables', function() {
        it('should be an array', function() {
          return expect(ret.variables).toEqual(jasmine.any(Array));
        });
        return it('should be an array with no items', function() {
          return expect(ret.variables.length).toEqual(0);
        });
      });
    });
    describe('Elements, not Variables (passed template)', function() {
      beforeEach(function() {
        return ret = tpl.getRequired(tplStrE);
      });
      it('should have been called', function() {
        return expect(tpl.getRequired).toHaveBeenCalled();
      });
      it('should return object', function() {
        return expect(ret).toEqual(jasmine.any(Object));
      });
      describe('Elements', function() {
        it('should be an array', function() {
          return expect(ret.elements).toEqual(jasmine.any(Array));
        });
        it('should be an array with three items', function() {
          return expect(ret.elements.length).toEqual(3);
        });
        it('should contain correct value', function() {
          return expect(ret.elements).toContain('e1');
        });
        return it('should not contain incorrect value', function() {
          return expect(ret.elements).not.toContain('v1');
        });
      });
      return describe('Variables', function() {
        it('should be an array', function() {
          return expect(ret.variables).toEqual(jasmine.any(Array));
        });
        return it('should be an array with no items', function() {
          return expect(ret.variables.length).toEqual(0);
        });
      });
    });
    describe('Variables, not Elements (object template)', function() {
      beforeEach(function() {
        tpl.set(tplStrV);
        return ret = tpl.getRequired();
      });
      it('should have been called', function() {
        return expect(tpl.getRequired).toHaveBeenCalled();
      });
      it('should return object', function() {
        return expect(ret).toEqual(jasmine.any(Object));
      });
      describe('Elements', function() {
        it('should be an array', function() {
          return expect(ret.elements).toEqual(jasmine.any(Array));
        });
        return it('should be an array with no items', function() {
          return expect(ret.elements.length).toEqual(0);
        });
      });
      return describe('Variables', function() {
        it('should be an array', function() {
          return expect(ret.variables).toEqual(jasmine.any(Array));
        });
        it('should be an array with three items', function() {
          return expect(ret.variables.length).toEqual(3);
        });
        it('should contain correct value', function() {
          return expect(ret.variables).toContain('v1');
        });
        return it('should not contain incorrect value', function() {
          return expect(ret.variables).not.toContain('e1');
        });
      });
    });
    describe('Variables, not Elements (passed template)', function() {
      beforeEach(function() {
        return ret = tpl.getRequired(tplStrV);
      });
      it('should have been called', function() {
        return expect(tpl.getRequired).toHaveBeenCalled();
      });
      it('should return object', function() {
        return expect(ret).toEqual(jasmine.any(Object));
      });
      describe('Elements', function() {
        it('should be an array', function() {
          return expect(ret.elements).toEqual(jasmine.any(Array));
        });
        return it('should be an array with no items', function() {
          return expect(ret.elements.length).toEqual(0);
        });
      });
      return describe('Variables', function() {
        it('should be an array', function() {
          return expect(ret.variables).toEqual(jasmine.any(Array));
        });
        it('should be an array with three items', function() {
          return expect(ret.variables.length).toEqual(3);
        });
        it('should contain correct value', function() {
          return expect(ret.variables).toContain('v1');
        });
        return it('should not contain incorrect value', function() {
          return expect(ret.variables).not.toContain('e1');
        });
      });
    });
    return describe('No Variables, no Elements', function() {
      beforeEach(function() {
        return ret = tpl.getRequired();
      });
      it('should have been called', function() {
        return expect(tpl.getRequired).toHaveBeenCalled();
      });
      it('should return object', function() {
        return expect(ret).toEqual(jasmine.any(Object));
      });
      describe('Elements', function() {
        it('should be an array', function() {
          return expect(ret.elements).toEqual(jasmine.any(Array));
        });
        return it('should be an array with no items', function() {
          return expect(ret.elements.length).toEqual(0);
        });
      });
      return describe('Variables', function() {
        it('should be an array', function() {
          return expect(ret.variables).toEqual(jasmine.any(Array));
        });
        return it('should be an array with no items', function() {
          return expect(ret.variables.length).toEqual(0);
        });
      });
    });
  });

  describe('Compile', function() {
    var data, elements, ret, tpl, tplStr;
    tpl = null;
    tplStr = '<%@ e1 %> <%@ e2 %> <%@ e3 %> <%= v1 %> <%= v2 %> <%= v3 %>';
    data = {
      v1: 'v1',
      v2: 'v2',
      v3: 'v3'
    };
    elements = {
      e1: 'e1',
      e2: 'e2',
      e3: 'e3'
    };
    ret = null;
    beforeEach(function() {
      tpl = new Beard();
      return spyOn(tpl, 'compile').andCallThrough();
    });
    describe('Elements, Variables and Template', function() {
      beforeEach(function() {
        tpl.addElements(elements);
        return ret = tpl.compile(tplStr, data);
      });
      it('should have been called', function() {
        return expect(tpl.compile).toHaveBeenCalled();
      });
      return it('should return correct compiled template', function() {
        return expect(ret).toEqual('e1 e2 e3 v1 v2 v3');
      });
    });
    describe('Elements, no Variables and Template', function() {
      beforeEach(function() {
        tpl.addElements(elements);
        return ret = tpl.compile(tplStr);
      });
      it('should have been called', function() {
        return expect(tpl.compile).toHaveBeenCalled();
      });
      return it('should return correct compiled template', function() {
        return expect(ret).toEqual('e1 e2 e3   ');
      });
    });
    describe('Variables, no Elements and Template', function() {
      beforeEach(function() {
        return ret = tpl.compile(tplStr, data);
      });
      it('should have been called', function() {
        return expect(tpl.compile).toHaveBeenCalled();
      });
      return it('should return correct compiled template', function() {
        return expect(ret).toEqual('Element e1 not found Element e2 not found Element e3 not found v1 v2 v3');
      });
    });
    describe('Template, no Variables and no Elements', function() {
      beforeEach(function() {
        return ret = tpl.compile(tplStr);
      });
      it('should have been called', function() {
        return expect(tpl.compile).toHaveBeenCalled();
      });
      return it('should return correct compiled template', function() {
        return expect(ret).toEqual('Element e1 not found Element e2 not found Element e3 not found   ');
      });
    });
    return describe('Variables, Elements, no Template', function() {
      beforeEach(function() {
        tpl.addElements(elements);
        return ret = tpl.compile('', data);
      });
      it('should have been called', function() {
        return expect(tpl.compile).toHaveBeenCalled();
      });
      return it('should return correct compiled template', function() {
        return expect(ret).toEqual('');
      });
    });
  });

}).call(this);
