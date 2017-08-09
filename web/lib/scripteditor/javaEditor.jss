Ext.namespace('lib.scripteditor');
using("lib.scripteditor.CodeEditor");
/**
 * java调试编辑工具,带有控制台.提供即时运行和错误查看
 * 
 */
lib.scripteditor.javaEditor = function(config) {

	// config有属性,是否显示控制台,是否显示按钮,回调方法.错误输出重定向.,目前都未写

	this.codeEditor = new lib.scripteditor.CodeEditor({
				allowSearchAndReplace : true,
				value : this.value || '',
				height : 363,
				hideLabel : true,
				language : "java"
			});

	this.MainPanel = new Ext.Panel({
		border : false,
		layout : 'border',
		split : true,
		items : [{
			xtype : 'panel',
			layout : 'fit',
			border : false,
			minSize : 200,
			region : 'center',
			margins : '1 1 1 1',
			bodyStyle : 'padding:0px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
			items : this.codeEditor
		}, {
			id : 'cpPanel',
			minSize : 150,
			height : 150,
			title : '控制台'.loc(),
			region : 'south',
			split : true,
			animFloat : true,
			autoScroll : true,
			layout : 'fit',
			style : 'font-size:14px;font-family:宋体;',
			margins : '1 0 1 1',
			cmargins : '1 1 1 1',
			collapsible : true,
			maxSize : 450,
			border : false
		}]
	});

}

lib.scripteditor.javaEditor.prototype = {
	setValue : function(value) {
		this.codeEditor.setValue(value);
	},
	getValue : function() {
		return this.codeEditor.getValue();
	},
	getButtons : function() {
		var execute = function(btn) {
			btn.disable();
			var javaContent = this.codeEditor.getSelectedText();

			if (javaContent == null) {
				javaContent = this.codeEditor.getValue();
				if (javaContent.replace("\\r", "") == "") {
					btn.enable();
					Ext.msg('警示'.loc(), '内容不得为空'.loc());
				}
			}
			Ext.Ajax.request({
				url : '/lib/scripteditor/javadebug.jcp',
				method : 'post',
				callback : function(options, success, response) {
					btn.enable();
					var ctrlPanel = Ext.get(Ext.get('cpPanel').last()).first().dom;
					ctrlPanel.innerHTML = response.responseText;
				}.createDelegate(this),
				params : {
					content : javaContent
				}
			});
		};
		var btns = this.codeEditor.getButtons();
		btns.push({
					xtype : 'tbbutton',
					text : '运行'.loc(),
					icon : '/themes/icon/all/script_go.gif',
					cls : 'x-btn-text-icon  bmenu',
					disabled : false,
					scope : this,
					handler : execute.createDelegate(this)
				});
		return btns;
	}

}
