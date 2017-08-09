

bin.task.TaskLogListPanel = function(){
    this.xg = Ext.grid;

   this.ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url:"/bin/task/list.jcp",
			method:'GET'
		}),
        reader: new Ext.data.JsonReader({
            root: 'dataItem',
            totalProperty: 'totalCount',
            id: '时间'.loc()
        }, [
			{name: '时间'.loc(), mapping: '时间'.loc()},
			{name: '日期'.loc(), mapping: '日期'.loc()},
			{name: '任务名称'.loc(), mapping: '任务名称'.loc()},
			{name: '任务状态'.loc(), mapping: '任务状态'.loc()},
			{name: '任务信息'.loc()}
        ]),
        remoteSort: true
    });
    this.ds.setDefaultSort('时间'.loc(), 'desc');

    this.cm = new Ext.grid.ColumnModel([ new this.xg.RowNumberer(),{
           id: '日期'.loc(), 
           header: '日期'.loc(),
           dataIndex: '日期'.loc(),
		   sortable: true,
		   width:20,
           align: 'left'
        },{
           header: '任务名称'.loc(),
           dataIndex: '任务名称'.loc(),
           sortable: true,
		    width:60,
           align: 'left'
        },{
           header: '任务状态'.loc(),
           dataIndex: '任务状态'.loc(),
		   width:20,
		   sortable: true,
           align: 'left'
        },{
           header: '任务信息'.loc(),
           dataIndex: '任务信息'.loc(),
		   sortable: true,
           align: 'left'
        }]);

    this.cm.defaultSortable = true;

	this.TaskLogListGrid = new Ext.grid.GridPanel({
        store: this.ds,
        cm: this.cm,
		border:false,
        trackMouseOver:false,
        loadMask: {msg:'数据载入中...'.loc()},
        viewConfig: {
			forceFit:true, 
            enableRowBody:true, 
            showPreview:true, 
            getRowClass : this.applyRowClass 
        },
        bbar: new Ext.PagingToolbar({
            pageSize: 30,
            store: this.ds,
            displayInfo: true,
            displayMsg: '{0}-{1}条 共:{2}条'.loc(),
            emptyMsg:'没有数据'.loc()
        }),
        tbar: [{
			text: '清空'.loc(),
			icon: '/themes/icon/xp/clear.gif',
			cls: 'x-btn-text-icon  bmenu',
			disabled:false,
			scope: this,
			hidden : false,
			handler :this.onButtonClick
            }
        ]
    });
	this.MainTabPanel=new Ext.Panel({
			id: 'taskLogListPanel',
			border:false,
			cached:true,
			layout:'fit',
			defaults:{autoScroll:true},
			items:[this.TaskLogListGrid]
	});
};

Ext.extend(bin.task.TaskLogListPanel, Ext.Panel, {
	showList: function(params){	
		this.ds.baseParams = params;
		this.ds.load({params:{start:0, limit:30}});
		this.frames.get("TaskLog").mainPanel.hideStatus();
	},
	onButtonClick : function(item){
		Ext.msg('confirm', '确认清空当前条件下的任务日志?'.loc(), function (answer){
	    if (answer == 'yes') {
			var delParams=this.ds.baseParams
			delParams['type']='delete';
			Ext.Ajax.request({ 
				url:'/bin/task/list.jcp',
				params:delParams,
				method: 'GET',  
				scope:this,
				success:function(response, options){ 
					var check = response.responseText;
					var ajaxResult=Ext.util.JSON.decode(check)
					if(ajaxResult.success){
						this.ds.baseParams = delParams;
						this.ds.baseParams['type']='list';
						this.ds.load({params:{start:0, limit:30}});
					}else{
						Ext.msg("error",'数据删除失败!,原因:'.loc()+'<br>'+ajaxResult.message);
					}
				}
			});  
	  } 
	   }.createDelegate(this));
    }
});

