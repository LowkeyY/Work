Ext.namespace("bin.dataservice");

using("lib.jsvm.MenuTree");
using("bin.dataservice.DataServiceNavPanel");

using("lib.ComboRemote.ComboRemote");
using("lib.ComboTree.ComboTree"); 
using("lib.CachedPanel.CachedPanel");


bin.dataservice.Frame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
			id:'DataServiceMain',
			statusBar:true,
			region:'center',
			split:true
		}); 
		this.frames.set('DataService',this);
		this.navPanel =this.frames.createPanel(new bin.dataservice.DataServiceNavPanel());
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