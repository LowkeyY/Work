
Ext.namespace('lib.Constrained');

lib.Constrained.ResizableConstrained = function(el, config) {
	lib.Constrained.ResizableConstrained.superclass.constructor.call(this, el, config)
};
Ext.extend(lib.Constrained.ResizableConstrained, Ext.Resizable, {
	setXConstraint : function(left, right) {
		this.dd.setXConstraint(left, right)
	},
	setYConstraint : function(up, down) {
		this.dd.setYConstraint(up, down)
	}
});