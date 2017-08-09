

bin.workflow.WorkflowPathPanel = function(frames,params){

	this.params=params;
	this.frames= frames;
	Workflow = this.frames.get("Workflow");
	this.retFn = function(main){
		main.setActiveTab("workflowPathPanel");
		main.setStatusValue(['流程实例管理'.loc()]);
	}.createCallback(Workflow.mainPanel);

	var ButtonArray=[];
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'save',
				text: '保存'.loc(),
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				hidden : false,
				scope: this,
				state:'create',
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'updatesave',
				text: '保存'.loc(),
				icon: '/themes/icon/common/save.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'authSet',
				text: '权限设置'.loc(),
				icon: '/themes/icon/common/lock.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'pathSet',
				text: '流程设置'.loc(),
				icon: '/themes/icon/xp/cog_edit.png',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				scope: this,
				hidden : true,
				state:'edit',
				handler :this.onButtonClick
	}));
	this.pathForm = new Ext.FormPanel({
        labelWidth: 160, 
		labelAlign: 'right',
		id: 'workflowPathPanel',
		cached:true,
        url:'/bin/workflow/pathmag.jcp',
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
				   columnWidth:1.0,
				   layout: 'form',
				   
				   border:false,
				   items: [				
						new Ext.form.TextField({
							fieldLabel: '流程名称'.loc(),
							name: 'instance_name',
							regex:/^[^\<\>\'\"\&]+$/,
							regexText:'流程名称中不应有'.loc()+'&,<,>,\',\",'+'字符'.loc(),   
							width: 250,
							maxLength : 50,
							allowBlank:false,
							maxLengthText : '流程名称不能超过{0}个字符!'.loc(),
							blankText:'流程名称必须提供.'.loc()
						})
					 ]}
			]
		},
		{
			layout:'column',
			border:false,
            items:
			[
				{	columnWidth:0.5,
					layout: 'form',
					
					border:false,
						items: [	
							{
								xtype: 'radiogroup',
								fieldLabel: '激活'.loc(),
								name: 'status',
								items: [
									{boxLabel: '是'.loc(), name: 'status', inputValue:'1'},
									{boxLabel: '否'.loc(), name: 'status', inputValue:'0', checked: true}
								]
							}
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
							fieldLabel: '流程描述'.loc(),
							name: 'description',
							
							width: 450,
							height:60,
							maxLength : 255,
							maxLengthText : '流程描述不能超过{0}个字符!'.loc()
						})
					 ]}
			]
		}
	],
	tbar:ButtonArray});

	this.formDS = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/bin/workflow/pathmag.jcp',
			method : 'GET'
		}),
		reader: new Ext.data.JsonReader({},["workflowid","instanceId","instance_name","status","description","ENTRY_NAME","ENTRY_date"]),
		remoteSort: false
	});

	this.MainTabPanel=this.pathForm;
};

