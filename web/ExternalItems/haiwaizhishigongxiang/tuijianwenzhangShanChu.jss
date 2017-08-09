Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.tuijianwenzhangShanChu = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	
	if(btn.target && !btn.target_old){
		var tg = Ext.apply({} , btn.target);
		btn.target_old = tg;
		btn.target.old_type = btn.target.type;
		btn.target.type = 0;
	};
	
	var rec = panel.getSelectionModel().getSelections();
	if (rec.length == 0) {
		Ext.msg("warn", "请选择要操作的行.");
		return;
	}
	var p = panel.param;

	var pmks = new Array();
	for (var i = 0; i < rec.length; i++) {
		pmks.push(rec[i].get("pmk"));
	}
		var module = CPM.getModule(p.programType);
		var par = {
			data : pmks.join(","),
			objectId : p.objectId
		};

		Ext.Ajax.request({
					url : '/ExternalItems/haiwaizhishigongxiang/tuijianwenzhangShanChu.jcp',
					method : 'POST',
					params : par,
					scope : this,
					callback : function(options, success, response) {
						var check = response.responseText;
						var ajaxResult = Ext.util.JSON.decode(check)
						if (ajaxResult.success) {
							Ext.msg("info", '删除成功');
							if (btn.target_old) {
								CPM.replaceTarget(panel,panel.ownerCt, p,btn.target_old);
							}
						} else {
							Ext.msg("warn", "删除过程中出现错误。");
						}
					}
				})

}