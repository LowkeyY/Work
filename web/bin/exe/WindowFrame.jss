Ext.namespace("bin.exe");
/**
 * 弹出窗口配置选项popupWindowConfig
 * 
 * <pre>

 * </pre>
 */
bin.exe.WindowFrame = function(panel, parentPanel, params, target) {

	this.win;
	if (!this.id) {
		this.id = Ext.id();
	}
	
	this.params = params;
	var desktop = WorkBench.Desk.getDesktop();
	var width = desktop.getViewWidth() / 1.2;
	var height = desktop.getViewHeight() / 1.2;
	this.win = desktop.getWindow(this.id + "-win");
	if (!this.win) {
		var config = Ext.apply({
					id : this.id,
					isFrame : true,
					frameIndex : {
						center : this.id
					},
					items : {
						id : this.id + "-p",
						layout : 'fit'
					}

				}, CPM.Frame.panels.tabPanel)
		this.tabPanel = new Ext.TabPanel(config);
		var winConfig = {
			id : this.id + "-win",
			title : this.params['name'],
			layout : 'fit',
			items : this.tabPanel,
			width : width,
			height : height
		}
		if (Ext.isObject(params.popupWindowConfig)) {
			Ext.apply(winConfig, params.popupWindowConfig);
		}
		this.win = desktop.createWindow(winConfig);
		this.win.plist = panel;
		this.win.on('show', function() {
				var t=target.targets[0];
				if(target.targets.length>1){
					params.externalTargets=target.targets.slice(1);
				}
				CPM.replaceTarget(undefined, this.tabPanel, params, {
								type : "2",
								targets : [Ext.applyIf({
											frame : 3
										}, t)]
							});

				}, this);
		this.win.on("beforedestroy", function(w) {
					delete w.plist;
		})
	};

};
Ext.extend(bin.exe.WindowFrame, Ext.app.Module, {
			show : function() {
				this.win.show();
			}
		});
