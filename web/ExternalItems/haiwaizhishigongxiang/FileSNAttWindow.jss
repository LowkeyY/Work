Ext.ns("ExternalItems.haiwaizhishigongxiang")

ExternalItems.haiwaizhishigongxiang.FileSNAttWindow = function(btn) {
	var p = Ext.getCmp(btn.panelId);
	var win = p.findParentByType(Ext.Window) , width = 800 , height = 600;
	if(win){
		width = win.width * 0.75;
		height = win.height * 0.65;
	} else if(p.getWidth && p.getHeight) {
		width = p.getWidth() * 0.75;
		height = p.getHeight() * 0.65;						
	}
	CPM.openModuleWindow("5f48f84e-6ae5-4401-b91c-17f5571995ee", p, {pageType:"edit"}, {// 固定ID 模块:海外_空间节点属性
		icon : btn.icon,
		title : btn.text,
		width : width,
		height : height,
		listeners : {
			close : function() {
			}
		}
	});
}