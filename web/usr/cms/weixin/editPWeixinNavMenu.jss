Ext.ns("usr.cms.weixin");
usr.cms.weixin.editPWeixinNavMenu = function(exportDatas , parentPanel, parentWindow , currentLevel) {

	var PWTitle = parentWindow.title , cid = Ext.id(), isSubmit = (parentPanel === parentWindow) , 
		isHasSubMenu =  (currentLevel.length > 1) , maxCount = isSubmit ? currentLevel.shift(0) : currentLevel[0];
	var panelItems = [] , testValue = { name : "" , url : ""};
	function createFormPanel(vs){
		var urlTypes = new Ext.data.SimpleStore({
									"fields" : ['value', 'text'],
									"data" : [["view", "跳转URL"],["click","点击推事件"]]
								});
		return new Ext.form.FormPanel({
				title : "菜单",
				labelAlign : "top",
				bodyStyle : "padding: 1px 10px; background-color: #DFE8F6;",
				collapsible : true,
				defaultType : "textfield",
				parentPanelId : cid + "_center",
				defaultLoadDatas : vs,
				items : [{	
							width : "100%",
							fieldLabel : "菜单名称",
							name : "name"
						}, {
							width : "100%",
							fieldLabel : "链接类型",
							store : urlTypes,
							name : "type",
							mode : "local",
							displayField : "text",
							valueField : "value",
							triggerAction : "all",
							editable : false,
							xtype : "combo"
						},{
							width : "100%",
							fieldLabel : "链接地址",
							name : "url"
						}],
				tools : [{
					id : "gear",
					qtip : "设置子菜单项",
					hidden : !isHasSubMenu,
					handler : function(event, toolEl, panel) {
						var pt = panel.form.findField("name") && panel.form.findField("name").getValue() || "";
						var win = new Ext.Window({
									title : pt,
									width : WorkBench.Desk.getDesktop().getViewWidth() * 0.4,
									height : WorkBench.Desk.getDesktop().getViewHeight() * 0.8,
									icon : "/themes/icon/all/book_open.gif",
									autoScroll : false,
									layout : "fit",
									modal : true,
									items : usr.cms.weixin.editPWeixinNavMenu(panel.subChildren || [] , panel, parentWindow , currentLevel)
								});
						win.show();
					}
				}, {
					id : "close",
					qtip : "关闭",
					hidden : isSubmit,
					handler : function(event, toolEl, panel) {
						var p = Ext.getCmp(panel.parentPanelId);
						if(p){
							p.remove(panel);
						}
					}
				}],
				listeners : {
					afterrender : function(frm) {
						if (frm.defaultLoadDatas) {
							frm.form.setValues(frm.defaultLoadDatas);
							if(frm.defaultLoadDatas.sub_button)
								frm.subChildren = frm.defaultLoadDatas.sub_button;
						}
					}
				}
			});
	
	}
	var rows = isSubmit ? 1 : exportDatas.length >0 ? exportDatas.length : 1;
	var columns = isSubmit ? maxCount : 1;
	
	for (var i = 0; i < columns; i++) {
		var items = [];
		for (var j = 0; j < rows; j++) {
			var curIndex = i * rows + j, 
				values = exportDatas[curIndex] || testValue;
			var frm = createFormPanel(values);
			items.push(frm);
		}
		panelItems.push({
					columnWidth : columns == 1 ? 1 / 1.25 : 1 / columns,
					items : items
				});
	}
	return {
		width : "100%",
		height : 450,
		layout : "border",
		autoScroll : true,
		items : [{
					region : "center",
					border : false,
					defaults : {
						border : false
					},
					width :  isSubmit ? "85%" : "70%",
					layout : "column",
					id : cid + "_center",
					autoScroll : true,
					items : panelItems,
					buttonAlign : "left",
					listeners :{
						afterrender : function(comp){
							var w;
							if (w = comp.findParentByType(Ext.Window)) {
								w.el.dom.style.textAlign = 'left';
							}
						}
					},
					buttons : [{
								text : "添加菜单" ,
								panelId : cid + "_center",
								maxMenus : maxCount,
								hidden : isSubmit,
								icon : '/themes/icon/all/add.gif',
								handler : function(btn){
									var p = Ext.getCmp(btn.panelId);
									if(p){
										if(p.getComponent(0).items.length >= btn.maxMenus){
											Ext.msg("warn" , "最多只能创建"+maxCount+"个菜单。");
										}else{
											p.getComponent(0).add(createFormPanel(testValue));
											p.doLayout();
										}
									}
								}
					} , "->" ,{
						text : isSubmit ? "保存" : "确定",
						panelId : cid + "_center",
						handler : function(btn) {
							var p = Ext.getCmp(btn.panelId);
							var values = [];
							for(var index = 0 ; index < p.items.length ; index++){
								var comp = p.getComponent(index);
								Ext.each(comp.items.items , function(item){
								var v = item.form.getFieldValues() , isEmpty = true;
									for(var att in v){
										if(!v[att] == ""){
											isEmpty = false;
											break;
										}
									}
									if(!isEmpty){
										if(Ext.isDefined(item.subChildren) && item.subChildren.length > 0)
											v.sub_button = item.subChildren;
										values.push(v);
									};
								})
							}
							if (isSubmit) {
								parentWindow.body.mask("正在提交，请稍后...");
								Ext.Ajax.request({
									url : "/usr/cms/weixin/addcaidanjson.jcp",
									params : {
										dataId : parentWindow.scope.param["dataId"],
										json : Ext.encode({button:values})
									},
									scope : this,
									method : "Post",
									success : function(form, action) {
										parentWindow.body.unmask();
										var result = Ext.decode(form.responseText);
										if(!result.success){
											Ext.msg("error",result.message );
										}else{
											parentWindow.close();
											Ext.msg("info",result.message );
										}
									},
									failure : function(form, action) {
										switch (action.failureType) {
											case Ext.form.Action.CLIENT_INVALID :
												Ext.msg("error", "表单错误，请刷新页面重试。");
												break;
											case Ext.form.Action.CONNECT_FAILURE :
												Ext.msg("error", "连接失败，请刷新页面重试。");
												break;
											case Ext.form.Action.SERVER_INVALID :
												Ext.msg("error", action.result.msg);
										}
									}
								}, this);
							} else {
								parentPanel.subChildren = values;
								var w;
								if (w = btn.findParentByType(Ext.Window)) {
									w.close();
								}
							}
						}
					}, {
						text : "取消",
						handler : function(btn) {
							var w = parentWindow === parentPanel
									? parentWindow
									: btn.findParentByType(Ext.Window);
							if (w) {
								w.close();
							}
						}
					}]
				}]
	};
};