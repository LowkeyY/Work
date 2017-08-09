Ext.namespace("dev.ctrl");

dev.ctrl.ConditionColumn = function(params, retFn) {
	var object_id = params.parent_id;
	this.params = params;
	var buttonArray = new Array();
	buttonArray.push(new Ext.Toolbar.Button({
				text : '返回'.loc(),
				icon : '/themes/icon/xp/undo.gif',
				cls : 'x-btn-text-icon  bmenu',
				disabled : false,
				scope : this,
				handler : retFn
	}));
	buttonArray.push(new Ext.Toolbar.Button({
		btnId:'save',
		text : '保存'.loc(),
		icon : '/themes/icon/xp/save.gif',
		cls : 'x-btn-text-icon  bmenu',
		disabled : false,
		scope : this,
		handler : this.onButtonClick
	}));
	buttonArray.push(new Ext.Toolbar.Separator({
				hidden : false
	}));
	buttonArray.push(new Ext.Toolbar.Button({
				btnId:'add',
				text: '增加'.loc(),
				icon: '/themes/icon/all/add.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	buttonArray.push(new Ext.Toolbar.Button({
				btnId:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/all/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));

//----------------------------------------------------------------------------

	var loader=new Ext.tree.TreeLoader({
			dataUrl:'/dev/ctrl/tabletree.jcp',
			requestMethod:"POST",
			baseParams:params
	});
	loader.on('load',function(l,node,r){
		 var result = Ext.util.JSON.decode(r.responseText);
		 for(var i=0;i<result.length;i++){
			var nodeItem=result[i];
			node.attributes['dataType']=nodeItem.dataType;
			node.attributes['hasForeignKey']=nodeItem.hasForeignKey;
			node.attributes['specialSet']=nodeItem.specialSet;
		 }
	},this);

	this.tree = new Ext.tree.TreePanel({
		animate:true, 
		autoScroll:true,
		loader:loader,
		enableDrag:true,
		ddGroup:"tree2grid",
		containerScroll: true,
		region : 'west',
		cmargins : '5 5 0 5',
		split : true,
		width : 350,
		minSize : 100,
		maxSize : 300,
		frame : false
	});

	new  Ext.tree.TreeSorter(this.tree, {folderSort:true});
    this.tree.on("render",function(){
		var ddrow = new Ext.dd.DropTarget(this.tree.getEl(),{
			ddGroup : 'grid2tree',
			notifyDrop:function(dd,e,data){
				this.grid2tree(data.grid,data.rowIndex,this.tree);
			}.createDelegate(this)
		});
	},this);

	this.root = new Ext.tree.AsyncTreeNode({
		text: '数据表'.loc(), 
		draggable:false, 
		id:'0',
		icon:"/themes/icon/all/chart_organisation.gif"
	});
	this.tree.setRootNode(this.root);

//****************************************************************************************************
	using('dev.ctrl.ConditionGridPanel');
	this.conditionGridPanel = new dev.ctrl.ConditionGridPanel(this.params);

	
//********************************************************************************************************

	this.MainTabPanel = new Ext.Panel({
			id : "ConditionColumn",  
			border : false,
			tbar : buttonArray,
			layout : 'border',
			split : true,
			items : [this.tree, this.conditionGridPanel]
	});
};
dev.ctrl.ConditionColumn.prototype = {
	init:function(params,mp){
		root=this.tree.root;
		root.expand();
		this.conditionGridPanel.ds.reload({
			params: params
		});
		mp.setStatusValue(['条件字段设置'.loc()]);
	},
	onButtonClick : function(item){
		if(item.btnId=='save'){
			 this.conditionGridPanel.save(this.params);
		}else if(item.btnId=='add'){
			var node=this.tree.getSelectionModel().getSelectedNode();
			if(node==null) return;
			this.conditionGridPanel.tree2grid(node,this.conditionGridPanel.conditionGrid);
		}else if(item.btnId=='delete'){
			var grid=this.conditionGridPanel.conditionGrid;
			var arr=grid.getSelectionModel().getSelections();
			if(arr=='') return;
			for(var i=0;i<arr.length;i++)
				this.grid2tree(grid,arr[i],this.tree);
		}
    },
	grid2tree:function(grid,rec,tree){
			var store=grid.getStore();
			if(typeof(rec)=='number') 
				rec=store.getAt(rec);
			store.remove(rec);  
	}
}