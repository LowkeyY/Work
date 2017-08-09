Ext.namespace("dev.workflow");using("lib.scripteditor.CodeEditor");dev.workflow.SaveWorkflow=function(params,wf){this.wf=wf;this.params=params;this.win;var ButtonArray=[];ButtonArray.push(new Ext.Toolbar.Button({btnId:"save",text:"保存".loc(),icon:"/themes/icon/xp/save.gif",cls:"x-btn-text-icon  bmenu",disabled:false,scope:this,hidden:false,handler:this.onButtonClick}));ButtonArray.push(new Ext.Toolbar.Separator());ButtonArray.push(new Ext.Toolbar.Button({btnId:"check",text:"语法检查".loc(),icon:"/themes/icon/xp/script.gif",cls:"x-btn-text-icon  bmenu",disabled:false,scope:this,hidden:false,handler:this.onButtonClick}));ButtonArray.push(new Ext.Toolbar.Separator());var w=Ext.lib.Dom.getViewWidth();var h=Ext.lib.Dom.getViewHeight()-30;var xmlCodeEditor=new lib.scripteditor.CodeEditor({id:"xmlCodeValue",language:"xml",hideLabel:true,height:h-70,allowBlank:false,blankText:"请输入XML协议".loc()});ButtonArray=ButtonArray.concat(xmlCodeEditor.getButtons());ButtonArray.push(new Ext.Toolbar.Separator());ButtonArray.push(new Ext.Toolbar.Button({btnId:"close",text:"关闭".loc(),icon:"/themes/icon/xp/close.gif",cls:"x-btn-text-icon  bmenu",disabled:false,scope:this,hidden:false,handler:this.onButtonClick}));this.SaveWorkflowForm=new Ext.FormPanel({labelWidth:100,layout:"fit",labelAlign:"right",border:true,bodyStyle:"padding:0px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;",items:xmlCodeEditor});var desktop=WorkBench.Desk.getDesktop();this.win=desktop.getWindow("WorkflowWindow");if(!this.win){this.win=desktop.createWindow({id:"WorkflowWindow",title:"工作流定义".loc(),layout:"fit",width:w,height:h,closeAction:"hide",plain:false,modal:false,items:[this.SaveWorkflowForm],tbar:ButtonArray});}this.win.show();};Ext.extend(dev.workflow.SaveWorkflow,Ext.Window,{load:function(xml){this.win.on("show",function(){setTimeout(function(){this.SaveWorkflowForm.form.findField("xmlCodeValue").setValue(xml);}.createDelegate(this),500);},this);Workflow=this.frames.get("Workflow");},onButtonClick:function(item){if(item.btnId=="close"){this.win.close();}else{if(item.btnId=="save"){var xml=this.SaveWorkflowForm.form.findField("xmlCodeValue").getValue();if(xml.value==""){Ext.msg("error","查询保存失败,原因:请输入工作流定义XML协议".loc());return ;}var msg=Tool.postXML("/dev/workflow/WorkflowEvent.jcp?event=sav&parent_id="+this.params.parent_id+"&instanceId="+this.params.instanceId,xml);if(msg.firstChild.firstChild.nodeValue=="true"){this.wf.removeAll();var tempXML=Tool.parseXML(xml);var classMap=tempXML.childNodes;var len=classMap.length;for(var i=0;i<len;i++){var elements=classMap[i];if(elements.tagName=="flowmodal"){var flowElements=elements.childNodes;this.wf.init(flowElements);}}Ext.msg("info","完成工作流定义更新.".loc());}else{Ext.msg("error","查询保存失败,原因:".loc()+"<br>"+msg.lastChild.firstChild.nodeValue);}}else{if(item.btnId=="check"){var xml=this.SaveWorkflowForm.form.findField("xmlCodeValue").getValue();if(xml.value==""){Ext.msg("error","请输入工作流定义XML协议".loc());return ;}var msg=Tool.postXML("/dev/workflow/WorkflowEvent.jcp?event=check&parent_id="+this.params.parent_id+"&instanceId="+this.params.instanceId,xml);if(msg.firstChild.firstChild.nodeValue=="false"){Ext.msg("error",msg.lastChild.firstChild.nodeValue);}else{Ext.msg("info","工作流定义验证成功!.".loc());}}}}}});