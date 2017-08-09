/*
 * @author tz 设置数据条件的Panel
 */
bin.exe.AuthPanel = Ext.extend(Ext.Panel, {
	layout : 'border',
	region : 'center',
	border : false,
	initComponent : function() {
		this.authType=authType='';
		this.menuBar = new bin.exe.AuthMenuField({
					width : 100,
					menu : {
						width : 100,
						items : []
					}
		});

		this.menuBar.menuClick = function(item) {
			this.menuBar.menu.hide();
			if (item.ctrl_id != this.menuBar.getCtrlId()) {
				this.menuBar.setValue(item);
				item.setChecked(true);
				this.authType = item.ctrl_id;
				this.loadServerData();
			}
		}.createDelegate(this);

		this.loadServerData=function(){
				this.tree.root.collapse();
				this.tree.loader.baseParams.authType=this.authType;
				this.tree.root.expand();
				this.authGrid.getStore().load({
					params : {
						objectId : this.param.objectId,
						dataId : this.param.dataId,
						authType:this.authType
					}
				});
		}.createDelegate(this);

		this.tbar = [' ',this.menuBar,' ', '-', ' ',{
					text : '返回'.loc(),
					icon : '/themes/icon/common/redo.gif',
					handler : this.param.retFn
				},{
					text : '保存'.loc(),
					icon : '/themes/icon/xp/save.gif',
					handler : function() {
						this.save(this.param);
					}
				}, {
					text : '删除'.loc(),
					icon : '/themes/icon/all/basket_back.gif',
					handler : function() {
						var grid = this.authGrid;
						var arr = grid.getSelectionModel().getSelections();
						if (arr == '')
							return;
						for (var i = 0; i < arr.length; i++)
							this.grid2tree(grid, arr[i], this.tree);
					}
				}, {
					text : '增加'.loc(),
					icon : '/themes/icon/all/basket_go.gif',
					handler : function() {
						var node = this.tree.getSelectionModel().getSelectedNode();
						if (node == null)
							return;
						this.tree2grid(node, this.authGrid);
					}
				}];
		Ext.each(this.tbar, function(item) {
					item.scope = this;
					item.xtype = 'tbbutton';
					item.cls = 'x-btn-text-icon  bmenu';
				}, this);

		this.ds=new Ext.data.JsonStore({
					method: 'GET',
					url : '/bin/exe/getAuth.jcp',
					root : 'authArray',
					fields : ["user_id", "user_name", "dept_id","dept_name"],
					remoteSort : false
		});


		var ids=new Array();
		if(this.AuthPanel&&this.AuthPanel.ds)
			this.AuthPanel.ds.each(function(rec){ids.push(rec.get("user_id"));});
	
		this.tree = new Ext.tree.TreePanel({
					region : 'center',
					animate : true,
					autoScroll : true,
					scope:this,
					loader : new Ext.tree.TreeLoader({
								dataUrl : '/bin/exe/roletree.jcp',
								requestMethod : "POST",
								baseParams : {
									objectId : this.param.objectId,
									dataId : this.param.dataId,
									ids:ids,
									authType:authType
								}
					}),
					enableDrag : true,
					root : new Ext.tree.AsyncTreeNode({
								text:this.param.rootName, 
								draggable:false, 
								id:this.param.rootId,
								icon : "/themes/icon/all/chart_organisation.gif"
					}),
					ddGroup : "tree2grid",
					containerScroll : true
		});

		new Ext.tree.TreeSorter(this.tree, {
					folderSort : true
		});
		this.tree.on("render", function() {
			var ddrow = new Ext.dd.DropTarget(this.tree.getEl(), {
						ddGroup : 'grid2tree',
						notifyDrop : function(dd, e, data) {
							this.grid2tree(data.grid, data.rowIndex, this.tree);
						}.createDelegate(this)
					});
		}, this);

		this.authGrid = new Ext.grid.GridPanel({
					region : 'east',
					collapsible : false,
					split : true,
					width : 400,
					title : '赋权人员列表'.loc(),
					border : true,
					store : this.ds,
					ddGroup : 'grid2tree',
					autoExpandColumn : 'user_name',
					columns : [{
								header : '部门'.loc(),
								width : 120,
								sortable : false,
								dataIndex : 'dept_name'
							}, {
								id : 'user_name',
								header : '人员'.loc(),
								sortable : false,
								dataIndex : 'user_name'
							}],
					enableDragDrop : true
		});
		this.authGrid.on("render", function() {
					var grid = this.authGrid;
					var drops = new Ext.dd.DropTarget(grid.getEl(), {
								ddGroup : 'tree2grid',
								notifyDrop : function(dd, e, data) {
									this.tree2grid(data.node, grid);
									return true;
								}.createDelegate(this)
							});
					grid.getSelectionModel().on("beforerowselect",
							function(obj, r, k, record) {
								grid.ddText = record.get("dept_name") + ":"
										+ record.get("user_name");
								return true;
							})
				}, this);
		this.items = [this.tree, this.authGrid];
		bin.exe.AuthPanel.superclass.initComponent.call(this);
	},
	afterRender : function(){
		bin.exe.AuthPanel.superclass.afterRender.call(this);
		Ext.Ajax.request({
			url : '/bin/exe/roletree.jcp',
			method : 'GET',
			params : {},
			scope : this,  
			success : function(response, options) {
				var o = Ext.decode(response.responseText);  
				if (o.authTypes&&o.authTypes.length>0) {
					for (var i = 0; i < o.authTypes.length; i++) {
						this.menuBar.menu.add(
						Ext.apply(o.authTypes[i],{
							handler :this.menuBar.menuClick,
							group : 'tz' + this.id,
							checked : (i == 0)
						}));
					}
					this.authType=o.authTypes[0].ctrl_id;
					this.menuBar.setValue(o.authTypes[0]);
				}
				this.tree.loader.baseParams.authType=this.authType;
				this.tree.root.expand();
				this.authGrid.getStore().load({
					params : {
						objectId : this.param.objectId,
						dataId : this.param.dataId,
						authType:this.authType
					}
				});
			},
			failure : function(response, options) {
				var o = Ext.decode(response.responseText);
				Ext.msg("error", '在字典中没有定义数据权限:'.loc()+'<br>' + o.message);
			}
		});
	},
	grid2tree : function(grid, rec, tree) {
		var store = grid.getStore();
		if (typeof(rec) == 'number')
			rec = store.getAt(rec);
		var node = tree.getNodeById(rec.get("dept_id"));
		if(node){
			if (!node.isExpanded()) {
				node.expand(false, false);
				node.select();
			}
			node.appendChild(new Ext.tree.TreeNode({
						allowDrag : true,
						allowDrop : false,
						leaf : true,
						id : rec.get("user_id"),
						text : rec.get("user_name"),
						icon : '/themes/icon/xp/dept.gif'
			}));
		}
		store.remove(rec);
	},
	tree2grid : function(node, grid) {
		var pnode = node.parentNode;
		var temlateRecord = Ext.data.Record.create([{
					name : "dept_id"
				}, {
					name : "user_id"
				}, {
					name : "dept_name"
				}, {
					name : "user_name"
				}]);
		grid.getStore().add(new temlateRecord({
					dept_id : pnode.id,
					dept_name : pnode.text,
					user_id : node.id,
					user_name : node.text
				}));
		node.remove();
	},
	save : function(params) {
		var ids = new Array();
		this.authGrid.getStore().each(function(rec) {  
					ids.push(rec.get("user_id"));
				});
		var params=Ext.apply({
			ids : ids,
			auth:this.authType
		},this.param);
		Ext.Ajax.request({
					url : '/bin/exe/AuthPanel.jcp',
					params :params,
					method : 'post',
					scope : this,
					success : function(response, options) {
						var check = response.responseText;
						var ajaxResult = Ext.util.JSON.decode(check)
						if (ajaxResult.success) {
							Ext.msg("info", '完成权限更新.'.loc());
						} else {
							Ext.msg("error", '数据删除失败!,原因:'.loc()+'<br>'	+ ajaxResult.message);
						}
					}
				});
	}
});
bin.exe.AuthMenuField = Ext.extend(Ext.form.TriggerField, {
	emptyText : '选择权限组'.loc(),
	loadMenu : function(arr) {
		this.menu.removeAll();
		if (arr.length > 0) {
			for (var i = 0; i < arr.length; i++) {
				this.menu.add(Ext.apply(arr[i], {
							handler : this.menuClick,
							group : 'tz' + this.id,
							checked : (i == 0)
						}));
			}
			this.setValue(arr[0]);
		}
	},
	reset : function() {
		this.menu.removeAll();
		this.setValue(this.defaultValue);
	},
	defaultValue : {
		text : '选择权限组'.loc(),
		ctrl_id : -1
	},
	onRender : function(ct, position) {
		bin.exe.AuthMenuField.superclass.onRender.call(this, ct,position);
		this.menu = Ext.menu.MenuMgr.get(this.menu);
		this.el.on('mousedown', this.onTriggerClick, this);
	},
	setValue : function(value) {
		if (typeof(value) != 'object') {
			value = this.defaultValue;
		}
		Ext.form.TriggerField.superclass.setValue
				.call(this, value.text);
		this.value = value;
	},
	getValue : function() {
		return this.value;
	},
	getText:function(){
		return this.el.dom.value;
	},
	getCtrlId : function() {
		return this.value.ctrl_id;
	},
	getSize : function() {
		if (this.menu && this.menu.items)
			return this.menu.items.getCount()
		else
			return 0;
	},
	onBeforeTriggerClick : function() {
		return this.value != this.defaultValue;
	},
	onTriggerClick : function() {
		if (this.onBeforeTriggerClick(this) === false)
			return;
		if (this.menu.isVisible()) {
			this.menu.hide();
		} else {
			this.menu.show(this.wrap, "tr-br?");
		}
	}
});