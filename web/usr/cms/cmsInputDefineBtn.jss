// using("usr.cms.cmsInputDefineBtn");
// usr.cms.cmsInputDefineBtn(btn);

Ext.ns("usr.cms");
usr.cms.cmsInputDefineBtn = function(btn) {
	var text = btn.text.indexOf("发布")!=-1 ? "发布":"归档";
	var type = text=="发布"?"fabu":"guidang";
	
	var panel = Ext.getCmp(btn.panelId);
	var fromNode = panel.form.findField("yuming") ? "zhandian":"lanmu";
	var id = panel.form.findField("id").getValue();
	var progressText = panel.form.findField("mingcheng").getValue();
	//单页栏目时，无需发布
	var leixing = panel.form.findField("leixing");
	if(leixing!=null && leixing.getValue()=="3"){
		Ext.msg("warn", "单页栏目不需要发布首页或归档，只操作该栏目下的第一个稿件即可。");
		return;
	}
	var muban = panel.form.findField("muban");
	if(muban!=null){
		if(muban.getValue()==""){
			Ext.msg("warn", "栏目模板为空，不能发布首页或归档。");
			return;
		}
	}
	var guidang = panel.form.findField("guidang");
	if(text=="归档" && guidang.getValue()=="true"){
		Ext.msg("warn", progressText+"已归档！");
		return;
	}

	var win = panel.findParentByType(Ext.Window);
	win.getEl().mask("请稍候...");
	
	Ext.Ajax.request({
		url : '/usr/cms/fabuhuoguidang.jcp',
		params : {
			pmk : id,
			type : type,
			fromNode :fromNode
		},
		scope : this,
		method : 'Post',
		timeout : 1800000,
		success : function(response, options) {
			win.getEl().unmask();
			var result = Ext.decode(response.responseText);
			if (result.success) {
				if(!Ext.isDefined(result.uuid) && Ext.isDefined(result.msg)){
					Ext.msg("info", result.msg);
					return;
				}
				var uuid = result.uuid;
				var pbar = Ext.Msg.progress("正在"+text, text+"中...", progressText);
				var count = 0;

				var fn = function() {
					Ext.Ajax.request({
						url : '/usr/cms/uploadProgress.jcp',
						params : {
							uuid : uuid
						},
						scope : this,
						method : 'Post',
						success : function(response, options) {
							var result = Ext.decode(response.responseText);
							if (result.message != "" && result.message != null) {
								clearInterval(interval);
								pbar.updateProgress(1);
								pbar.hide();
								if (result.message == "success") {
									guidang.setValue(text.indexOf("发布")!=-1 ?
										{text:"已发布",value:"false"}:{text:"已归档",value:"true"});
									Ext.msg("info", text+"成功。");
								} else {
									Ext.msg("error", text+"失败。原因 ： " + '<br>'
													+ result.message);
								}
							} else {
								pbar.updateProgress(count);
								count += 0.1;
								if (count > 1)
									count = 0
							}
						}
					}, this);
				}

				var interval = setInterval(fn.createDelegate(this), 300);
			} else{
				Ext.msg("warn", result.message);
			}
		},
		failure : function(response, options) {
			win.getEl().unmask();
			Ext.msg("error", CPM.getResponeseErrMsg(response));
		}
	});
}