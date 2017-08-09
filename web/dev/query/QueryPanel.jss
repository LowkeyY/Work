Ext.namespace("dev.query");

dev.query.QueryPanel = function(frames){
	
	this.frames = frames;
	var Query = this.frames.get("Query");
	Columns = function(){
		this.list = new Array();
		this.now_index = -1;
	};

	_p = Columns.prototype;

	Columns.Node = function(name,point,_parent){
		this.name = name;
		this.point = point;
		this._parent = _parent;
	};

	_p.add = function(name,point,_parent){
		this.list.push(new Columns.Node(name,point,_parent));
		this.refresh();
	};

	_p.clear = function(){
		this.list = new Array();
		this.now_index = -1;
		this.refresh();
	}

	_p.removeBy = function(_parent){
		var list = this.list;
		this.now_index = -1;
		for(var i=0;i<list.length;i++){
			if(list[i]._parent==_parent){
				list.splice(i,1);
				i--;
			}
		}
		this.refresh();
	}
	_p.isExist = function(propName,value){	//判断propName属性的value值存不存在
		var list = this.list;
		for(var i=0;i<list.length;i++){
			if(list[i][propName]==value)
				return true;
		}
		return false;
	}
	_p.command = function(name){
		var i = this.now_index ;
		if(i < 0)
			return;
		var list = this.list;
		switch(name){
			case 0 : // 删除  
				list.splice(i,1);
				if(list.length == 0)
					this.now_index = -1;
				else if(i == list.length)
					this.now_index--;
				break;
			case 1 : // 上移
				if(i==0)
					return;
				this.reset(list[this.now_index].tr)
				this.now_index--;
				var t = list[i-1];
				list[i-1] = list[i];
				list[i] = t;
				break;
			case 2: // 下移
				if(i >= list.length -1)
					return;
				this.reset(list[this.now_index].tr)
				this.now_index++;
				var t = list[i];
				list[i] = list[i+1];
				list[i+1] = t;
				break;
		}
		this.refresh();
	}
	_p.refresh = function(){
		var list = this.list;
		var html = ['<table cellspacing="0" cellpadding="0" width="100%" class=views><tr  class=title><td height=21 width=150>'+'名称'.loc()+'</td><td>'+'引用'.loc()+'</td><td width=15>'+'行'.loc()+'</td></tr>'];
		for(var i =0;i<list.length;i++){
			html.push('<tr ><td height=21><input readonly value="',list[i].name,'"></td><td><textarea readonly style="overflow-y:hidden;height:20px;" onpropertychange="this.style.posHeight=this.scrollHeight" onfocus="this.style.posHeight=this.scrollHeight">',list[i].point,'</textarea></td><td>',(i+1),'</td></tr>');
		}
		html.push('</table>');
		column_table.innerHTML = html.toString();
		var trs = column_table.childNodes[0].childNodes[0];
		for(var i=0;i<list.length;i++){
			var tr = trs.childNodes[i+1];
			list[i].tr = tr;
			tr._instance = this;
			tr.index = i;
			tr.onmousedown = trDown;
			tr.onclick = trClick;
		}
		this.focus(this.now_index,true);
	}

	_p.focus = function(i,over){
		if(this.now_index == i && !over)
			return;
		if(this.now_index != -1){
			this.list[this.now_index].tr.className = "";
			this.blur(this.now_index);
		}
		this.now_index = i;
		if(i <0)
			return;
		var node = this.list[this.now_index];
		var tr = node.tr;
		tr.className = "selected";
		tr.Virgin = true;
		if(i == 0)
			Move2Top.disabled = true;
		else
			Move2Top.disabled = false;
		if(i == this.list.length -1)
			Move2Down.disabled = true;
		else
			Move2Down.disabled = false;		
	}

	_p.blur = function(i){
		this.list[i].tr.Virgin = false;
		this.reset(this.list[i].tr);
	}

	_p.reset = function(tr){
		var name = tr.childNodes[0].childNodes[0];
		var point = tr.childNodes[1].childNodes[0];
		var o = this.list[tr.index];
		o.name = name.value;
		o.point = point.value;
		name.className = point.className = "";
		name.readOnly = point.readOnly = true;
	}

	_p.getXML = function(){
		var list = this.list;
		var tmp = new Object();
		var xml = ['<columns>'];

		for(var i=0;i<list.length;i++){
			var o = list[i];
			var name = o.name;
			var point = o.point.EncodeHTML();
			if(tmp[name]||name.trim()==''||point.trim()==''){
				    Ext.msg("error",'<br><br>'+'请参考以下规则'.loc()+':<br>1.'+'自定义名称必须全部填写'.loc()+'.<br>2.'+'自定义名称不能重复'.loc()+'.<br>3.'+'引用不能为空'.loc()+'.<br>'+'行数'.loc()+'= '+(i+1));
				return null;
			}else
				tmp[name] = true;

			xml.push('<c name="',name,'" point="',point,'" parent="',o._parent,'"/>');
		}
		xml.push("</columns>");
		return xml.toString();
	}

	_p.loadXML = function(xml){
		var columns = xml.childNodes;
		for(var i=0;i<columns.length;i++){
			var c = columns.item(i);
			this.list.push(new Columns.Node(c.getAttribute('name'),c.getAttribute('point'),c.getAttribute('parent')));
		}
		this.refresh();
	}


	trDown = function(){this._instance.focus(this.index); }

	trClick = function(){
		if(this.Virgin){
			this.Virgin=false;
			return;
		}
		var o = event.srcElement?event.srcElement : event.target;
		if(o.tagName=="INPUT"||o.tagName=="TEXTAREA"){
			if(o.readOnly == false)
				return;
			this._instance.reset(this);
			o.readOnly = false;
			o.className = "edit";
			o.select();
		}
	}

	COLM = new Columns();
	//===============================================//
	/////////////////////////////////////////////////////////////////////////////////////

	ResourceTable = function(){
		this.list = new Array();
		this.index = 0;
	};
	_p = ResourceTable.prototype;

	_p.add = function(table){
		var o = this.clone(table);
		this.list.push(o);
		selectTable.add(o);
		this.show();
	}

	_p.clear = function(){
		this.list = new Array();
		this.index = 0;
		source_table.innerHTML ='';
		PropPanel.removeAll();
		PropPanel.hide();
		NavPanel.doLayout();
	}

	_p.clone = function(o){
		var obj = new Object();
		obj.tableName = o.tableName;
		obj.isSys = o.isSys;
		obj.rename = o.rename;
		obj.query_id = o.query_id;
		obj.level = o.level;
		obj.server = o.server;
		if(o.columns){
			obj.columns = new Array();
			for(var i=0;i<o.columns.length;i++)
				obj.columns[i] = o.columns[i];
		}
		if(o.params){
			obj.params = new Array();
			for(var i=0;i<o.params.length;i++)
				obj.params[i] = o.params[i];
		}
		return obj;
	}
	_p.removeBy = function(rename){
		var list = this.list;
		for(var i=0;i<list.length;i++){
			if(list[i].rename == rename){
				list.splice(i,1);
				return true;
			}
		}
		return false;
	}

	_p.display = function(rename,start,cmd){
		
		var trs = source_table.childNodes[0].rows;
		var row_title = trs[start];
		if(cmd==''){
			row_title.cells[0].style.cssText="";
			row_title.cells[1].style.cssText="border-left:1px solid #98BFF3;";	
		}else{
			row_title.cells[0].style.cssText="border-bottom:1px solid #98BFF3;";
			row_title.cells[1].style.cssText="border-bottom:1px solid #98BFF3;border-left:1px solid #98BFF3;";
		}
		for(var i=start+1;i<trs.length;i++){
			var row = trs[i];
			if(row.tagName=='TR'){
				if(row.getAttribute('_parent')==rename)
					row.style.display=cmd;
				else
					return;
			}
		}
	}

	_p.isExist = function(query_id,query_name){
		var list = this.list;
		for(var i=0;i<list.length;i++){
			var o = list[i];
			if(o.query_id == query_id && o.tableName==query_name)
				return true;
		}
		return false;
	}

	_p.length = function(){
		var list = this.list;
		var maxIndex=list.length;
		for(var i=0;i<list.length;i++){
			var o = list[i];
			if (maxIndex<=parseInt(o.rename.substring(3)))
				 maxIndex=parseInt(o.rename.substring(3))+1;
		}
		return maxIndex;
	}

	_p.sameServer = function(server){
		var list = this.list;
		if(list.length>0){
			for(var i=0;i<list.length;i++){
				var o = list[i];
				if(o.server!= server)
					return true;
			}
			return false;
		}else{
			return true;
		}
	}
	_p.getByRename = function(rename){
		var list = this.list;
		for(var i=0;i<list.length;i++){
			if(list[i].rename == rename)	
				return list[i];	
		}
		return null;
	}

	_p.get = function(i){ return this.list[i];}

	_p.show = function(){
		var table = source_table.childNodes[0];
		if(!table){
			this.refresh();
			return;
		}
		var t = this.list[this.list.length-1];
		var name = t.tableName;
		var isSys = t.isSys;
		var rename = t.rename;
		var query_id = t.query_id;
		var server = t.server;
		var img; 
		if(isSys){
				img = getImg("menutree/table");
		}else{
			name = '['+name+']';
				img = getImg("menutree/query")
		}

		str = ['<tr bgColor=#D0E1F9  _id="',rename,'" query_id="',query_id,'" onclick="resourceTRClick(this);"  oncontextmenu="contextmenu(this)"><td colspan=2 width=85%>&nbsp;<img align=absmiddle src="',img,'" class=icon>&nbsp;',name,'</td><td style="border-left:1px solid #98BFF3;" width=15%>&nbsp;',rename,'</td></tr>'];
		var cols = t.columns;
		for(var j=0;j<cols.length;j++){
			var colName = isSys? rename+'.'+cols[j] : '['+rename+'.'+cols[j]+']';
			str.push('<tr height=21 _parent="',rename,'" ondblclick="resourceTRDblclick(this)" onclick="resourceTRClick(this)" onmouseover="TROver(this)" onmouseout="TROut(this)"><td   align=right>&nbsp;&nbsp;<img align=absmiddle src="',getImg("menutree/column"),'"></td><td>',colName,'</td><td> </td></tr>');
		}
		var tmp = source_table.innerHTML;
		source_table.innerHTML = tmp.substring(0,tmp.length-16)+str+'</TBODY></TABLE>';
	}

	_p.refresh = function(){
		var str = ['<table width=100% border=0 cellpadding cellspacing style="cursor:default;border-collapse:collapse;">'];
		for(var i=0;i<this.list.length;i++){
			var t = this.list[i];
			var name = t.tableName;
			var isSys = t.isSys;
			var rename = t.rename;
			var query_id = t.query_id;
			var server = t.server;
			var img; 
			if(isSys){
				img = getImg("menutree/table");
			}else{
				name = '['+name+']';
				img = getImg("menutree/query");
			}
			str.push('<tr bgColor=#D0E1F9 height=21 _id="',rename,'" query_id="',query_id,'" onclick="resourceTRClick(this)" oncontextmenu="contextmenu(this)"><td colspan=2 width=85%>&nbsp;<img align=absmiddle src="',img,'" class=icon>&nbsp;',name,'</td><td style="border-left:1px solid #98BFF3;" width=15%>&nbsp;',rename,'</td></tr>');
			var cols = t.columns;
			for(var j=0;j<cols.length;j++){
				var colName = isSys? rename+'.'+cols[j] : '['+rename+'.'+cols[j]+']';
				str.push('<tr height=21 _parent="',rename,'" ondblclick="resourceTRDblclick(this)" onclick="resourceTRClick(this)" onmouseover="TROver(this)" onmouseout="TROut(this)"><td  align=right>&nbsp;&nbsp;<img align=absmiddle src="',getImg("menutree/column"),'">　</td><td>',colName,'</td><td> </td></tr>');
			}
		}
		str.push('</table>');
		source_table.innerHTML = str.toString();
	}
	_p.getXML = function(){
		var list = this.list;
		var xml = ['<import>'];
		var where = check.value;
		var arr = [];
		for(var i=0;i<list.length;i++){
			var o = list[i];
			if(where.indexOf(o.rename)==-1 && !COLM.isExist("_parent",o.rename))
				arr.push(o.tableName+'  '+o.rename);
			var tabName = o.tableName;
			if(!o.isSys)
				tabName='['+o.query_id+']';

			xml.push('<query name="',tabName,'" rename="',o.rename,'" query_id="',o.query_id,'"  server="',o.server,'"  level="',o.level,'" isSys="',o.isSys?1:0,'">');
			xml.push('<column>');
			for(var j=0;j<o.columns.length;j++){
				xml.push('<c name="',o.columns[j],'"/>');
			}
			xml.push('</column>');

			if(o.params){
				xml.push('<param>');
				for(var j=0;j<o.params.length;j++){
					var param = o.params[j];
					var notnull = param[2];
					if(notnull=='1'&&param[1].trim()==''){
						Ext.msg("error",'资源表:'.loc()+o.tableName+'的参数'.loc()+' "'+param[0]+'"'+'值不允许为空!'.loc());
						return null;
					}
					if(param[1].trim()=='')
						continue;
					xml.push('<c name="',param[0],'" value="',param[1],'" notnull="',notnull,'"/>');
				}
				xml.push('</param>');
			}else
				xml.push('<param/>');
			xml.push('</query>');
		}
		xml.push('</import>');
		if(arr.length>0){
			    Ext.msg("error",'<br><br>'+'请参考以下规则'.loc()+':<br>1.'+'引用资源表字段'.loc()+'.<br>2.'+'或在关联条件中关联'.loc()+'.<br>'+'资源表'.loc()+':'+'<br>'+arr.join("<br>"));
			return null;
		}
		return xml.toString();
	}
	_p.loadXML = function(tables){
		for(var i=0;i<tables.length;i++){
			var o = new Object();
			var table = tables.item(i);
			o.tableName = table.getAttribute('name');
			o.rename = table.getAttribute('rename');
			o.isSys = table.getAttribute('isSys')=='1'?true:false;
			o.query_id = table.getAttribute('query_id');
			o.server = table.getAttribute('server');
			o.level = table.getAttribute('level');
			var column = table.selectSingleNode('column').childNodes;
			o.columns = new Array();
			for(var j=0;j<column.length;j++){
				var c = column.item(j);
				o.columns[j] = c.getAttribute('name');
			}
			var param = table.selectSingleNode('param').childNodes;
			o.params = new Array();
			for(var j=0;j<param.length;j++){
				var c = param.item(j);
				o.params[j] = [c.getAttribute('name'),c.getAttribute('value'),c.getAttribute('notnull')] ;
			}
			this.list.push(o);
			selectTable.list.push(o);
		}
		selectTable.refresh();
		this.refresh();
	}

	resourceTRClick = function(tr){
		var rename = tr.getAttribute("_id") ? tr.getAttribute("_id"):tr.getAttribute("_parent");
		var o = rt.getByRename(rename);
		if(o.params && o.params.length>0){
			PropPanel.show();
			if(PropPanel._id == rename)
				return;
			for(var i=0;i<o.params.length;i++){
				var name = o.params[i][0];
				var paramLabel=rename+'.'+name;
				var blank=(o.params[i][2]!=1);
				PropPanel.add(
					new Ext.form.TextField({
						fieldLabel: paramLabel,
						name: 'param_'+rename+'_'+i,							
						width: 80,
						resourceTable:o,
						allowBlank:blank,
						blankText:'参数必须提供.'.loc(),  
						value:o.params[i][1],
						listeners : {
							change:function(e,newValue,oldValue){
								var tempParams = new Array();
								if(newValue.indexOf('${')!=-1||newValue.indexOf('}')!=-1){
									Ext.msg("error",'引用参数不能包含'.loc()+'${'+'和'.loc()+'}'+'字符!'.loc());
									this.setValue(oldValue);
									return;
								}
								if(!e.allowBlank&&newValue==''){
									this.setValue(oldValue);
								};
								for(var j=0;j<e.resourceTable.params.length;j++){
									tempParams[j] = [e.resourceTable.params[j][0],newValue,1] ;
								}
								e.resourceTable.params=tempParams;
							}
						}
				}));
			}
			PropPanel._id = rename;
			this.NavPanel.doLayout();
		}else{
			PropPanel.hide();
			this.NavPanel.doLayout();
			return;
		}
	}.createDelegate(this);

	resourceTRDblclick = function(tr){
		var o = rt.getByRename(tr.getAttribute("_parent"));
		var cell = tr.childNodes;
		var point = npoint = cell[1].innerHTML.replace(/<.+?>/gim,'');
		if(COLM.isExist("point",point)){
					Ext.Msg.prompt('列重复'.loc(), '已经存在引用列,请在下面输入不同的引用表达式'.loc()+'!<br>'+'例'.loc()+':case when ['+'列'.loc()+']=['+'条件'.loc()+'] then ['+'值'.loc()+'1] else ['+'值'.loc()+'2] end:', function(btn, text){
						if (btn == 'ok'){
								 npoint =text;
									if(!npoint)
										return;		
								  if(point==npoint){
											Ext.msg('error', '输入列不能与原列名相同.'.loc());
									}else{
										var colName="";
										if(!o.isSys)
											colName = npoint.substring(npoint.indexOf(".")+1,npoint.length-1);
										else
											colName = npoint.substr(npoint.indexOf(".")+1);
										COLM.add(colName,npoint,o.rename);
									}
						}else{
							return;
						}
				 },this,true);
		}else{
			var colName="";
			if(!o.isSys)
				colName = npoint.substring(npoint.indexOf(".")+1,npoint.length-1);
			else
				colName = npoint.substr(npoint.indexOf(".")+1);
			COLM.add(colName,npoint,o.rename); 	
		}
	}

	TROver = function(tr){tr.className="tr_over";}
	TROut = function(tr){tr.className="";}
	var rt = new ResourceTable();
	//==========================================================================================
	SelectTable = function(){
		this.list = new Array();
	};
	_p = SelectTable.prototype;

	_p.add = function(table){
			this.list.push(table);
			this.refresh();
	}

	_p.clear = function(table){
		var list = this.list;
		this.list = new Array();
/*
		for(var i=0;i<list.length;i++){
				list.splice(i,1);
		}
		*/
	}

	_p.isExist = function(rename){
		var size = this.list.length;
		for(var i=0;i<size;i++){
			if(this.list[i].rename == rename){
				return true;
			}
		}
		return false;
	}

	_p.removeByRename = function(rename){
		var size = this.list.length;
		for(var i=0;i<size;i++){
			if(this.list[i].rename == rename){
				this.list.splice(i,1);
				this.refresh();
				return;
			}
		}
	}

	_p.refresh = function(){
		var size = this.list.length;
		t1.innerHTML="";
		t2.innerHTML="";
		for(var i=0;i<size;i++){
			var o = this.list[i];
			var m = document.createElement('option');
			m.style.background='#E8E8E8';
			var n = document.createElement('option');
			n.style.background='#E8E8E8';
			var isSys = o.isSys;
			m.text = n.text = isSys?o.tableName:"["+o.tableName+"]";
			m.text = n.text = m.text+" AS "+o.rename;
			t1.options.add(m);
			t2.options.add(n);
			for(var j=0;j<o.columns.length;j++){
				var c = o.columns[j];
				var m = document.createElement('option');
				var n = document.createElement('option');
				var text = o.rename+"."+c;
				var value = o.rename+"."+c;
				if(!isSys){
					text = "["+text+"]";
					value = "["+value+"]";
				}
				m.text = n.text = "  "+text;
				m.value = n.value = value;
				t1.options.add(m);
				t2.options.add(n);
			}
		}
	}

	btClick = function(cmd){
		var str = "";
		var tt1 = t1.value;
		var tt2 = t2.value;

		var joint="";
		if(cmd==0)
			joint="and";
		else if(cmd==1)
			joint="or";

		switch(cmd){
			case 0:	
			case 1:
				if(tt1.indexOf("AS tab")==-1 && tt2.indexOf("AS  tab")==-1 &&(tt1.substring(0,tt1.lastIndexOf('.')) != tt2.substring(0,tt2.lastIndexOf('.')))){
					var values = tt1+"="+tt2;
					if(check.value.indexOf(values) == -1){
						if(check.value && check.value.length >5)
							str = "  \n" + joint + " \n";
						check.value+= str + values;
					}
				}else if(tt1.indexOf("AS tab")==-1 && tt2.indexOf("AS tab")!==-1){
					if(check.value && check.value.length >5)
						str = " \n" + joint + " \n";
					check.value+= str + tt1 +"=''";
				}
				break;
			case 2:	
				if(tt1.indexOf("AS tab")==-1){
					using("dev.query.SetParam");
					var width = 603;
					var height = 240;
					var setParam =new dev.query.SetParam(tt1,width,height); 
					setParam.show();
				}   
				break;
		}
	}

	var selectTable = new SelectTable();
	//==========================================================================
	function paramToXML(arr){
		var xml = ['<param>'];
		for(var i=0;i<arr.length;i++){
			var str = arr[i];
			var param = str.split("|");
			var name = param[0];
			var perfix = param[1];
			var suffix = param[2];
			var utype = param[3];
			var defaultvalue = param[4];
			var value = param[5];
			var notnull = 0;

			if(param.length==3){
				utype = param[1];    
				defaultvalue= param[2]; 
				perfix = '';
				suffix = '';
			}else if (param.length<3){
				utype = param[1];    
				defaultvalue = ''; 
				perfix = '';
				suffix = '';
			}
			if(perfix.trim()=='' && suffix.trim()=='')
				notnull = 1;

			xml.push('<c name="',name,'" perfix="',perfix,'" suffix="',suffix,'" utype="',utype,'" notnull="',notnull,'" value ="',value,'" default ="',defaultvalue,'"/>');
		}
		xml.push('</param>');
		return xml.toString();
	}

	function getKeys(str){
		var arr = new Array();
		var len = str.length;
		for(var i=0;i<len;){
			while(i<len && str.charAt(i)!='$')
				i++;
			if(i>=len)
				break;
			if(str.charAt(++i)=='{'){
				var offset = ++i;
				var max = 0;
				while(i<len && str.charAt(i)!='}'){
					max++;
					i++;
				}
				if(i>=len)
					break;
				arr.push(str.substr(offset,max));
			}
			i++;
		}
		return arr;
	}

	function replaceKeys(arr,where){
		for(var i=0;i<arr.length;i++){
			var str = arr[i];
			where = where.replace("${"+str+"}","${"+str.substr(0,str.indexOf("|"))+"}")
		}
		return where;
	}
		
	var selectedTR;

	quaryCommand=function(num){
		COLM.command(num);
	}

	this.init=function(){	
		var nDelete,nPreview,nGroupOn,nGroupOff,nAddCol;

		var sourceTableContextMenu = new Ext.menu.Menu({id:'queryContext'});

		sourceTableContextMenu.add(
		nDelete=new Ext.menu.Item({
				menuId:'nDelete',
				text: '删除'.loc(), 
				cls: 'x-btn-icon bmenu',
				icon: '/themes/icon/xp/delete.gif',
				handler:  this.sourceTableContext}),

		  nAddAll=new Ext.menu.Item({
				menuId:'nAddAll',
				text: '添加全部'.loc(), 
				cls: 'x-btn-icon bmenu',
				icon: '/themes/icon/all/add.gif',
				handler:  this.sourceTableContext}),

		  nCross=new Ext.menu.Item({
				menuId:'nCross',
				text: '交叉引用'.loc(), 
				cls: 'x-btn-icon bmenu',
				icon: '/themes/icon/all/arrow_switch.gif',
				handler:  this.sourceTableContext}),

		  nHide=new Ext.menu.Item({
				menuId:'nPreview',
				text: '预览'.loc(), 
				cls: 'x-btn-icon bmenu',
				icon: '/themes/icon/xp/preview.gif',
				handler:  this.sourceTableContext}),
		 
		 nDisplay=new Ext.menu.Item({
				menuId:'nDisplay',
				text: '显示'.loc(), 
				cls: 'x-btn-icon bmenu',
				icon: '/themes/icon/xp/spread.gif',
				handler:  this.sourceTableContext}),

		  nPreview=new Ext.menu.Item({
				menuId:'nHide',
				text: '隐藏'.loc(), 
				cls: 'x-btn-icon bmenu',
				icon: '/themes/icon/xp/hidden.gif',
				handler:  this.sourceTableContext})
		);
		contextmenu = function(){
			var tr =event.srcElement?event.srcElement : event.target;
			while(tr.tagName!="TR") tr = tr.parentNode;
			Ext.get(tr).on({'contextmenu' : function(e){
				selectedTR=tr;
				sourceTableContextMenu.showAt(e.getXY());
			},
			scope: this
			});
		};
		document.oncontextmenu = function(){return false;}
    };
	this.sourceTableContext=function(item){	
		if(item.menuId=='nDelete'){
			var rename = selectedTR.getAttribute("_id");
			 Ext.msg('confirm', '确定删除资源表中的引用:'.loc()+selectedTR.getAttribute("_id")+'?', function (answer){
                   if (answer == 'yes') {
						rt.removeBy(rename);
						var tr = selectedTR;
						var start = tr.rowIndex;
						var end;
						while(tr&&(tr.getAttribute("_parent")==rename || tr.getAttribute("_id")==rename)){
							end = tr.rowIndex;
							tr= tr.nextSibling;
						}
						var table = source_table.childNodes[0];
						for(var i=start;i<=end;i++)
							table.deleteRow(start);

						COLM.removeBy(rename);
						selectTable.removeByRename(rename);
						selectTable.refresh();
						PropPanel.hide();
						NavPanel.doLayout();
				  } 
             }.createDelegate(this));
		}else if(item.menuId=='nAddAll'){
			var rename = selectedTR.getAttribute("_id");
			var o = rt.getByRename(rename);
			var isSys = o.isSys;
			for(var i=0;i<o.columns.length;i++){
				var column = o.columns[i];
				var name = column;
				var point = rename+'.'+name;
				if(!isSys) point = '['+point+']';
				if(COLM.isExist('point',point))
					continue;
				COLM.list.push(new Columns.Node(name,point,rename));
			}
			COLM.refresh();
		}else if(item.menuId=='nDisplay'){
			rt.display(selectedTR.getAttribute("_id"),selectedTR.rowIndex,'');
		}else if(item.menuId=='nHide'){
			rt.display(selectedTR.getAttribute("_id"),selectedTR.rowIndex,'none');
		}else if(item.menuId=='nPreview'){
			using("dev.query.DataPreview");
			using("dev.query.ParamsWindow");
			var rename = selectedTR.getAttribute("_id");
			var o = rt.getByRename(rename);
			var url = 'query_name='+o.tableName+'&query_id='+o.query_id+'&server='+o.server;
			var paramString='';
			var paramValue='';
			if(o.params){
				for(var i=0;i<o.params.length;i++){
					var param = o.params[i];
					if(param[1].trim()=='')
						continue;
					paramString+='::'+param[0];
					paramValue+='&field'+i+'='+param[1];
				}
			}
			url+='&param='+paramString.substring(2)+paramValue;
			columArray=[];
			dataArray=[];
			for(var j=0;j<o.columns.length;j++){
				dataArray.push({name: o.columns[j]});
				columArray.push({header:o.columns[j], dataIndex: o.columns[j], sortable: true, align: 'right'});
			}
		
			Query.queryDataWindow =new dev.query.DataPreview('',encodeURI(url),columArray,dataArray);
			Query.queryDataWindow.show();
		}else if(item.menuId=='nCross'){
			var rename = selectedTR.getAttribute("_id");
			loadcss("lib.multiselect.Multiselect");
			using("lib.multiselect.Multiselect");
			loadcss("lib.Wizard.wizard");
			using("lib.Wizard.Wiz");
			using("dev.query.CrossWizard");
			var crossWizard = new dev.query.CrossWizard(rt,rename,COLM,check);
			crossWizard.show();
		}
    };
	this.newQuery= function(params){	
		this.params=params;
		this.params['method']='query';
		check.value="";
		COLM.clear();
		rt.clear();
		t1.innerHTML="";
		t2.innerHTML="";
		selectTable.clear();
		this.hideToolBar();
		if(this.MainTabPanel.rendered){
			this.frames.get("Query").mainPanel.setStatusValue(["",params.parent_id]);
		}
    };
	this.loadData=function(params){	
		var option = null;
		this.params=params;
		option =Tool.getXML("/dev/query/OpenQuery.jcp?query_id="+this.params['query_id']);
		if(!option)
			return;
		check.value="";
		COLM.clear();
		rt.clear();
		t1.innerHTML="";
		t2.innerHTML="";
		selectTable.clear();
		COLM.loadXML(option.selectSingleNode("columns"));
		rt.loadXML(option.selectSingleNode("import").childNodes,selectTable);
		check.value = option.getAttribute("where");
		check.focus();
		this.showToolBar();
		var lastModifyTime=option.getAttribute("lastModifyTime");
		var lastModifyName=option.getAttribute("lastModifyName");
		this.frames.get("Query").mainPanel.setStatusValue([option.getAttribute("name"),this.params.query_id,lastModifyName,lastModifyTime]);
    };
	this.hideToolBar=function(){	
		var  tempToolBar=this.MainTabPanel.getTopToolbar();
		tempToolBar.items.each(function(item){  
			try{
			if(item.btnId=='delete')
				item.disable();
			else 
				item.enable();
			}catch(e){}
		}, tempToolBar.items);
    };
	this.showToolBar=function(){	
		var  tempToolBar=this.MainTabPanel.getTopToolbar();
		tempToolBar.items.each(function(item){ 
			try{
			if(item.btnId=='open')
				item.disable();
			else 
				item.enable();
			}catch(e){}
		}, tempToolBar.items);
    };
	this.getSourceQuery=function(item){	
		using("dev.query.ColumnsWindow");
		var columnsWindow = new dev.query.ColumnsWindow(rt,this.params['parent_id'],'query');
		columnsWindow.show();
    };
	this.loadQuery=function(id,option){	
		if(option){
			t1.innerHTML="";
			t2.innerHTML="";
			check.value="";
			COLM.clear();
			rt.clear();
			selectTable.clear();
			COLM.loadXML(option.selectSingleNode("columns"));
			rt.loadXML(option.selectSingleNode("import").childNodes,selectTable);
			check.value = option.getAttribute("where");
			check.focus();
			var lastModifyTime=option.getAttribute("lastModifyTime");
			var lastModifyName=option.getAttribute("lastModifyName");
			this.frames.get("Query").mainPanel.setStatusValue([option.getAttribute("name"),id,lastModifyName,lastModifyTime]);
		}
    };
	this.saveQuery=function(option){	
		if(option){
			if(selectTable.list.length ==0 )
				return;
			var colXml = COLM.getXML();
			if(colXml == null)
				return;
			var resXml = rt.getXML();
			if(resXml == null)
				return;
			var where = check.value.EncodeHTML();
			
			var level = 0;
			var t = where.toLowerCase().indexOf('from');
			if(t==0)
				level = 1;
			var arr = getKeys(where+resXml+colXml);
			var paramXml = paramToXML(arr.distinct());

			where = replaceKeys(arr,where);
			colXml = replaceKeys(arr,colXml);
			resXml = replaceKeys(arr,resXml);
		
			var parent_id =this.params['parent_id'];
			var xml = ['<query method="',option.method,'" name="',option.name,'" parent_id="',parent_id,'" query_id="',option._id,'" forder="',option.forder_id,'" where="',where,'" level="',level,'">'];
			xml.push(resXml);
			xml.push(colXml);
			xml.push(paramXml);
			//xml.push(parent_id);
			xml.push('</query>');
			var msg = Tool.postXML("/dev/query/QueryEvent.jcp?&amp;method="+this.params['method'],xml.toString());
			if(msg.firstChild.firstChild.nodeValue=='true'){
				if(option.method=='create'){
					Query.navPanel.getTree().loadSubNode(msg.lastChild.firstChild.nodeValue,Query.navPanel.clickEvent);
				}else{
					Ext.msg("info",'查询保存完成'.loc());
				}
			}else{
				Ext.msg("error",'查询保存失败,原因:'.loc()+'<br>'+msg.lastChild.firstChild.nodeValue);
			}
		}
    };
	onButtonClick=function(item){
		Query=this.frames.get('Query');
		if(item.btnId=='new'){
			if(this.params['query_id']){
				Query.navPanel.getTree().loadParentNode(Query.navPanel.clickEvent);
			}else{
				check.value="";
				COLM.clear();
				rt.clear();
				t1.innerHTML="";
				t2.innerHTML="";
				selectTable.clear();
			}
		}else if(item.btnId=='open'){
			using("dev.folder.FolderWindow");
			if(this.params['parent_id']){
				var folderWindow =new dev.folder.FolderWindow(0,'query',this.params['parent_id'],200,this.frames); 
				folderWindow.show();
			}else{
				var folderWindow =new dev.folder.FolderWindow(0,'query','',200,this.frames); 
				folderWindow.show();
			}
		}else if(item.btnId=='save'){
			if(this.params['query_id']==null){		
				using("dev.folder.FolderWindow");
				if(this.params['parent_id']){
					var folderWindow =this.frames.createPanel(new dev.folder.FolderWindow(1,'query',this.params['parent_id'],200,this.frames)); 
					folderWindow.show();
				}else{
					var folderWindow =this.frames.createPanel(new dev.folder.FolderWindow(1,'query','',200,this.frames)); 
					folderWindow.show();
				}
			}else{
				var rv = new Object();
				rv.method = "update";
				rv._id = this.params['query_id'];
				Query.queryPanel.saveQuery(rv);
			}
		}else if(item.btnId=='delete'){
			Ext.msg('confirm', '确认删除?'.loc(), function (answer){
			   if (answer == 'yes') {
					var	msg = Tool.getXML("/dev/query/QueryEvent.jcp?event=delete&query_id="+this.params['parent_id']);
					if(msg.firstChild.firstChild.nodeValue=='true'){
						Query.navPanel.getTree().loadParentNode(Query.navPanel.clickEvent);
					}else{
						Ext.msg("error",'查询保存失败,原因:'.loc()+'<br>'+msg.lastChild.firstChild.nodeValue);
					}	
			  } 
		   }.createDelegate(this));
		}else if(item.btnId=='preview'){
			using("dev.query.DataPreview");
			using("dev.query.ParamsWindow");
			if(selectTable.list.length ==0 )
				return;
			var colXml = COLM.getXML();
			if(colXml == null)
				return;
			var resXml = rt.getXML();
			if(resXml == null)
				return;

			var where = check.value.EncodeHTML();
			var level = 0;
			var t = where.toLowerCase().indexOf('from');
			if(t!=-1&&t==0)
				level = 1;

			var arr = getKeys(where+resXml+colXml);

			params = [];

			if(arr.length>0){
				var paramsWin =this.frames.createPanel(new dev.query.ParamsWindow(arr));
				paramsWin.show();
			}else{
				var paramXml = paramToXML(params);				
				where = replaceKeys(arr,where);
				colXml = replaceKeys(arr,colXml);
				resXml = replaceKeys(arr,resXml);
				var xml = ['<query method="preview" name="preview" forder="00000" where="',where,'" level="',level,'">'];
				xml.push(resXml);
				xml.push(colXml);
				xml.push(paramXml);
				xml.push('</query>');	
				
				var xml1 = ['<query method="preview" name="preview" forder="00000" where="',where,'" level="',level,'">'];
				xml1.push(resXml);
				xml1.push(colXml);
				xml1.push('</query>');	

				columArray=[];
				dataArray=[];
				var column = Tool.parseXML(xml1.toString()).selectSingleNode("columns").childNodes;
				for(var j=0;j<column.length;j++){
					var c = column.item(j);
					dataArray.push({name: c.getAttribute('name')});
					columArray.push({header:c.getAttribute('name'), dataIndex: c.getAttribute('name'), sortable: true, align: 'right'});
				}
				var queryDataWindow = new dev.query.DataPreview(xml,'',columArray,dataArray);
				queryDataWindow.show();
			}
		}
    };
	
	this.showQueryResult=function(params){
		using("dev.query.DataPreview");
		using("dev.query.ParamsWindow");

		if(!params)
			return;
		var paramXml = paramToXML(params);	

		if(selectTable.list.length ==0 )
			return;
		var colXml = COLM.getXML();
		if(colXml == null)
			return;
		var resXml = rt.getXML();
		if(resXml == null)
			return;
		var where = check.value.EncodeHTML();
		var level = 0;
		var t = where.toLowerCase().indexOf('from');
		if(t!=-1&&t==0)
			level = 1;
		var arr = getKeys(where+resXml+colXml);

		where = replaceKeys(arr,where);	
		colXml = replaceKeys(arr,colXml);
		resXml = replaceKeys(arr,resXml);

		var xml = ['<query method="preview" name="preview" forder="00000" where="',where,'" level="',level,'">'];
		xml.push(resXml);
		xml.push(colXml);
		xml.push(paramXml);
		xml.push('</query>');	

		var xml1 = ['<query method="preview" name="preview" forder="00000" where="',where,'" level="',level,'">'];
		xml1.push(resXml);
		xml1.push(colXml);
		xml1.push('</query>');	

		columArray=[];
		dataArray=[];
		var column = Tool.parseXML(xml1.toString()).selectSingleNode("columns").childNodes;
		for(var j=0;j<column.length;j++){
			var c = column.item(j);
			dataArray.push({name: c.getAttribute('name')});
			columArray.push({header:c.getAttribute('name'), dataIndex: c.getAttribute('name'), sortable: true, align: 'right'});
		}
		var queryDataWindow = new dev.query.DataPreview(xml,'',columArray,dataArray);
		queryDataWindow.show();
    }




//-----------------------------------------------------------------------------------------
	
	

//--------------主查询窗口构建---------------------------------------------------------------

	var ButtonArray=[];
	this.params={};

	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'new',
				text: '新建'.loc(),
				icon: '/themes/icon/xp/newfile.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'open',
				text: '打开'.loc(),
				icon: '/themes/icon/xp/reload.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'save',
				text: '保存'.loc(),
				icon: '/themes/icon/common/saves.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'delete',
				text: '删除'.loc(),
				icon: '/themes/icon/common/delete.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :onButtonClick
	}));
	ButtonArray.push(new Ext.Toolbar.Separator());
	ButtonArray.push(new Ext.Toolbar.Button({
				btnId:'preview',
				text: '预览'.loc(),
				icon: '/themes/icon/xp/preview.gif',
				cls: 'x-btn-text-icon  bmenu',
				disabled:false,
				state:'create',
				scope: this,
				hidden : false,
				handler :onButtonClick
	}));
 
