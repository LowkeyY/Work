using("lib.jsvm.MenuTree");
dev.module.ModuleNavPanel = function() {

	var str='模块导航'.loc();
	this.menuTree = new MenuTree(Tool
			.parseXML('<root _id="root"><forder _hasChild="1"><e _id="0" _parent="root" title="'+str+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=5"   icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));

	this.event0 = new Object();

	this.clickEvent = function(clickNode) {
		if (clickNode.prop.params) {
			var params = {};
			var paramString = clickNode.prop.params.split('&');
			for (var i = 0; i < paramString.length; i++) {
				params[paramString[i].split('=')[0]] = paramString[i]
						.split('=')[1];
			}
			Module = this.frames.get('Module');
			var loader = Module.loader;
			var objectId = clickNode.prop._id;
			if (clickNode.prop.objectType == '1') {
				this.treeClickEvent(Module, {
							objectId : objectId,
							functionName : "init",
							type : 'module'
						});
			} else if (clickNode.prop.objectType == '5') {
				this.treeClickEvent(Module, {
							objectId : objectId,
							functionName : "loadData",
							type : 'module'
						});
			} else if (clickNode.prop.objectType == '23'
					|| clickNode.prop.objectType == '24'
					|| clickNode.prop.objectType == '25'
					|| clickNode.prop.objectType == '26'
					|| clickNode.prop.objectType == '27') {
				this.treeClickEvent(Module, {
							objectId : objectId,
							functionName : "init",
							type : 'program'
						});
			} else if (clickNode.prop.objectType == '7') {
				this.treeClickEvent(Module, {
							objectId : objectId,
							functionName : "loadData",
							type : 'program'
						});
			}
		}
	}.createDelegate(this);

	var titleClick = this.clickEvent;
	this.event0.title_click = function() {
		titleClick(this);
	};

	this.menuTree.setEvent("event0", this.event0);
	this.buttonArray = [];
	this.buttonArray.push(this.com = new Ext.form.ComboBox({
				store : new Ext.data.SimpleStore({
							fields : ['ids', 'label'],
							data : [['1', '逻辑名称'.loc()], ['2', '物理名称'.loc()], ['3', "ID"],
									['4', '引用表名'.loc()]]
						}),
				value : '1',
				valueField : 'ids',
				displayField : 'label',
				triggerAction : 'all',
				width : 80,
				mode : 'local'
			}));
	this.buttonArray.push(this.text = new Ext.form.TextField({
				width : 130,
				fieldLabel : '逻辑名称'.loc(),
				maxLength : 24,
				regex : /^[^\<\>\'\"\&]+$/,
				regexText : '名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),
				allowBlank : false,
				maxLengthText : '输入名称不能超过{0}个字符!'.loc()
			}));
	this.buttonArray.push(new Ext.Button({
		text : '查询'.loc(),
		icon : '/themes/icon/xp/search.gif',
		cls : 'x-btn-text-icon',
		scope : this,
		hidden : false,
		handler : function(btn) {
			Ext.Ajax.request({
						url : '/dev/module/ParamSearch.jcp',
						params : {
							combo : this.com.getValue(),
							text : this.text.getValue()
						},
						method : 'POST',
						scope : this,
						success : function(response, options) {
							var result = Ext.decode(response.responseText);
							if (result.success == false) {
								Ext.msg("error", result.message);
							} else {
								if (result.data.length == 0) {
									Ext.msg("info", '未查到相应模块!'.loc());
								} else if (result.data.length > 1) {
									using("dev.module.ParamSearch");
									var showData = new dev.module.ParamSearch(
											result, this);
									showData.show();
								} else if (result.data.length == 1) {
									this.menuTree.loadPath(result.data[0].path);
									var nowNode = this.menuTree.getNowNode();
									this.exeHistoryNode(this.menuTree, nowNode);
									this.clickEvent(nowNode);
								}
							}
						}
					})
		}
	}));

	dev.module.ModuleNavPanel.superclass.constructor.call(this, {
				id : 'ModuleNavigator',
				title : '模块管理'.loc(),
				region : 'west',
				split : true,
				width : 290,
				collapsible : true,
				cmargins : '3 3 3 3',
				tbar : this.buttonArray
			});
};

Ext.extend(dev.module.ModuleNavPanel, Ext.Panel, {
			region : 'west',
			init : function() {
				this.menuTree.finish(this.body.dom, document);
				this.focusHistoryNode();
				var nowNode = this.menuTree.getNowNode();
				this.clickEvent(nowNode);
			},
			getTree : function() {
				return this.menuTree;
			},
			exeHistoryNode : function(menuTree, nowNode) {
				if (nowNode.prop.event && nowNode.prop.params) {
				} else if (nowNode.prop.objectType == '0'
						&& nowNode.index() == nowNode.parent.son.length - 1) {
					return;
				} else {
					menuTree.moveNext();
					var newNode = menuTree.getNowNode();
					if (nowNode.prop._id == newNode.prop._id) {
						return;
					} else {
						this.exeHistoryNode(menuTree, newNode)
					}
				}
			},
			focusHistoryNode : function() {
				uStore = new UserStore(tree_store);
				if (uStore.getAttribute("Module")) {
					this.menuTree.loadHistory("Module");
					var nowNode = this.menuTree.getNowNode();
				} else {
					var nowNode = this.menuTree.getNowNode();
					this.menuTree.loadHistory("Module");
				};
				this.exeHistoryNode(this.menuTree, nowNode);
			},
			treeClickEvent : function(Module, params) {
				var main = Module.mainPanel;
				if (params.type == "program") {
					using("lib.ComboRemote.ComboRemote");
					using("lib.ComboTree.ComboTree");
					using("dev.program.ProgramPanel");
					using("dev.program.ProgramGrid");
					Ext.Ajax.request({
						url : '/dev/module/SelectTerminalType.jcp',
						params : {
							id:params.objectId
						},
						method : 'GET',
						scope : this,
						success : function(response, options) {
							var result = Ext.decode(response.responseText);
							if (result.success) {
								var terminalType = result.terminalType;
								if (!Module.programPanel) {
									Module.programPanel = new dev.program.ProgramPanel(
											params.type, Module);
									main.add(Module.programPanel.MainTabPanel);
								}
								main.setActiveTab(Module.programPanel.MainTabPanel);
								if (Module.programPanel.MainTabPanel.rendered) {
									Module.programPanel[params.functionName]({
												parent_id : params.objectId,
												terminalType : terminalType,
												objectId : params.objectId,
												returnFunction : function(main) {
													main.setActiveTab(params.type+'ProgramPanel');
												}.createCallback(main)
											}, main);
								}
							}else{
								Ext.msg("error", result.message);
							}
						}
					});
					
				} else if (params.type == "module") {
					using("lib.ListValueField.ListValueField");
					loadcss("lib.IconPicker.IconPicker");
					using("lib.IconPicker.IconPicker");
					using("lib.ComboTree.ComboTree");
					using("lib.SelectMenu.SelectMenu");
					using("dev.module.ModulePanel");
				    Ext.Ajax.request({
						url : '/dev/module/SelectTerminalType.jcp',
						params : {
							id:params.objectId
						},
						method : 'GET',
						scope : this,
						success : function(response, options) {
							var result = Ext.decode(response.responseText);
							if (result.success) {
								var terminalType = result.terminalType;
								if (!Module.modulePanel) {
									
									Module.modulePanel = new dev.module.ModulePanel(
											params.objectId, Module);
									main.add(Module.modulePanel.MainTabPanel);
								}
								main.setActiveTab(Module.modulePanel.MainTabPanel);
								Module.modulePanel[params.functionName]({
											parent_id : params.objectId,
											terminalType : terminalType,
											returnFunction : function(main) {
												main.setActiveTab('modulePanel');
											}.createCallback(main)
										}, main);
							}else{
								Ext.msg("error", result.message);
							}
						}
					});
				}
			}
		});
