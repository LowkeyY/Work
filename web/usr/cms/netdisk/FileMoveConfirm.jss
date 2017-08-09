// using("usr.cms.fuzhigaojianBtn");
// usr.cms.fuzhigaojianBtn(btn);

Ext.ns("usr.cms.netdisk");
usr.cms.netdisk.FileMoveConfirm = function(btn) {
	var panel = Ext.getCmp(btn.panelId);
	var win = panel.findParentByType(Ext.Window);
	var tree = panel.getComponent(0);
	var node = tree.getSelectionModel().getSelectedNode();
	
	if (Ext.isDefined(btn.target)) {
		btn.target_old = Ext.apply({}, btn.target);
		delete btn.target;
	}
	
	if(node==null || node.attributes.id=="root"){
		Ext.msg("warn","请选择一个目标节点。");
		return;
	}
	
	if(node.attributes.id==win.fromPanelConfig.oldId){
		Ext.msg("warn","不能选择文件当前目录。");
		return;
	}
		
		win.getEl().mask("移动中...");
		Ext.Ajax.request({
			url : '/usr/cms/netdisk/FileMoveConfirm.jcp',
			params : {
				pmks : win.fromPanelConfig.pmks,
				target : node.attributes.id
			},
			scope : this,
			method : 'Post',
			success : function(response, options) {
				win.getEl().unmask();
				var result = Ext.decode(response.responseText);
				if (btn.target_old.targets) {
					CPM.replaceTarget(panel, panel.ownerCt,panel.param, btn.target_old);
				}
				if(result.success){
					Ext.msg("info", "移动成功。");
					win.close();
				}else
					Ext.msg("warn", "移动中出现错误。");
			},
			failure : function(response, options) {
				win.getEl().unmask();
				Ext.msg("error", CPM.getResponeseErrMsg(response));
			}
		});
}