//------------------查询资源窗口构建，完成查询导入------------------------------------------

	this.NavButtonArray=[];

	this.NavButtonArray.push(new Ext.Toolbar.Fill());
	this.NavButtonArray.push(new Ext.Toolbar.Button({
		icon: '/themes/icon/xp/open.gif',
		cls: 'x-btn-icon',
		scope: this,
		hidden : false,
		handler: this.getSourceQuery,
		pressed: false
	}));

	this.TabNav = new Ext.Panel({
		region: 'center',
		autoScroll: true,
		width: 230,
		minSize: 180,
        border:false,
		collapsible: false,
	    split: false,
		html:'<table width="100%" height="100%" cellspacing="0" cellpadding="0"><tr><td bgcolor=white style="border:1 solid #7F9DB9"><div style="width:100%;height:100%;"><div id=source_table></div></div></td></tr><tr id=proptop style="display:none;" height=10><td></td></tr></table>'
	});

	PropPanel=this.PropPanel = new  Ext.form.FormPanel({
		title: '属性'.loc(),
		region: 'south',
		style:'background-color:transparent;',
		bodyStyle: 'padding:4px',
		autoScroll: true,
		height: 120,
		labelAlign:'right',
		frame:false,
        border:false,
		bodyBorder:false,
		hidden:true,
		collapsible: false,
	    split: false
	});

	NavPanel=this.NavPanel = new Ext.Panel({
		title: '资源窗口'.loc(),
		region: 'west',
		layout:'border',
		autoScroll: false,
		width: 230,
		minSize: 180,
        border:true,
		collapsible: true,
	    split: true,
		tbar:this.NavButtonArray,
		items:[this.TabNav,this.PropPanel]
	});

    this.querySpace = new Ext.Panel({
		region: 'center',
		style:'height:100%;width:100%;',	
		layout:'fit',
		defaults: {frame:true, width:"100%", height: "100%"},
		items:[ 
		  new Ext.Panel({
			style:'height:100%;width:100%;',	
			layout:'border',
			items:[ 
				 new Ext.Panel({
					region: 'center',
					layout:'border',
					items:[ 
						 new Ext.Panel({
							region: 'center',
							html:'<div style="overflow:auto;height:100%;border-right:1 solid #D0CEBF;border-bottom:1 solid #D0CEBF;background-color:#FCFCFD"><div style="height:100%;border:1 solid #919B9C;" id=column_table></div></div>'
						 }), new Ext.Panel({
							width:100,	
							region: 'east',
							html:'<table cellspacing="0" cellpadding="0" width="100%" height="100%"  bgcolor=#ECE9D8><tbody style="height:100%"><tr><td width="100" align=center><button class="querybutton" id=Move2Top onclick="quaryCommand(1);return false" style="width:80;padding:2 0 0 0">'+'上移'.loc()+'</button><br><button class="querybutton" id=Move2Down onclick="quaryCommand(2);return false" style="width:80;padding:2 0 0 0">'+'下移'.loc()+'</button><br><br><button class="querybutton" onclick="quaryCommand(0)" style="width:80;cursor:default"><img src="/themes/icon/xp/del_16.gif" align="absmiddle"><span style="padding:2 0 0 3;height:12">'+'删除'.loc()+'</span></button><br><br></td></tr></tbody></table>'
					 })]
				 }), new Ext.Panel({
					height:120,	
					region: 'south',
					html:'<table width="100%" height=100% cellspacing="0" cellpadding="0" ><tbody style="height:100%"><tr height=1><td bgcolor="#ACA899"></td></tr><tr><td bgcolor="#ACA899"></td></tr><tr height=120><td bgcolor="#FEFAEF" style="padding:5;"><fieldset><legend>'+'关联条件'.loc()+'</legend><table width=100%><tr><td rowspan="3" width=70%><textarea id=check style="border: 1px solid #7F9DB9;width:100%;height:80px;overflow:auto"></textarea></td><td width="30%"><select class=queryselect id=t1 style="width:100%; height:20px"></select></td></tr><tr><td width="35%"><select class=queryselect id=t2 style="width:100%; height:20px"></select></td></tr><tr><td width="35%"><input type="button" class="querybutton"  value="and" onclick="javascript:return btClick(0); "><input type="button"  class="querybutton"  value="or " onclick="javascript:return btClick(1);"><input type="button" class="querybutton"  value="'+'添加参数'.loc()+'" onclick="javascript:return btClick(2);"></td></tr></table></fieldset></td></tr></tbody></table></td></tr></tbody></table>'
			 })]
		 })]
    });
	this.MainTabPanel=new Ext.Panel({
			id: 'queryMainPanel',
			closable:false, 
			layout: 'border',
			region: 'center',
			border:false,
			bodyStyle:'padding:0px 0px 0px 0px;height:100%;width:100%;',
			tbar:ButtonArray,
			items:[this.NavPanel,this.querySpace]
	});
};

