Ext.namespace("ExternalItems.haiwaizhishigongxiang.spacePage");

ExternalItems.haiwaizhishigongxiang.spacePage.WaitShSp = function() {
	this.id = "ExternalItems.haiwaizhishigongxiang.spacePage.WaitShSp";
	this.init();
}
ExternalItems.haiwaizhishigongxiang.spacePage.WaitShSp.prototype = {
	init : function(){
		
		var tools = [];
		tools.push({
			id:'refresh',
			handler: function(e, target, panel){
				panel.scope.refresh();
			}
		});
		this.data = new Ext.data.JsonStore({
						method : "GET",
						url : "/ExternalItems/haiwaizhishigongxiang/spacePage/WaitShSp.jcp",
						root : "authArray",
						fields : ["name", "count"],
						remoteSort : true
					});
		var grid = new Ext.grid.GridPanel({
			store : this.data,
			height : 250,
			columnLines : true,
			closable : false,
			border : true,
			viewConfig : {
				forceFit : true
			},
			frame : false,
			enableDragDrop : true,
			columns : [{
						header : "名称",
						width : 100,
						dataIndex : "name",
						sortable : false
					}, {
						header : "数量(个)",
						width : 50,
						dataIndex : "count",
						sortable : false
					}]
		});
		this.mainPanel =  new ExternalItems.haiwaizhishigongxiang.spacePage.Portal.Portlet({
			id: this.id,
			title : "本处室资料综合统计",
			height : 300,
			iconCls: "iportal-icon-chart",
			scope : this,
			items : grid,
			tools : tools,
			listeners : {
				afterrender : function(comp){
					comp.scope.refresh();
				}
			}
		});		
	},
	refresh : function(){
		var mainPanel = this.mainPanel , data = this.data;
		if (!mainPanel.el || !mainPanel.el.dom) {
			return;
		}
		data.load({});
	}
}