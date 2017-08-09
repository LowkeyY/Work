
home.system.help.HelpDetailPanel= function(frames,params,newpart){
	this.params=params;
	
	Ext.form.Field.prototype.msgTarget='side';
	this.frames = frames;
	
	this.ButtonArray=[];

	this.ButtonArray.push(new Ext.Toolbar.Button({
				id:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : false,
				handler :function(){
					 Ext.msg('confirm', '警告:删除帮助将不可恢复,确认吗?'.loc(), function (answer){
					   if (answer == 'yes') {
							var delParams=this.params;
							delParams['type']='delete';
							this.frm.submit({ 
								url:'/home/system/help/publish.jcp',
								params:delParams,
								method: 'post',  
								scope:this,
								success:function(form, action){ 
									Help.navPanel.getTree().loadParentNode(Help.navPanel.clickEvent);
								},								
								failure: function(form, action) {
									Ext.msg("error",'数据提交失败!,原因'.loc()+':<br>'+action.result.message);
								}
							  });
					  } 
				 }.createDelegate(this));
				}
	}));
 	this.ButtonArray.push(new Ext.Toolbar.Button({
				id:'new',
				text: '新建段落'.loc(),
				icon: '/themes/icon/xp/new.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : false,
				handler :function(){
					Help.mainPanel.items.each(function(item){   
							Help.mainPanel.remove(item);	
					}, Help.mainPanel.items);		
					Help.HelpPublishPanle = new home.system.help.HelpPublishPanel(this.frames,this.params,"newpart");
					Help.mainPanel.add(Help.HelpPublishPanle.MainTabPanel);
					Help.Frame.doLayout();
				}
	}));
	this.ButtonArray.push(new Ext.Toolbar.Button({
				id:'redo1',
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : false,
				handler :function(){
					Help.mainPanel.items.each(function(item){   
						if(item.id.indexOf('programPanel')==-1){
							Help.mainPanel.remove(item);	
						}
					}, Help.mainPanel.items);		
					Help.HelpPanel = new home.system.help.HelpPanel(this.frames,this.params);
					Help.mainPanel.add(Help.HelpPanel.MainTabPanel);
					Help.Frame.doLayout();
					Help.HelpPanel.loadData(this.params);
					Help.HelpPanel.formEdit();
				}
	}));

	this.detailForm = new Ext.Panel({
				id:'DetailPanel',
				region:'center',
				collapsible: false,
				split:true,	
				layout:'fit',
				margins:'3 3 3 0',
				autoLoad:{url:'/home/system/help/detail.jcp?help_id='+params.help_id,scripts:true},
				tbar:this.ButtonArray
		});  
	
	this.MainTabPanel = new Ext.TabPanel( {
		id : 'metaTablePanel',
		border : false,
		activeTab : 0,
		tabPosition : 'bottom',
		items :[this.detailForm]
	})
};

Ext.extend(home.system.help.HelpDetailPanel, Ext.Panel, {

});