Ext.namespace("bin.user");

bin.user.RoleAuthFramePanel = function(frames){

	this.frames = frames;
	this.listButton=[];
	this.selectedRole;
	var RoleAuth =this.frames.get("RoleAuth");

	this.listButton.push(new Ext.Toolbar.Button({
				text: '保存'.loc(),
				icon: '/themes/icon/xp/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));

   this.ds = new Ext.data.Store({  
		proxy: new Ext.data.HttpProxy({
			url:"/bin/user/rolelist.jcp",
			method:'GET'
		}),
        reader: new Ext.data.JsonReader({
            root: 'dataItem',
            totalProperty: 'totalCount',
            id: '序号'
        }, [
			{name: 'id', mapping: '序号'},
			{name: 'name', mapping: '职位名称'}
        ]),
        remoteSort: true
    });
    this.ds.setDefaultSort('序号', 'desc');

    this.tpl = new Ext.XTemplate(
		'<div><tpl for=".">',
            '<div class="thumb-wrap" id="{id}">',
		    '<div class="thumb"><img src="/bin/user/role.gif" title="{name}"></div>',
		    '<span class="x-editable">{shortName}</span></div>',
        '</tpl></div>',
        '<div class="x-clear"></div>'
	);

    this.dv =new Ext.DataView({
			id:'roleView',
            store: this.ds,
            tpl: this.tpl,
            autoHeight:true,
            multiSelect: true,
            overClass:'x-view-over',
            itemSelector:'div.thumb-wrap',
            prepareData: function(data){
                data.shortName = Ext.util.Format.ellipsis(data.name, 10);
                return data;
            }
   });

	this.dv.on('click', function() {
		 this.selectedRole=this.getSelectedRecords()[0];
		 var authParams={};
		 authParams['role_id']=this.selectedRole.id;
		 RoleAuth.roleAuthPanel.renderTree(authParams);
	});

    this.rolePanel = new Ext.Panel({
		region: 'center',
        id:'authView',
        frame:false,
        collapsible:false,
        layout:'fit',
        items: [this.dv]
    });

    RoleAuth.roleAuthPanel = new bin.user.RoleAuthPanel();
	RoleAuth.roleAuthPanel.renderTree();

	this.roleAuthMain = new Ext.Panel({	
        closable:false,
		id: 'roleAuthPanel',
		cached:false,
        layout: 'border',
		region: 'center',
        border:false,
		tbar:this.listButton,
        items: [this.rolePanel ,RoleAuth.roleAuthPanel]
	});

	this.MainTabPanel=this.roleAuthMain;
};
bin.user.RoleAuthFramePanel.prototype={
	showList: function(params){	
		this.ds.baseParams = params;
		this.ds.load();
		this.frames.get("RoleAuth").mainPanel.setStatusValue(['权限管理'.loc()]);

	},
	onButtonClick : function(item){
			var saveParams={};
			 var selectedRole=this.dv.getSelectedRecords()[0];
			if (selectedRole) {
					saveParams['role_id']=selectedRole.id;
					var roleArray=[];
					var all = document.getElementsByName("syschk");
					for ( var i=0;i<all.length;i++ ){
						if(all[i].checked){
							roleArray.push(all[i].value);
						}
					}
					saveParams['syschk']=roleArray;
					Ext.Ajax.request({ 
						url:'/bin/user/auth.jcp',
						params:saveParams,
						method: 'post',  
						scope:this,
						success:function(response, options){ 
							var check = response.responseText;
							var ajaxResult=Ext.util.JSON.decode(check)
							if(ajaxResult.success){
								Ext.msg('info', '完成权限更新.'.loc());
							}else{
								Ext.msg("error",'数据删除失败!,原因'.loc()+':<br>'+ajaxResult.message);
							}
						}
					}); 
            }else{
				Ext.msg("error",'必循选定一个职位进行赋权操作!'.loc());
            } 
    }
};

