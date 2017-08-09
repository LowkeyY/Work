dev.quality.BasePanel=function(frames,params){this.frames=frames;var Quality=this.frames.get("Quality");var ButtonArray=[];this.params=params;this.retFn=function(main){main.setActiveTab("QualityBase");main.setStatusValue(["数据质量管理".loc()]);}.createCallback(Quality.mainPanel);this.dataLinkDS=new Ext.data.JsonStore({url:"/dev/system/getDBLink.jcp",baseParams:{type:"new",optionType:"datalink"},root:"datalink",autoLoad:true,fields:["id","title"]});this.formDS=new Ext.data.Store({proxy:new Ext.data.HttpProxy({url:"/dev/quality/create.jcp",method:"GET"}),reader:new Ext.data.JsonReader({},["total","object_id","tab_id","quality_name","logicname","name","tableName","inte_check","note_template","have_script","note","result_db","result_create","lastModifyName","lastModifyTime","authArray"]),remoteSort:false});ButtonArray.push(new Ext.Toolbar.Button({btnId:"qualitySave",text:"保存".loc(),state:"create",icon:"/themes/icon/common/save.gif",cls:"x-btn-text-icon  bmenu",disabled:false,hidden:false,scope:this,handler:this.onButtonClick}));ButtonArray.push(new Ext.Toolbar.Button({btnId:"qualityClear",text:"清空".loc(),state:"create",icon:"/themes/icon/xp/clear.gif",cls:"x-btn-text-icon  bmenu",disabled:false,scope:this,hidden:false,handler:this.onButtonClick}));ButtonArray.push(new Ext.Toolbar.Button({btnId:"qualityUpdatesave",text:"保存".loc(),icon:"/themes/icon/common/save.gif",cls:"x-btn-text-icon  bmenu",disabled:false,state:"edit",scope:this,hidden:true,handler:this.onButtonClick}));ButtonArray.push(new Ext.Toolbar.Button({btnId:"qualityDelete",text:"删除".loc(),icon:"/themes/icon/common/delete.gif",cls:"x-btn-text-icon  bmenu",disabled:false,state:"edit",scope:this,hidden:true,handler:this.onButtonClick}));ButtonArray.push(new Ext.Toolbar.Button({btnId:"newscript",text:"脚本设计".loc(),icon:"/themes/icon/all/application_edit.gif",cls:"x-btn-text-icon  bmenu",disabled:false,state:"edit",scope:this,hidden:true,handler:this.onButtonClick}));ButtonArray.push(new Ext.Toolbar.Button({btnId:"newrule",text:"设置规则".loc(),icon:"/themes/icon/common/setInsert.gif",cls:"x-btn-text-icon  bmenu",disabled:false,state:"edit",scope:this,hidden:true,handler:this.onButtonClick}));ButtonArray.push(new Ext.Toolbar.Button({text:"新建整改程序".loc(),icon:"/themes/icon/all/application_form.gif",cls:"x-btn-text-icon  bmenu",scope:this,state:"edit",handler:function(){using("lib.ComboRemote.ComboRemote");using("lib.ComboTree.ComboTree");using("dev.program.ProgramPanel");using("dev.program.ProgramGrid");var programType="Quality";Ext.Ajax.request({url:"/dev/module/SelectTerminalType.jcp",params:{id:this.params.object_id},method:"GET",scope:this,success:function(response,options){var result=Ext.decode(response.responseText);if(result.success){var terminalType=result.terminalType;Quality.programPanel=this.frames.createPanel(new dev.program.ProgramPanel(programType,Quality));Quality.mainPanel.add(Quality.programPanel.MainTabPanel);Quality.mainPanel.setActiveTab(Quality.programPanel.MainTabPanel);var progParams={};progParams.grand_parent=this.params.parent_id;progParams.parent_id=this.params.object_id;progParams.objectId=this.params.object_id;progParams.terminalType=terminalType;progParams.retFn=this.retFn;Quality.programPanel.init(progParams,Quality.mainPanel);}else{Ext.msg("error",result.message);}}},this);}}));ButtonArray.push(new Ext.Toolbar.Button({btnId:"newresultsdb",text:"新建成果库".loc(),icon:"/themes/icon/database/database_go.gif",cls:"x-btn-text-icon  bmenu",disabled:false,scope:this,hidden:true,handler:this.onButtonClick}));this.isIntergrete=new Ext.form.RadioGroup({fieldLabel:"是否IMS通知".loc(),width:80,name:"intergrete_check",items:[{boxLabel:"是".loc(),name:"inte_check",inputValue:"true"},{boxLabel:"否".loc(),name:"inte_check",inputValue:"false",checked:true}]});this.isIntergrete.on("change",function(){var frm=this.systemForm.form;if(this.isIntergrete.getValue()=="true"){frm.findField("note_template").show();}else{frm.findField("note_template").hide();}},this);this.systemForm=new Ext.FormPanel({labelWidth:160,labelAlign:"right",id:"QualityBase",cached:true,url:"/dev/quality/create.jcp",method:"POST",border:false,bodyStyle:"padding:20px 0px 0px 0px;height:100%;width:100%;background:#FFFFFF;",items:[{layout:"column",border:false,items:[{columnWidth:0.45,layout:"form",border:false,items:[new Ext.form.TextField({fieldLabel:"逻辑名称".loc(),name:"logicname",width:150,maxLength:100,regex:/^[^\<\>\'\"\&]+$/,regexText:"名称中不应有".loc()+"&、<、>、'、\"、"+"字符".loc(),allowBlank:false,maxLengthText:"逻辑名称不能超过{0}个字符!".loc(),blankText:"逻辑名称不能为空!".loc()})]},{columnWidth:0.55,layout:"form",border:false,items:[new Ext.form.TextField({fieldLabel:"物理名称".loc(),name:"name",width:150,maxLength:100,allowBlank:false,maxLengthText:"名称不能超过{0}个字符!".loc(),blankText:"名称不能为空!".loc()})]}]},{layout:"column",border:false,items:[{columnWidth:0.45,layout:"form",border:false,items:[new lib.ComboTree.ComboTree({fieldLabel:"主数据表".loc(),name:"tab_id",width:160,queryParam:"type",mode:"remot",ctype:"combo",listWidth:250,height:100,allowBlank:false,editable:false,emptyText:"选择主数据表".loc(),blankText:"主数据表必须选择.".loc(),textMode:false,root:new Ext.tree.AsyncTreeNode({text:"所有库".loc(),draggable:false,allowSelect:false,id:this.params.parent_id,icon:"/themes/icon/all/plugin.gif"}),loader:new Ext.tree.TreeLoader({dataUrl:"/dev/program/PropertyGridConfig.jcp",requestMethod:"POST"})})]},{columnWidth:0.55,layout:"form",border:false,items:[this.isIntergrete]}]},{layout:"column",border:false,items:[{columnWidth:1,layout:"form",border:false,items:[new Ext.form.TextArea({fieldLabel:"通知模板".loc(),name:"note_template",allowBlank:true,blankText:"通知模板必须提供.".loc(),width:550,height:60,hidden:true,maxLength:255,maxLengthText:"模板不能超过{0}个字符!".loc()})]}]},{layout:"column",border:false,items:[{columnWidth:1,layout:"form",border:false,items:[new Ext.form.TextArea({fieldLabel:"说明".loc(),name:"note",width:550,height:60,maxLength:255,maxLengthText:"说明不能超过{0}个字符!".loc()})]}]}],tbar:ButtonArray});this.MainTabPanel=this.systemForm;};dev.quality.BasePanel.prototype={formCreate:function(params){this.params=params;if(this.MainTabPanel.rendered){var tempToolBar=this.systemForm.getTopToolbar();if(params.nodeType=="1"){tempToolBar.items.each(function(item){if(item.btnId=="qualitySave"){item.disable();}},tempToolBar.items);}else{if(params.nodeType=="40"){tempToolBar.items.each(function(item){if(item.btnId=="qualitySave"){item.enable();}},tempToolBar.items);}}this.systemForm.form.findField("tab_id").enable();this.toggleToolBar("create");this.systemForm.form.reset();this.frames.get("Quality").mainPanel.setStatusValue(["数据质量管理".loc(),this.params.object_id,"",""]);}},formEdit:function(){this.toggleToolBar("edit");},loadData:function(params){this.params=params;this.formDS.baseParams=params;this.formDS.on("load",function(){var frm=this.systemForm.form;var dss=this.formDS.getAt(0).data;var result_db;if(dss.result_create==false){result_db="未初始化".loc();}else{result_db=dss.result_db;}var tempToolBar=this.systemForm.getTopToolbar();this.renderForm(result_db);if(dss.result_create==false){tempToolBar.items.each(function(item){if(item.btnId=="newresultsdb"){item.show();}},tempToolBar.items);}else{tempToolBar.items.each(function(item){if(item.btnId=="newresultsdb"){item.hide();}},tempToolBar.items);}},this);this.formDS.load();},toggleToolBar:function(state){var tempToolBar=this.systemForm.getTopToolbar();tempToolBar.items.each(function(item){item.hide();},tempToolBar.items);tempToolBar.items.each(function(item){if(item.state==state){item.show();}},tempToolBar.items);},renderForm:function(result_db){var frm=this.systemForm.form;var dss=this.formDS.getAt(0).data;frm.findField("logicname").setValue(dss.logicname);frm.findField("name").setValue(dss.name);frm.findField("tab_id").setValue(dss.main_table,dss.tableName);this.isIntergrete.setValue(dss.inte_check);frm.findField("note_template").setValue(dss.note_template);frm.findField("note").setValue(dss.note);frm.findField("tab_id").disable();this.frames.get("Quality").mainPanel.setStatusValue(["数据质量管理".loc(),result_db,dss.tab_id,dss.lastModifyName,dss.lastModifyTime]);},onButtonClick:function(item){var Quality=this.frames.get("Quality");var frm=this.systemForm.form;if(item.btnId=="newresultsdb"){Ext.Ajax.request({url:"/dev/quality/initresultdb.jcp",params:{},method:"GET",scope:this,success:function(response,options){var check=response.responseText;var ajaxResult=Ext.util.JSON.decode(check);if(ajaxResult.success){Ext.msg("info","成果库初始化成功!".loc());this.frames.get("Quality").mainPanel.setStatusValue(["数据质量管理".loc(),ajaxResult.quality_db,dss.tab_id,dss.lastModifyName,dss.lastModifyTime]);}else{Ext.msg("ERROR","成果库初始化失败!,原因:".loc()+"<br>"+ajaxResult.message);}}});}else{if(item.btnId=="newscript"){using("dev.quality.XRuleScript");using("dev.quality.RuleGrid");using("dev.quality.RuleScriptPanel");this.params.retFn=this.retFn;Quality.ruleScriptPanel=new dev.quality.RuleScriptPanel(this.params,this.frames);Quality.mainPanel.add(Quality.ruleScriptPanel.MainTabPanel);Quality.mainPanel.setActiveTab(Quality.ruleScriptPanel.MainTabPanel);Quality.ruleScriptPanel.loadData(this.params);}else{if(item.btnId=="newrule"){using("dev.quality.RuleManage");var params=this.params;params.retFn=this.retFn;Quality.ruleManage=new dev.quality.RuleManage(params);Quality.mainPanel.add(Quality.ruleManage.MainTabPanel);Quality.mainPanel.setActiveTab(Quality.ruleManage.MainTabPanel);}else{if(item.btnId=="qualitySave"){var saveParams=this.params;saveParams.type="save";saveParams.inte_check=this.isIntergrete.getValue();if(frm.isValid()){frm.submit({url:"/dev/quality/create.jcp",params:saveParams,method:"post",scope:this,success:function(form,action){Quality=this.frames.get("Quality");Quality.navPanel.getTree().loadSubNode(action.result.id,Quality.navPanel.clickEvent);},failure:function(form,action){Ext.msg("error","数据提交失败!,原因:".loc()+"<br>"+action.result.message);}});}else{Ext.msg("error","数据不能提交，请修改表单中标识的错误!".loc());}}else{if(item.btnId=="qualityClear"){this.systemForm.form.reset();}else{if(item.btnId=="qualityDelete"){Ext.msg("confirm","警告：删除将导致您的数据不可恢复，确认吗?".loc(),function(answer){if(answer=="yes"){var delParams=this.params;delParams.type="delete";frm.submit({url:"/dev/quality/create.jcp",params:delParams,method:"post",scope:this,success:function(form,action){Quality=this.frames.get("Quality");Quality.navPanel.getTree().loadParentNode(Quality.navPanel.clickEvent);},failure:function(form,action){Ext.msg("error","数据提交失败,原因:".loc()+"<br>"+action.result.message);}});}}.createDelegate(this));}else{if(item.btnId=="qualityUpdatesave"){if(frm.isValid()){var updateParams=this.params;updateParams.type="updatesave";updateParams.inte_check=this.isIntergrete.getValue();frm.submit({url:"/dev/quality/create.jcp",params:updateParams,method:"post",scope:this,success:function(form,action){Ext.msg("info","更新成功!".loc());Quality=this.frames.get("Quality");Quality.navPanel.getTree().loadSelfNode(action.result.id,Quality.navPanel.clickEvent);},failure:function(form,action){Ext.msg("error","数据提交失败,原因:".loc()+"<br>"+action.result.message);}});}else{Ext.msg("error","数据不能提交，请修改表单中标识的错误!".loc());}}}}}}}}}};