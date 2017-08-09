

dev.system.GroupPanel = function(frames,params){
	this.frames= frames;
	var System = this.frames.get("System");
	var ButtonArray=[];
	this.params=params;
	
	this.retFn = function(main){
		main.setActiveTab("systemGroup");
		main.setStatusValue(['应用组管理'.loc()]);
	}.createCallback(System.mainPanel);
	this.formDS = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/system/groupcreate.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["group_id","group_name","group_pname","group_desc","lastModifyTime","lastModifyName"]),
		remoteSort: false
	});

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'groupBack',
				text: '返回'.loc(),
				icon: '/themes/icon/common/redo.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				hidden : true,
				scope: this,
				handler :this.params.retFn
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'groupSave',
				text: '保存'.loc(),
				state:'create',
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : false,
				scope: this,
				handler :this.onButtonClick
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'groupClear',
				text: '清空'.loc(),
				state:'create',
				icon: '/themes/icon/xp/clear.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : false,
				handler :this.onButtonClick
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'groupUpdatesave',
				text: '保存'.loc(),
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'groupDelete',
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));

//---------------------查看状态下的按钮-------------------------------------------------

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'newapplication',
				text: '新建应用'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'newrole',
				text: '新建策略'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'installCpk',
				text: '安装CPK文件',
				icon: '/themes/icon/common/install.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'edit',
				scope: this,
				hidden : true,
				handler :this.onButtonClick
	}));

//系统初始化

	this.systemForm = new Ext.FormPanel({
        labelWidth: 100, 
		labelAlign: 'right',
		id: 'systemGroup',
		cached:true,
        url:'/dev/system/groupcreate.jcp',
        method:'POST',
        border:false,
        bodyStyle:'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
        items: [
		{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:0.40,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '应用组名称'.loc(),
							name: 'group_name',
							regex:/^[^\<\>\'\"\&]+$/,
							regexText:'应用组名称中不应有'.loc()+'&,<,>,\",'+'字符'.loc(),   
							width: 150,
							maxLength : 24,
							allowBlank:false,
							maxLengthText : '系统名称不能超过{0}个字符!'.loc(),
							blankText:'系统名称必须提供.'.loc()
						})
					 ]},
			   {
					columnWidth:0.60,
					layout: 'form',
					
					border:false,
					items: [				
						new Ext.form.TextField({
							fieldLabel: '应用组物理名称'.loc(),
							name: 'group_pname',
							
							width: 150,
							maxLength : 24,
							allowBlank:false,
							maxLengthText : '系统名称不能超过{0}个字符!'.loc(),
							blankText:'系统名称必须提供.'.loc()
						})
					 ]
				}
			]
		},
		{
			layout:'column',
			border:false,
            items:
			[
				{columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextArea({
							fieldLabel: '应用组说明'.loc(),
							name: 'group_desc',
							
							width: 550,
							height:60,
							maxLength : 2000,
							maxLengthText : '系统说明不能超过{0}个字符!'.loc()
						})
					 ]}
			]
		}
	],
     tbar:ButtonArray
	});
	this.MainTabPanel=this.systemForm;
};

