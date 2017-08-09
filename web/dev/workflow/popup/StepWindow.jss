Ext.namespace("dev.workflow.popup");

dev.workflow.popup.StepWindow = function(parent_id,wf,cell,isEnd){

	this.win;

	this.normalClose=false;
	this.parent_id=parent_id;
	this.cell=cell;

	var id=this.cell.getId();			
	this.step=wf.getStep(id);
	var stepName=this.step.getName();

//-----------初始化属性---------------------------------------------------------------

	var metaProgram=this.step.getMetaAttributes();
	this.programId;
	this.programType;
	
	var metaArray=new Array;
	var n=0;

	for(var i in metaProgram){
		if(metaProgram[i].getName()=='act_id'){
			this.programId=metaProgram[i].getValue();
		}else if(metaProgram[i].getName()=='type'){
			this.programType=metaProgram[i].getValue()
		}else{
			metaArray[n]=new Array;
			metaArray[n][0]=metaProgram[i].getName();
			metaArray[n][1]=metaProgram[i].getValue();
			n++;
		}
	}	

    var fm = Ext.form;
	this.statusDs = new Ext.data.SimpleStore({
		fields:['id', 'label'],
		data:[
			['view', 'view'],
			['new', 'new'],
			['edit', 'edit'],
			['list', 'list'],
			['crossinput', 'crossinput']
		]
	});

	var stepParams={};
	stepParams['type']='step';
	stepParams['parent_id']=this.parent_id;
	this.ds = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: '/dev/workflow/popup/getOptions.jcp',
			method : 'GET'
		}),
		baseParams:stepParams,
		autoLoad :true,
		reader: new Ext.data.JsonReader({
          	root: 'ActArray'
        }, [
			{name: 'id', mapping: 'id'},
			{name: 'label', mapping: 'label'}
		])
	});

	this.baseForm = new Ext.FormPanel({
        title: '常规'.loc(),
        labelWidth: 160, 
		labelAlign: 'right',
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
						new fm.TextField({
							fieldLabel: '步骤ID'.loc(),
							name: 'stepId',
							disable:false,
							value:id,
							width: 160,
							allowBlank:false,
							maxLengthText : '步骤ID不能超过{0}个字符!'.loc(),
							blankText:'步骤ID必须提供.'.loc()
						})
					 ]}
			]
		},		
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
						new fm.TextField({
							fieldLabel: '步骤名称'.loc(),
							name: 'stepName',
							width: 160,
							value:stepName,
							allowBlank:false,
							maxLengthText : '步骤名称不能超过{0}个字符!'.loc(),
							blankText:'步骤名称必须提供.'.loc()
						})
					 ]}
			]
		},
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
					new lib.ComboRemote.ComboRemote({
					   		fieldLabel: '绑定页面'.loc(),
							hiddenName: 'link_program',
							typeAhead: false,
							scope:this,
							store:this.ds,
							editable: true,
							allowBlank:false,
							minLength:1,
							value:this.programId,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							emptyText: '绑定页面选择'.loc()
						})
					 ]}
			]
		},
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
						new fm.ComboBox({
							fieldLabel: '页面状态'.loc(),
							store:this.statusDs,
							hiddenName: 'start_type',
							minLength:1,
							value:this.programType,
							valueField:'id',
							displayField:'label',
							triggerAction:'all',
							mode:'local'
						})
					 ]}
			]
		}
	]
	});

//----------------------------------- 预处理---------------------------------------------------------
	var preFunctions=this.step.getPreFunctions();
	this.preFuctionGrid=new dev.workflow.popup.PreFuctionGrid(parent_id,preFunctions,wf);

//----------------------------------后处理函数-------------------------------------------------------

	var postFunctions=this.step.getPostFunctions();
	this.postFuctionGrid=new dev.workflow.popup.PostFuctionGrid(parent_id,postFunctions,wf);

//-----------------------------------属性------------------------------------------------------------
 
	this.attrGrid=new dev.workflow.popup.attrGrid(metaArray);

//------------------------------EditorGrid 体系------------------------------------------------------
   var panelItems=[];
	panelItems.push(this.baseForm);
	panelItems.push(this.preFuctionGrid.mainPanel);
    if(!isEnd){
		panelItems.push(this.postFuctionGrid.mainPanel);
		panelItems.push(this.attrGrid.mainPanel);
	}

	this.StepPanel = new Ext.TabPanel({
            region: 'center',
            margins:'3 3 3 0', 
            activeTab: 0,
            defaults:{autoScroll:true},
			scope:this,
			collapsible:false,
            items:panelItems
    });

//-------------------------页面设定----------------------------------------------------------------
	this.win =  new Ext.Window({
		title:'步骤设定'.loc(),
		layout:'fit',
		width:386,
		height:303,
		scope:this,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.StepPanel],
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

Ext.extend(dev.workflow.popup.StepWindow, Ext.Window, {
	show : function(){
		this.win.show();
    },
	windowCancel : function(){
		this.normalClose=true;
		this.win.close();
    },
	windowConfirm : function(){
		var fm=this.baseForm.form;
		this.step.setName(fm.findField('stepName').getValue());
		this.cell.setAttribute('label',fm.findField('stepName').getValue());			
		this.step.removeMetaAttributes();
		var meta=new XMeta();	
		var meta1=new XMeta();
		meta.init('act_id',fm.findField('link_program').getValue());
		this.step.addMetaAttributes(meta);
		meta1.init('type',fm.findField('start_type').getValue());
		this.step.addMetaAttributes(meta1);
		var metaArray=this.attrGrid.getAttrs();
		for(var i=0;i<metaArray.length;i++){
			this.step.addMetaAttributes(metaArray[i]);
		}

		this.step.removePreFunctions();
		var preFunctionArray=this.preFuctionGrid.getPrefunctions();
		for(var i=0;i<preFunctionArray.length;i++){
			this.step.addPreFunctions(preFunctionArray[i]);
		}

		this.step.removePostFunctions();
		var postFunctionArray=this.postFuctionGrid.getPostfunctions();
		for(var i=0;i<postFunctionArray.length;i++){
			this.step.addPostFunctions(postFunctionArray[i]);
		}
		this.normalClose=false;
		this.win.close();
    }
});
