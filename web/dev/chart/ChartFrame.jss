Ext.namespace("dev.chart");
loadcss("lib.RowEditorGrid.ListInput");

using("lib.jsvm.MenuTree");
using("lib.ColorField.ColorField");
using("lib.RowEditorGrid.RowEditorGrid");
using("lib.RowEditorGrid.ListInput");
using("lib.ComboTree.ComboTree");
using("lib.ComboRemote.ComboRemote");
using("lib.CachedPanel.CachedPanel");

using("dev.chart.ChartNavPanel");


dev.chart.ChartFrame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
			    statusBar:true,
				region:'center',
				split:true
		}); 
		this.frames.set('Chart',this);
		this.frames.set('params',{});
		this.navPanel =this.frames.createPanel(new dev.chart.ChartNavPanel());
		this.Frame = new Ext.Panel({
				border: false,
				layout: 'border',
				items: [this.navPanel,this.mainPanel]
		});
		return this.Frame;
	},
	doWinLayout:function(win){
		this.navPanel.init();
	}
});  