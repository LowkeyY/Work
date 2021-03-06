Ext.namespace("dev.query");


dev.query.ParamsWindow = function(arr){
	this.win;
	var para=arr.distinct();
	this.input=[];
	var len = para.length;	
	for(var i=0;i<len;i++){
		var param = para[i].split("|");
		var name = param[0];
		var perfix = param[1];
		var suffix = param[2];
		var utype = param[3];
		var defaultvalue = param[4];

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
		var notnull = (perfix.trim()==''&&suffix.trim()=='')?1:0;
		this.input.push('<tr><td height="25" width="28%" align="right">',name,': </td><td width="72%"><input style="width:200px" sname="',name,'"inputType="param"','" notnull="',notnull,'" perfix="',perfix,'" suffix="',suffix,'" utype="',utype,'" defaultvalue="',defaultvalue,'" >',notnull==1?" <font color=red>*</font>":"",' </td></tr>');
	}
	var h=len*32+80;

	this.ParamsPanel = new Ext.Panel({
		frame:true,
		collapsible:false,
		layout:'fit'
	});
	this.win =  new Ext.Window({
		title:'参数提交'.loc(),
		layout:'fit',
		width:350,
		height:h,
		scope:parent.WorkBench,
		closeAction:'hide',
		plain: true,
		modal:true,
		items:[this.ParamsPanel],
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

Ext.extend(dev.query.ParamsWindow, Ext.Window, {
	show : function(){
		this.win.show(this); 
		this.ParamsPanel.getEl().update('<table>'+this.input.toString()+'</table>');
    },
	windowCancel : function(){
		this.win.close();
    },
	windowConfirm : function(){
		var obj = new Array();
		var inps =Ext.DomQuery.select("INPUT[inputType=param]");
		for(var i=0;i<inps.length;i++){	
			var inp = inps[i];
			if(inp.getAttribute('notnull')==1&&inp.value.trim()==''&&inp.getAttribute('defaultvalue')==''){
				Ext.msg("error",inp.getAttribute('sname')+':该参数值不能为空,请重新输入'.loc());
				inp.focus();
				return;
			}else if(inp.value.trim()!='' || inp.getAttribute('notnull')==0){
				obj.push(inp.getAttribute('sname')+"|"+inp.getAttribute('perfix')+"|"+inp.getAttribute('suffix')+"|"+inp.getAttribute('utype')+"|"+inp.getAttribute('defaultvalue')+"|"+inp.value);
			}else if(inp.value.trim()==''&&inp.getAttribute('defaultvalue')!=''){
				obj.push(inp.getAttribute('sname')+"|"+inp.getAttribute('perfix')+"|"+inp.getAttribute('suffix')+"|"+inp.getAttribute('utype')+"|"+inp.getAttribute('defaultvalue')+"|"+inp.getAttribute('defaultvalue'));
			}
		}
		Query=this.frames.get('Query');
		Query.queryPanel.showQueryResult(obj);
		this.win.close();
    }
});

