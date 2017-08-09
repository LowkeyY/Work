
Ext.namespace("dev.integrate");
using("lib.jsvm.MenuTree");

using("dev.integrate.InstanceNavPanel");
using("lib.CachedPanel.CachedPanel");
dev.integrate.InstanceFrame=Ext.extend(WorkBench.baseNode,{
	main:function(launcher){
		this.mainPanel=new lib.CachedPanel.CachedPanel({
				id:'IntegrateInstanceMain',
				statusBar:true,
				region:'center',
				split:true
		}); 
		this.frames.set('IntegrateInstance',this);
		this.navPanel =this.frames.createPanel(new dev.integrate.InstanceNavPanel(this.frames));
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