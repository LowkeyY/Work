Ext.namespace("bin.workflow");
bin.workflow.ApplyPanel = function(){
	var listButton=[];

	listButton.push(new Ext.Toolbar.Button({
			btnId:'refresh',
			text: '刷新'.loc(),
			icon: '/themes/icon/all/arrow_refresh.gif',
			cls: 'x-btn-text-icon  bmenu',
			disabled:false,
			scope: this,
			hidden : false,
			handler :this.onButtonClick
	}));
	listButton.push(new Ext.Toolbar.Separator());

	this.WFPanel=new Ext.Panel({
			border:false,
			layout:'fit',
			defaults:{autoScroll:true}
	});

	this.MainTabPanel=new Ext.Panel({
			id: 'ApplyPanel',
			layout:'fit',
			bodyStyle:'padding:20px 20px 20px 20px;height:100%;width:100%;background:#FFFFFF;',
			items:this.WFPanel,
			tbar:listButton,
			p:function(workflowId,instanceId){
				var parentPanel=this.ownerCt;
		 		parentPanel.hideStatus();
				Ext.Ajax.request({
						url : '/bin/workflow/flowframe.jcp',
						params : {
							workflowId:workflowId,
							instanceId:instanceId
						},
						method : 'GET',
						success : function(response, options) {		    
							var moduleJson=Ext.decode(response.responseText);
							var panels=CPM.Frame.getFrame(moduleJson);
							var panel=new Ext.Panel({
								layout:'border',
								border:false,
								items:panels
							});
							
							if(moduleJson.modType*1==3){
								for(i=0;i<panels.length;i++){   
									var p=panels[i];
									var pa=p.items?(Ext.isArray(p.items)?p.items[0]:p.items):p;
									
									var param={
											pageType:pa.pageType,
											workflowId:pa.workflowId,
											objectId:pa.objectId,
											instanceId:pa.instanceId,
											entryId:pa.entryId,
											stepId:pa.stepId,
											flowType:pa.flowType,
											programType:pa.programType,
											exportTab:pa.exportTable,
											exportItem:pa.exportItem,
											exportData:pa.exportData,
											dataId:pa.dataId
									};		
									var frameIndex=p.frameIndex;
									for(var i in frameIndex){
										var np=Ext.getCmp(frameIndex[i]);
										np.on("afterlayout",function(cpanel){
											if(!cpanel.isPrgLoaded){
												cpanel.isPrgLoaded=true;
												cpanel.loadProgram.defer(10,cpanel,[param,true]);
											}
										})
									}      
								}
							}
							parentPanel.returnFn=function(){
								var Workflow=parentPanel.frames.get('Workflow');
								parentPanel.remove(parentPanel.getComponent(0));
								Workflow.mainPanel.hideStatus();
								var applyPanel=new bin.workflow.ApplyPanel(); 
								Workflow.mainPanel.add(applyPanel.MainTabPanel);
								Workflow.mainPanel.setActiveTab("ApplyPanel");
								Workflow.navPanel.ds.reload();
								applyPanel.init();
							};
							parentPanel.add(panel);
							parentPanel.setActiveTab(panel);
						}
				});
				parentPanel.remove(this, true);
			}
	});
	
};
bin.workflow.ApplyPanel.prototype={
	init: function(){	
		var treeHtml;
		var WFPanel=this.WFPanel;
		Ext.Ajax.request({ 
				url:'/bin/workflow/wfapply.jcp?',
				method: 'GET',  
				scope:this,
				success:function(response, options){ 
					var check = response.responseText;
					var ajaxResult=Ext.util.JSON.decode(check)
					treeHtml='<table cellpadding cellspacing width="100%" height="100%"><tr height=100% ><td  height=100%  style="padding:10" ><fieldset><legend><font color="#000000"><B>'+'工作申请'.loc()+'</B></font></legend><table width=100% height=430 style="background-color:#FFFFFF;padding:20px;"">';
					var workflowArray=ajaxResult.workflow;
					var divider=2;
					if(workflowArray.length>10)
						divider=3;
					else if(workflowArray.length>20)
						divider=4;

					for(var i=0;i<workflowArray.length;i++){	
						  if (i%divider==0){
								treeHtml+='<TR><TD vAlign=top align=left width="30%" style="padding:15">';
							}else{
								treeHtml+='<TD vAlign=top align=left width="30%" style="padding:15">';
							}
							treeHtml+='<UL style="font-size:13px;line-height:8mm;list-style-type:disc;padding-left:1cm"><LI><B>'+workflowArray[i].WorkflowType+'</B></LI></UL>';
							var wfListArray=workflowArray[i].wfListArray;
							for(var j=0;j<wfListArray.length;j++){
								treeHtml+='<UL style="font-size:12px;line-height:6mm;list-style-type:circle;padding-left:1.3cm"><LI style="cursor:hand" onclick="Ext.getCmp(\'ApplyPanel\').p(\''+wfListArray[j].workflowId+'\',\''+wfListArray[j].instanceId+'\');">'+wfListArray[j].instanceName+'</LI></UL>';
							}
							treeHtml+='</TD>';
					}
					treeHtml+='</table></fieldset></td></tr></table>';
					WFPanel.getEl().update(treeHtml);
				}
		}); 
	},
	onButtonClick : function(item){
		if(item.btnId=='refresh'){
			this.init();
		}
    }
};

