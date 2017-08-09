
Ext.namespace('dev.program');
dev.program.copyToWindow = function(config){
	this.win;
	this.acttype='';
	this.parentId='';
	this.root=new Ext.tree.AsyncTreeNode( {
		text : '复制目标位置'.loc(),
		draggable : false,
		expanded : true,
		level:1,
		allowSelect:false,   
		icon : "/themes/icon/xp/dhd.gif"
	});
	this.loader=new Ext.tree.TreeLoader( {
		dataUrl : '/dev/program/SelectModule.jcp?id='+config.id,
		requestMethod : "GET"
	});
	this.loader.on("loadexception",function(tree,node,response){
		var message='对象载入错误'.loc();
		try{
			message=Ext.decode(response.responseText).message;
		}catch(e){}
		Ext.msg("error",message);
	});
	this.tree = new Ext.tree.TreePanel({
		autoScroll : true,
		animate : false,
		containerScroll : true,
		height:'auto',
		layout:'fit',
		root : this.root,
		bodyStyle:config.bodyStyle || 'background-color:white;padding:3 0 0 3;',
		draggable : false,
		split:true,
		width:200,
		collapsible: false,
		loader : this.loader
	});  
	this.tree.on("click",function(node,e){
		if(node.isLeaf()){
			this.acttype=node.attributes.acttype;
			this.parentId=node.attributes.id;
		}
	},this);
	this.win =  new Ext.Window({
		title:'选择复制目标位置'.loc(),
		layout:'fit',
		width:250,
		height:400,
		scope:this,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.tree],
		buttons: [{
			text:'确定'.loc(),
			scope:this,
			handler: this.windowConfirm
		},{
			text: '取消'.loc(),
			scope:this,
			handler: this.windowCancel
		}]
	});  
};
Ext.extend(dev.program.copyToWindow ,Ext.Window,{
	forceLeaf : true,
	width : 200,
	mode : 'remot',
	show : function(){
		this.win.show();
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		if(this.parentId==''){
			Ext.msg("error",'必选选择一个要复制对象的目标位置'.loc());
		}else{
			this.win.close();
		}
    }
});
Ext.reg('selectrolewindow',dev.program.copyToWindow);