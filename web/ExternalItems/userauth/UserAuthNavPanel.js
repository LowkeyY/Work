ExternalItems.userauth.UserAuthNavPanel=function(User){this.orgId="";that=this;this.clickEvent=function(clickNode){var params={};var paramString=clickNode.prop.params.split("&");for(var i=0;i<paramString.length;i++){params[paramString[i].split("=")[0]]=paramString[i].split("=")[1];}var User=this.frames.get("UserAuth");if(this.frames.get("state")!="list"){if(!User.mainPanel.havePanel("UserAuthListPanel")){User.UserAuthListPanel=new ExternalItems.userauth.UserAuthListPanel(User);User.UserAuthListPanel.frames=this.frames;User.mainPanel.add(User.UserAuthListPanel.MainTabPanel);}else{User.mainPanel.getStatusBar().hide();}User.mainPanel.setActiveTab("UserAuthListPanel");User.UserAuthListPanel.showList(params);}else{User.UserAuthListPanel.showList(params);}};this.onButtonClick=function(){var params={};params.dept_id="99999";params.org_id=that.orgId;params.query_type=this.queryList[0].getValue();params.keyword=this.queryList[1].getValue();var User=this.frames.get("UserAuth");if(this.frames.get("state")!="list"){if(!User.mainPanel.havePanel("UserAuthListPanel")){User.UserAuthListPanel=new ExternalItems.userauth.UserAuthListPanel(User);User.UserAuthListPanel.frames=this.frames;User.mainPanel.add(User.UserAuthListPanel.MainTabPanel);}User.mainPanel.setActiveTab("UserAuthListPanel");User.UserAuthListPanel.showList(params);}else{User.UserAuthListPanel.showList(params);}};this.queryList=[];this.queryList.push(new Ext.form.ComboBox({width:85,fieldLabel:"查询类型".loc(),hiddenName:"query_type",name:"query_type",allowBlank:false,mode:"local",editable:false,triggerAction:"all",emptyText:"请选择...".loc(),store:new Ext.data.SimpleStore({fields:["value","text"],data:[["1","用户名".loc()],["2","真实姓名".loc()],["3","办公电话".loc()],["4","用户ID".loc()]]}),valueField:"value",displayField:"text",value:1}));this.queryList.push(new Ext.form.TextField({id:"keyword",name:"keyword",width:90,maxLength:30}));this.queryList.push(new Ext.Toolbar.Button({text:"搜索".loc(),icon:"/themes/icon/xp/search.gif",cls:"x-btn-text-icon  bmenu",disabled:false,scope:this,hidden:false,handler:this.onButtonClick}));ExternalItems.userauth.UserAuthNavPanel.superclass.constructor.call(this,{title:"部门导航".loc(),region:"west",split:true,width:260,collapsible:true,margins:"0 0 0 0",cmargins:"0 0 0 0",tbar:this.queryList});};Ext.extend(ExternalItems.userauth.UserAuthNavPanel,Ext.Panel,{init:function(){var conn=new Ext.data.Connection();conn.request({method:"GET",url:"/bin/user/getOrg.jcp?"});conn.on("requestcomplete",function(conn,oResponse){var orgJSON=Ext.decode(oResponse.responseText);var name=orgJSON.shortName;if(name==""){name=orgJSON.name;}this.orgId=orgJSON.id;this.menuTree=new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" event="event1"><e _id="'+orgJSON.id+'" _parent="root" title="'+name+'"  type="new"  params="dept_id='+orgJSON.id+'"  url="/bin/user/tree.jcp?dept_id='+orgJSON.id+'"   icon0="/themes/icon/all/chart_organisation.gif" icon1="/themes/icon/all/chart_organisation.gif"/></forder></root>'));this.event1=new Object();var titleClick=this.clickEvent.createDelegate(this);this.event1.title_click=function(){titleClick(this);};this.menuTree.setEvent("event1",this.event1);this.menuTree.finish(this.body.dom,document);this.focusHistoryNode();},this);},getTree:function(){return this.menuTree;},exeHistoryNode:function(menuTree,nowNode){if(nowNode.prop.event&&nowNode.prop.params){this.clickEvent(nowNode);}else{if(nowNode.prop._parent=="0"&&nowNode.index()==nowNode.parent.son.length-1){return ;}else{menuTree.moveNext();var newNode=menuTree.getNowNode();this.exeHistoryNode(menuTree,newNode);}}},focusHistoryNode:function(){uStore=new UserStore(tree_store);if(uStore.getAttribute("Dept")){this.menuTree.loadHistory("Dept");var nowNode=this.menuTree.getNowNode();}else{var nowNode=this.menuTree.getNowNode();this.menuTree.loadHistory("Dept");}this.exeHistoryNode(this.menuTree,nowNode);}});