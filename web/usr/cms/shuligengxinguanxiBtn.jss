// using("usr.cms.shuligengxinguanxiBtn");
// usr.cms.shuligengxinguanxiBtn(btn);

Ext.ns("usr.cms");
usr.cms.shuligengxinguanxiBtn = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	var id = panel.form.findField("id").getValue();
	var win = panel.findParentByType(Ext.Window);
	win.getEl().mask("请稍候...");
	Ext.Ajax.request({
				url : '/usr/cms/shuligengxinguanxi.jcp',
				params : {
					pmk : id
				},
				scope : this,
				method : 'Post',
				success : function(response, options) {
					var result = Ext.decode(response.responseText);
					win.getEl().unmask();
					if (result.success) {
						Ext.msg("info", "站点梳理完成。");
					} else {
						Ext.msg("error", "站点没有完成梳理。原因 ： " + '<br>'
										+ result.message);
					}
				},
				failure : function(response, options) {
					win.getEl().unmask();
					Ext.msg("error", CPM.getResponeseErrMsg(response));
				}
			});
}