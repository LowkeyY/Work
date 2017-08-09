
bin.workflow.WorkflowPathNavPanel = function(frames){
	
	 this.frames=frames;

	this.menuTree = new MenuTree(Tool.parseXML('<root _id="root"><forder _hasChild="1"><e _id="top" _parent="root" title="'+'工作流导航'.loc()+'" target="right"  url="/bin/workflow/pathtree.jcp?_id=top"/></forder></root>'));
	this.event1 = new Object();

	this.clickEvent=function(clickNode){
			Workflow = this.frames.get("Workflow");
			var params={};
			if(clickNode.prop.params){
				var paramString=clickNode.prop.params.split('&');
				for(var i=0;i<paramString.length;i++){
					params[paramString[i].split('=')[0]]=paramString[i].split('=')[1];
				}	
			}
			if(!Workflow.mainPanel.havePanel("workflowPathPanel")){
				using("bin.workflow.WorkflowPathPanel");
				Workflow.pathPanel = new bin.workflow.WorkflowPathPanel(this.frames,params);
				Workflow.mainPanel.add(Workflow.pathPanel.MainTabPanel);
			}
			Workflow.mainPanel.setActiveTab("workflowPathPanel");

			if(params['type']=='create'){
				Workflow.pathPanel.formCreate(params);
			}else if(params['type']=='edit'){
				Workflow.pathPanel.formEdit();
				Workflow.pathPanel.loadData(params);
			}
	}.createDelegate(this);

	var titleClick=this.clickEvent.createDelegate(this);
	this.event1.title_click = function(){
		titleClick(this);
	};
	this.menuTree.setEvent("event1",this.event1);	

	bin.workflow.WorkflowPathNavPanel.superclass.constructor.call(this, {
            title: '工作流列表'.loc(),
            region: 'west',
            split: true,
            width: 260,
            collapsible: true,
            cmargins:'3 3 3 3',
			tbar:this.buttonArray
    });
};
Ext.extend(bin.workflow.WorkflowPathNavPanel, Ext.Panel, {
	init: function(){
		this.menuTree.finish(this.body.dom,document);
		this.focusHistoryNode();
	},
	getTree : function(){
		return this.menuTree;
	},
	exeHistoryNode : function(menuTree,nowNode){
		if(nowNode.prop.event&&nowNode.prop.params){
			this.clickEvent(nowNode);
		}else if(nowNode.prop._parent=='top'&&nowNode.index()==nowNode.parent.son.length -1){
			this.clickEvent(nowNode);
		}else{
			menuTree.moveNext();
			var newNode=menuTree.getNowNode();
			this.exeHistoryNode(menuTree,newNode)
		}
	},
	focusHistoryNode: function (){
		uStore=new UserStore(tree_store);
		if(uStore.getAttribute("workflowPath")){
			this.menuTree.loadHistory("workflowPath");
			var nowNode=this.menuTree.getNowNode();
		}else{
			var nowNode=this.menuTree.getNowNode();
			this.menuTree.loadHistory("workflowPath");
		};
		this.exeHistoryNode(this.menuTree,nowNode);
	}
});