bin.workflow.WorkflowPathPanel.prototype= {
	formCreate : function(params){		
		this.params = params;
		this.toggleToolBar('create');
		this.pathForm.form.reset();
		this.frames.get("Workflow").mainPanel.setStatusValue(['流程实例管理'.loc(),params.parent_id]);
    },
	formEdit : function(){
		this.toggleToolBar('edit');
    },
	toggleToolBar : function(state){	
		var  tempToolBar=this.pathForm.getTopToolbar();
		tempToolBar.items.each(function(item){    
			item.hide();
		}, tempToolBar.items);
		tempToolBar.items.each(function(item){ 
			if(item.state==state)
				item.show();
		}, tempToolBar.items);
    },
	loadData:function(params){	
		Workflow.params=params;
		this.params = params;
		this.formDS.baseParams = params;
		this.formDS.on('load', this.renderForm, this);
		this.formDS.load({params:{start:0, limit:1}});
    },
	renderForm: function(){		
		var frm=this.pathForm.form;
		var data=this.formDS.getAt(0).data;
		frm.findField('instance_name').setValue(data.instance_name);	
		frm.findField('description').setValue(data.description);
		frm.findField('status').setValue(data.status);
		this.frames.get("Workflow").mainPanel.setStatusValue(['流程实例管理'.loc(),data.workflowid,data.ENTRY_NAME,data.ENTRY_date]);
	},
	onButtonClick : function(item){
		var frm=this.pathForm.form;
		if(item.btnId=='save'){
			var saveParams=this.params;
			saveParams['type']='save';
			if (frm.isValid()){
				  frm.submit({ 
					url:'/bin/workflow/pathmag.jcp',
					params:saveParams,
					method: 'post',  
					scope:this,
					success:function(form, action){ 
						Workflow.navPanel.getTree().loadSubNode(action.result.instanceId,Workflow.navPanel.clickEvent);
					},								
					failure: function(form, action) {
							Ext.msg("error",'数据提交失败!,原因:'.loc()+'<br>'+action.result.message);
					}
				  });
			}else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
			}
		}else if(item.btnId=='clear'){
			this.pathForm.form.reset();
		}else if(item.btnId=='delete'){
			 Ext.msg('confirm', '确认删除?'.loc(), function (answer){
                   if (answer == 'yes') {
						var delParams=this.params;
						delParams['type']='delete';
						 frm.submit({ 
							url:'/bin/workflow/pathmag.jcp',
							params:delParams,
							method: 'post',  
							scope:this,
							success:function(form, action){ 
								Workflow.navPanel.getTree().loadParentNode(Workflow.navPanel.clickEvent);
							},								
							failure: function(form, action) {
								    Ext.msg("error",'数据删除失败!,原因:'.loc()+'<br>'+action.result.message);
							}
						  });
				  } 
               }.createDelegate(this));
		}else if(item.btnId=='updatesave'){
		    if (frm.isValid()) {
			  var updateParams=this.params;
			  updateParams['type']='updatesave';
			 frm.submit({ 
					url:'/bin/workflow/pathmag.jcp',
					params:updateParams,
					method: 'post',  
					scope:this,
					success:function(form, action){ 
						Workflow.navPanel.getTree().loadSelfNode(action.result.instanceId,Workflow.navPanel.clickEvent);
					},								
					failure: function(form, action) {
						    Ext.msg("error",'数据提交失败,原因:'.loc()+'<br>'+action.result.message);
					}
				  });
            }else{
				Ext.msg("error",'数据不能提交,请修改表单中标识的错误!'.loc());
            }
		}else if(item.btnId=='authSet'){
			var conn=new Ext.data.Connection();
			conn.request({    
					method: 'GET',    
					url:'/bin/user/getOrg.jcp?'
			});				
			conn.on('requestcomplete', function(conn, oResponse ){	
				var orgJSON = Ext.decode(oResponse.responseText);
				var name=orgJSON.shortName;
				if(name==""){
					name=orgJSON.name;
				}
				using("bin.workflow.WorkflowAuthFramePanel");
				using("bin.workflow.WorkflowAuthPanel");
				this.params.retFn = this.retFn;
				this.params.rootId=orgJSON.id;
				this.params.rootName=name;
				Workflow.workflowFrameAuthPanel = new bin.workflow.WorkflowAuthFramePanel(this.frames,this.params);
				Workflow.mainPanel.add(Workflow.workflowFrameAuthPanel.MainTabPanel);
				Workflow.mainPanel.setActiveTab(Workflow.workflowFrameAuthPanel.MainTabPanel);
				Workflow.workflowFrameAuthPanel.init(this.params.instanceId);
			},this);
		}else if(item.btnId=='pathSet'){
			var loadWorkflow=function(){
				using("dev.workflow.XWorkflow");
				using("dev.workflow.DesignPanel");               
				this.params['event']='open';
				this.params.retFn = this.retFn;	
				Workflow.designPanel = this.frames.createPanel(new dev.workflow.DesignPanel(this.params,Workflow,'workflow')); 
				Workflow.mainPanel.add(Workflow.designPanel.MainTabPanel);
				Workflow.mainPanel.setActiveTab(Workflow.designPanel.MainTabPanel);               
				Workflow.designPanel.init();
			}.createDelegate(this);
			if(Ext.isIE){
				useJS(
					["/dev/workflow/mxclient-ie.js","/dev/workflow/mxApplication.js"],loadWorkflow
				);
			}else{
				useJS(
					["/dev/workflow/mxclient-ff.js","/dev/workflow/mxApplication.js"],loadWorkflow
				);
			}
		}  
    }
};