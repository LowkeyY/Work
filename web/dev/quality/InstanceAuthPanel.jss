

dev.quality.InstanceAuthPanel = function(frames,instanceId,qualityId){
	this.frames=frames;
	this.instanceId=instanceId;
	this.qualityId=qualityId;
	this.ds=new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/quality/auth.jcp?',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({root: 'authArray'},["user_id","user_name","dept_id","dept_name"]),
		remoteSort: false
	})
	this.authGrid = new Ext.grid.GridPanel({
		title: '赋权人员列表'.loc(),
		closable: false,
		border:true,
		store: this.ds,
		ddGroup:'grid2tree',
		columns: [
			{header: "部门".loc(), width: 120, sortable: false, dataIndex: 'dept_name'},
			{header: "人员".loc(), width: 200, sortable: false,dataIndex: 'user_name'}
		],
		viewConfig: {
			forceFit: true
		},
		frame:false,
        enableDragDrop:true
	});
	this.authGrid.on("render",function(){
		var grid=this.authGrid;
		var drops = new Ext.dd.DropTarget(grid.getEl(), {
			ddGroup : 'tree2grid',
			notifyDrop : function(dd, e, data){
				this.tree2grid(data.node,grid);
				return true;
			}.createDelegate(this)
		});
		grid.getSelectionModel().on("beforerowselect",function(obj,r,k,record){
		   grid.ddText=record.get("dept_name")+":"+record.get("user_name");
		   return true;
		})
	},this);
	dev.quality.InstanceAuthPanel.superclass.constructor.call(this,{
		region:'east',
		collapsible: false,
		split:true,
		width:400,
		minSize: 175,
		maxSize: 400,
		layout:'fit',
		border:false,
		margins:'0 0 0 0',
		items:[this.authGrid]
    });
};

Ext.extend(dev.quality.InstanceAuthPanel, Ext.Panel, {
	tree2grid:function(node,grid){
		var pnode=node.parentNode;
		var temlateRecord = Ext.data.Record.create([
			{name:"dept_id"},
			{name:"user_id"},
			{name:"dept_name"},
			{name:"user_name"}]);
		grid.getStore().add(new temlateRecord({
			dept_id:pnode.id,
			dept_name:pnode.text,
			user_id:node.id,
			user_name:node.text
			})); 
		node.remove();
	},
	save: function(params){
			var ids=new Array();
			this.ds.each(function(rec){ids.push(rec.get("user_id"));});
			Ext.Ajax.request({ 
				url:'/dev/quality/auth.jcp',
				params:{ids:ids,instanceId:this.instanceId,qualityId:this.qualityId},
				method: 'post',  
				scope:this,
				success:function(response, options){ 
					var check = response.responseText;
					var ajaxResult=Ext.util.JSON.decode(check)
					if(ajaxResult.success){
						Ext.msg("info",'完成权限更新.'.loc());
					}else{
						Ext.msg("error",'数据删除失败!,原因:'.loc()+'<br>'+ajaxResult.message);
					}
				}
		}); 
	}
});