dev.system.GroupPanel.prototype={
	formCreate : function(params){		
		this.params=params;
		if(this.MainTabPanel.rendered){
			this.toggleToolBar('create');
			this.frames.get("System").mainPanel.setStatusValue(['应用组管理'.loc()]);
		}
    },
	formEdit : function(){
		this.toggleToolBar('edit');
    },
	loadData : function(params){	
		this.params=params;
		this.formDS.baseParams = params;
		this.formDS.on('load', this.renderForm, this);
		this.formDS.load({params:{start:0, limit:1}});
    },	
	toggleToolBar : function(state){	
		var  tempToolBar=this.systemForm.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },
	renderForm: function(){		
		var frm = this.systemForm.form;
		var dss = this.formDS.getAt(0).data;
		frm.findField('group_name').setValue(dss.group_name);
		frm.findField('group_pname').setValue(dss.group_pname);	
		frm.findField('group_desc').setValue(dss.group_desc);
		this.frames.get('System').mainPanel.setStatusValue(['应用组管理'.loc(),dss.group_id,dss.lastModifyName,dss.lastModifyTime]);    
	},
	onButtonClick : function(item){
		var System = this.frames.get("System");
		var frm=this.systemForm.form;
		if(item.btnId=='newapplication'){
			using("lib.ComboTree.ComboTree");
			using("lib.SelectMenu.SelectMenu"); 
			using("dev.system.ApplicationPanel");
			var newParams={};
			newParams['id']=this.formDS.baseParams['id'];
			newParams['type']='new';
			newParams.retFn = this.retFn;
			
			System.applicationPanel = new dev.system.ApplicationPanel(this.frames,newParams);	
			System.mainPanel.add(System.applicationPanel.MainTabPanel);
			System.mainPanel.setActiveTab(System.applicationPanel.MainTabPanel);
			System.applicationPanel.formCreate(newParams);
			System.Frame.doLayout();

		}else if(item.btnId=='newrole'){
			using("dev.system.RolePanel");
			var newParams={};
			newParams['id']=this.formDS.baseParams['id'];
			newParams['type']='new';
			this.params.retFn=this.retFn;
			newParams.retFn=this.retFn;
			
			System.rolePanel = new dev.system.RolePanel(this.frames,this.params);	
			System.mainPanel.add(System.rolePanel.MainTabPanel);
			System.mainPanel.setActiveTab(System.rolePanel.MainTabPanel);
			System.rolePanel.formCreate(newParams);
		}else if(item.btnId=='groupSave'){
			var saveParams=this.params;
			saveParams['type']='save';
		    if (frm.isValid()) {
				  frm.submit({ 
					url:'/dev/system/groupcreate.jcp',
					params:saveParams,
					method: 'post',  
					scope:this,
					success:function(form, action){ 
						System.navPanel.getTree().loadSubNode(action.result.id,System.navPanel.clickEvent);
					},								
					failure: function(form, action) {
						Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
					}
				  });
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}else if(item.btnId=='groupClear'){
			this.systemForm.form.reset();
		}else if(item.btnId=='groupDelete'){
			 Ext.msg('confirm', '警告:删除应用组降导致您的数据不可恢复,确认吗?'.loc(), function (answer){
                   if (answer == 'yes') {
					 Ext.msg('confirm', '请再次确认是否删除应用组?'.loc(), function (answer){
						  if (answer == 'yes') {
								var delParams=this.params;
								delParams['type']='delete';
								frm.submit({ 
									url:'/dev/system/groupcreate.jcp',
									params:delParams,
									method: 'post',  
									scope:this,
									success:function(form, action){ 
										System.navPanel.getTree().loadParentNode(System.navPanel.clickEvent);
									},								
									failure: function(form, action) {
										    Ext.msg("error",'数据提交失败,原因:'.loc()+'<br>'+action.result.message);
									}
								 });
						  } 
					 }.createDelegate(this));
				  } 
             }.createDelegate(this),this);
		}else if(item.btnId=='groupUpdatesave'){
		    if (frm.isValid()) {
			 var updateParams=this.params;
			 updateParams['type']='updatesave';
			 frm.submit({ 
					url:'/dev/system/groupcreate.jcp',
					params:updateParams,
					method: 'post',  
					scope:this,
					success:function(form, action){ 
						System.navPanel.getTree().loadSelfNode(action.result.id,System.navPanel.clickEvent);
					},								
					failure: function(form, action) {
						    Ext.msg("error",'数据提交失败,原因:'.loc()+'<br>'+action.result.message);
					}
				  });
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}else if(item.btnId=='installCpk'){
			loadcss("lib.upload.Base");
			using("lib.upload.Base");
			using("lib.upload.File");

			this.cpkButtonArrays = [];
			this.cpkButtonArrays.push(new Ext.Toolbar.Button({
						text : '安装'.loc(),
						icon : '/themes/icon/common/install.gif',
						cls : 'x-btn-text-icon  bmenu',
						disabled : false,
						scope : this,
						hidden : false,
						handler : this.onUploadButtonClick
					}));
			this.cpkButtonArrays.push(new Ext.Toolbar.Button({
						text : '取消'.loc(),
						icon : '/themes/icon/xp/cancel.png',
						cls : 'x-btn-text-icon  bmenu',
						disabled : false,
						scope : this,
						hidden : false,
						handler : function() {
							this.cpkWindow.close();
						}
					}));
			this.cpkUploadPanel = new Ext.FormPanel({
					labelWidth : 100,
					cached : true,
					labelAlign : 'right',
					url : '/etc/install/install.jcp',
					method : 'POST',
					border : false,
					bodyStyle : 'padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;',
					items : [{
								layout : 'column',
								border : false,
								items : [{
											columnWidth : 1.0,
											layout : 'form',
											border : false,
											items : [{
														xtype : 'fileupload',
														fieldLabel : '上传安装文件'.loc(),
														name : 'installCpkFile',
														pattern : '*.cpk',
														state : 'new',
														allowBlank : false,
														maxSize : 40 * 1024 * 1024,
														width : 350
													}]
										}]
							}]
				});
			this.cpkWindow = new Ext.Window({
						title : '选择CPK文件'.loc(),
						width : 550,
						height : 200,
						autoScroll : false,
						layout : 'fit',
						modal : true,
						plain : true,
						items : this.cpkUploadPanel,
						buttons : this.cpkButtonArrays
					})
			this.cpkWindow.show();
			this.onUploadButtonClick = function(){
				var frm = this.cpkUploadPanel.form;
				var saveParams = {};
				saveParams['type'] = 'install';
				if (frm.isValid()) {
					var form = Ext.getDom(this.cpkUploadPanel.form.el.dom);
					form.target = "installConsole";
					form.method = 'POST';
					form.enctype = form.encoding = 'multipart/form-data';
					form.action = '/etc/install/installCPK.jcp';
					form.submit();
				} else {
					Ext.msg("error", '数据不能提交,请修改表单中标识的错误!'.loc());
				}
			}		
		
		}
    }
};

