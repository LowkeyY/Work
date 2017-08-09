Ext.namespace("dev.query");

dev.query.DataPreview = function(xml,url,columArray,dataArray){
	
	
	this.win;
    this.xg = Ext.grid;

	var ButtonArray=[];
	/*
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'excel',
				text: '导出Excel',
				icon: '/themes/icon/xp/excel.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	*/
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'close',
				text: '关闭'.loc(),
				icon: '/themes/icon/xp/close.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));

	this.columArray=columArray;
	this.dataArray=dataArray;
	this.xml=xml.toString();
	this.url=url;
//---------------------构建查询GridPanel定义----------------------------------------------------------

	if(this.url!=''){
	  this.url=this.url+'&rand='+Math.random();
	   this.ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url:"/dev/query/Preview.jcp?"+this.url,
				method:'GET'
			}),
			reader: new Ext.data.JsonReader({
				root: 'dataItem',
				totalProperty: 'totalCount'
			},this.dataArray),
			remoteSort: true
		});    
	}else{
		
	   this.ds = new Ext.data.Store({
			proxy: new Ext.data.HttpProxy({
				url:"/dev/query/Preview.jcp",
				method: 'POST' 
			}),
			reader: new Ext.data.JsonReader({
				root: 'dataItem',
				totalProperty: 'totalCount'
			},this.dataArray),
			remoteSort: true
	    });
		this.ds.baseParams ={'_XMLSTRING_':this.xml};
	}
    this.cm = new Ext.grid.ColumnModel(this.columArray);
    this.cm.defaultSortable = true;

//---------------------构建查询Panel----------------------------------------------------------

	this.pagingBar=new Ext.PagingToolbar({
			pageSize: 50,
			store: this.ds,
			displayInfo: true,
			displayMsg:'{0}-{1}'+'条 共'.loc()+':{2}'+'条'.loc(),
			emptyMsg:'没有数据'.loc()
	});

	var desktop=WorkBench.Desk.getDesktop();
	var width=desktop.getViewWidth();
	var height=desktop.getViewHeight();
	this.win = desktop.getWindow('queryDataView');

    if(!this.win){
		this.win = desktop.createWindow({
			id: 'queryDataView',
			title:'查询数据预览'.loc(),
			layout:'fit',
			width:width,
			height:height,
			items:{
				xtype:'grid',
				frame:false,
				layout:'fit',
				store: this.ds,
				cm: this.cm,
				trackMouseOver:false,
				loadMask: {msg:'数据载入中...'.loc()},
				viewConfig:{
					forceFit:false, 
					enableRowBody:true, 
					showPreview:true, 
					getRowClass : this.applyRowClass 
				},
				tbar:ButtonArray,
				bbar:this.pagingBar
			}
		});
    };
};
Ext.extend(dev.query.DataPreview,Ext.app.Module,{
	show : function(){
		this.win.show(this);
		this.ds.load({params:{start:0, limit:50}});
    },
	onButtonClick : function(item){
		if(item.btnId=='close'){
			this.win.close();
		}else if(item.btnId=='excel'){
/*
			Ext.Ajax.request({ 
				url:'/bin/bi/downExcel.jcp',
				params:{_XMLSTRING_:this.xml},
				method: 'post',  
				scope:this,
				success:function(response, options){ 
					var check = response.responseText;
					var ajaxResult=Ext.util.JSON.decode(check)
					if(!ajaxResult.success){
						Ext.msg("error",'数据删除失败！,原因:<br>'+ajaxResult.message);
					}
				}
			}); 
			*/
		}
    }
});

