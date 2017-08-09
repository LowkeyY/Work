Ext.ns("usr.cms");

usr.cms.editPCombotree = function(item , config) {
	return {
		xtype : "combotree",
		width : 400,
		height : 500,
		editable : false,
		rootVisible : false,
		mode : 'remot',
		allowBlank : item.allowBlank || false,
		root : {
			nodeType : 'async',
			expanded : false,
			children : config
		},
		listeners : {
			expand : function(comp) {
				comp.view.el.dom.style.textAlign = 'left';
			},
			select : Ext.isDefined(item.relationFiled) ? function(comp, node) {
				var frm = comp.findParentByType("form");
				if (frm) {
					var filed, relationFileds = Ext.type(comp.relationFiled) == "array"
							? comp.relationFiled
							: [comp.relationFiled];
					Ext.each(relationFileds, function(rf) {
								if ((filed = frm.form.findField(rf)))
									filed.setValue(rf.endsWith("地址")
											? node.attributes.urls
											: node.text);
							})
				}
			}
					: Ext.emptyFn
		}
	}
};