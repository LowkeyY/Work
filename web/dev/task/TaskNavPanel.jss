
dev.task.TaskNavPanel = function(){

	var str='任务导航'.loc();
	
	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1" ><e _id="0" _parent="root" title="'+str+'" url="/dev/system/tree.jcp?rootNode=0&amp;_id=0&amp;type=18"   icon0="/themes/icon/xp/axx.gif" icon1="/themes/icon/xp/axx.gif"/></forder></root>'));
	
	this.event0 = new Object();

	this.clickEvent=function(clickNode){
		var Task=this.frames.get('Task');
		var prop=clickNode.prop.params;
		if(prop){
			var params={};
			var paramString=prop.split('&');
			for(var i=0;i<paramString.length;i++){
				params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
			}	
			if(Task.panelKind!="task"){
				if(!Task.mainPanel.havePanel("textTask")){
					using("dev.task.TaskPanel");
					Task.taskPanel =new dev.task.TaskPanel(this.frames,params);
					Task.mainPanel.add(Task.taskPanel.MainTabPanel);
				}
				Task.mainPanel.setActiveTab("textTask");
			}
			if(clickNode.prop.objectType=="1"){
				if(clickNode.prop.params){
					Task.taskPanel.init(params);
					Task.taskPanel.newTask(params);
				}
			}else if(clickNode.prop.objectType=="18"){
				if(clickNode.prop.params){
					Task.taskPanel.loadData(params);
				}
			}
		}
	}.createDelegate(this);
	
	var titleClick=this.clickEvent;
	this.event0.title_click = function(){
		titleClick(this);
	}
	this.menuTree.setEvent("event0",this.event0);

	dev.task.TaskNavPanel.superclass.constructor.call(this, {
			id:'ReportNavigator',
            title: '任务管理'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            cmargins:'3 3 3 3'
    });
};
Ext.extend(dev.task.TaskNavPanel, Ext.Panel, {
	init : function(){
		this.menuTree.finish(this.body.dom,document);
		this.focusHistoryNode();
	},
	getTree : function(){
		return this.menuTree;
	},
	exeHistoryNode : function(menuTree,nowNode){
		if(nowNode.prop.event&&nowNode.prop.params){
			this.clickEvent(nowNode);
		}else if(nowNode.prop.objectType=='0'&&nowNode.index()==nowNode.parent.son.length -1&&nowNode.parent.son.length!=1){
			return;
		}else{
			menuTree.moveNext();
			var newNode=menuTree.getNowNode();
			if(nowNode.prop._id==newNode.prop._id){
				return;
			}else{
				this.exeHistoryNode(menuTree,newNode)
			}
		}
	},
	focusHistoryNode: function (){
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("Task")){
			this.menuTree.loadHistory("Task");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("Task");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

