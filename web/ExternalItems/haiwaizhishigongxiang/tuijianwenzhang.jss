Ext.namespace("ExternalItems.haiwaizhishigongxiang");
ExternalItems.haiwaizhishigongxiang.tuijianwenzhang = function(btn, type) {
	var panel = Ext.getCmp(btn.panelId);

	var par={};
	if (type == "rec") {
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
		par = {
			data : pmks.join(","),
			objectId : p.objectId
		};
	}else if(type == "input"){
		var p = panel.param;
		par = {
			data : panel.param.fileExportData,
			objectId : p.objectId
		};
	}

	Ext.Ajax.request({
				url : '/ExternalItems/haiwaizhishigongxiang/tuijianwenzhang.jcp',
				method : 'POST',
				params : par,
				scope : this,
				callback : function(options, success, response) {
					var check = response.responseText;
					var ajaxResult = Ext.util.JSON.decode(check)
					if (ajaxResult.success) {
						Ext.msg("info", '推荐成功');
					} else {
							Ext.msg("warn", "你已经推荐过此文章了。");
					}
				}
			})

}