

// ---------------------构建查询GridPanel定义----------------------------------------------------------

Ext.namespace("dev.database");

dev.database.DataList = function(objectId) {

	this.objectId = objectId;

}

dev.database.DataList.prototype = {
	show : function() {
		Ext.Ajax.request({
					url : '/dev/database/DataList.jcp',
					method : 'POST',
					params : {
						id : this.objectId
					},
					scope : this,
					success : function(response, options) {
						var result = Ext.decode(response.responseText);
						result.cm.unshift(new Ext.grid.RowNumberer());
						var store = new Ext.data.JsonStore({
									url : '/dev/database/DataList.jcp',
									fields : result.fields,
									totalProperty : 'totalNumber',
									baseParams : {
										id : this.objectId
									},
									data : result,
									root : 'data'
								});
						Ext.each(result.cm, function(item) {
									item.editor = new Ext.form.TextField({});
								});
						var cm = new Ext.grid.ColumnModel({
									columns : result.cm,
									defaultSortable : true

								});

						var pagingBar = new Ext.PagingToolbar({
									pageSize : 50,
									store : store,
									displayInfo : true,
									displayMsg : '{0}-{1}'+'条 共'.loc()+':{2}'+'条'.loc(),
									emptyMsg : '没有数据'.loc()

								});
						var grid = new Ext.grid.EditorGridPanel({
									store : store,
									clicksToEdit : 1,
									stripeRows : true,
									cm : cm,
									bbar : pagingBar
								});
						store.loadData(result);
						var win = new Ext.Window({
									title : '查看数据'.loc(),
									modal : true,
									layout : 'fit',
									width : WorkBench.Desk.getDesktop()
											.getViewWidth()
											* 0.8,
									height : WorkBench.Desk.getDesktop()
											.getViewHeight()
											* 0.8,
									buttons : [{
												text : '关闭'.loc(),
												handler : function() {
													win.close();
												}
											}],
									items : grid

								});
						Ext.getBody().unmask();
						win.show();
					}
				});
	}
}