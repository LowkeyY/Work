Ext.namespace("bin.exe");

bin.exe.PageWindow = function(url,printConfig){
	this.url=url;
	this.printConfig=printConfig;
	var pageData = new Ext.data.SimpleStore({
		fields: ['id', 'pageSize'],		
		data : [
		['A0', 'A0'],
		['A1', 'A1'],
		['A2', 'A2'],
		['A3', 'A3'],
		['A4', 'A4'],
		['A5', 'A5'],
		['A6', 'A6'],
		['A7', 'A7'],
		['B0', 'B0'],
		['B1', 'B1'],
		['B2', 'B2'],
		['B3', 'B3'],
		['B4', 'B4'],
		['B5', 'B5']
		]
	});

	this.pageSize='A4';
	this.bottomWidth=19.05;
	this.leftWidth=19.05;
	this.rightWidth=19.05;
	this.topWidth=19.05;

	this.SetPagePanel = new Ext.FormPanel({
        labelWidth: 100, 
        border:false,
		labelAlign: 'right',
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
				   bodyStyle: 'padding:0px 0px 0px 0px',
				   border:false,
				   items: [		
						new Ext.form.TextField({
							fieldLabel: '标题'.loc(),
							name: 'title',								
							width: 200,
							maxLength : 200,
							maxLengthText : '标题不能超过{0}个字符!'.loc()
						}),
						new Ext.form.TextField({
							fieldLabel: '页眉'.loc(),
							name: 'pageTop',								
							width: 200,
							maxLength : 200,
							maxLengthText : '页眉不能超过{0}个字符!'.loc()
						}),
						new Ext.form.TextField({
							fieldLabel: '页脚'.loc(),
							name: 'pageBottom',								
							width: 200,
							maxLength : 200,
							maxLengthText : '页脚不能超过{0}个字符!'.loc()
						})
				   ]
				}
			]
		},
		{
			layout:'column',
			border:false,
            items:
			[
				{ 
				   columnWidth:0.70,
				   layout: 'form',
				   bodyStyle: 'padding:20px 0px 0px 0px',
				   border:false,
				   items: [		
						new Ext.form.ComboBox({
							fieldLabel: '纸张大小'.loc(),
							name: 'pageSize',
							store: pageData,
							displayField: 'pageSize',
							valueField: 'id',
							hiddenName: 'pageSize',
							mode: 'local',
							triggerAction: 'all',
							editable: false,
							width: 100,
							value:this.pageSize,
							selectOnFocus: true,
							forceSelection: true
						}),
						this.Ra=new Ext.form.RadioGroup({
							fieldLabel:'页面方向'.loc(),
							scope:this,
							name: 'pageOrient',
							items: [
								{boxLabel: '纵向'.loc(), name: 'pageOrient', inputValue:'V',checked: true},
								{boxLabel: '横向'.loc(), name: 'pageOrient', inputValue:'H'}
							]
						})
					 ]},
					{ 
					   columnWidth:0.30,
					   layout: 'form',
					   bodyStyle: 'padding:0px 10px 0px 0px',
					   html:'<img name="image" align="center" src="/dev/report/setPage.gif">',
					   border:false
					}
			]
		},
		{
			layout:'column',
			border:false,
		    bodyStyle: 'padding:25px 10px 0px 0px',
            items:
			[
				{ 
				   columnWidth:0.50,
				   layout: 'form',
				   border:false,
				   items: [	
						new Ext.form.NumberField({
								fieldLabel: '左边距'.loc()+'('+'毫米'.loc()+')',
								name: 'leftWidth',
								width: 70,
								allowDecimals:true,
								allowBlank:false,
								decimalPrecision:2,
								value:this.leftWidth,
								blankText:'左边距是数字且不能为空.'.loc()
						}),
						new Ext.form.NumberField({
								fieldLabel: '上边距'.loc()+'('+'毫米'.loc()+')',
								name: 'topWidth',
								allowDecimals:true,
								width: 70,
								allowBlank:false,
								decimalPrecision:2,
								value:this.topWidth,
								blankText:'上边距必须是数字且不能为空.'.loc()
						})
					]
				},
				{ 
				   columnWidth:0.50,
				   layout: 'form',
				   border:false,
				   items: [	
						new Ext.form.NumberField({
								fieldLabel: '右边距'.loc()+'('+'毫米'.loc()+')',
								name: 'rightWidth',
								width: 70,
								allowBlank:false,
								allowDecimals:true,
								decimalPrecision:2,
								value:	this.rightWidth,
								blankText:'左边距是数字且不能为空.'.loc()
						}),
						new Ext.form.NumberField({
								fieldLabel: '下边距(毫米)',
								name: 'bottomWidth',
								allowDecimals:true,
								width: 70,
								allowBlank:false,
								decimalPrecision:2,
								value:this.bottomWidth,
								blankText:'上边距必须是数字且不能为空.'.loc()
						})
				]}
			]
		}
	]
	});
	this.win =  new Ext.Window({
		title:'设置页面'.loc(),
		layout:'fit',
		width:413,
		height:380,
		scope:this,
		closeAction:'hide',
		modal:true,
		items:this.SetPagePanel,
		buttons: [{
			text:'确定'.loc(),
			scope:this,
			handler: this.windowConfirm
		},
		{
			text:'重置'.loc(),
			scope:this,
			handler: this.windowReset
		},{
			text: '取消'.loc(),
			scope:this,
			handler: this.windowCancel
		}]
	});
};

Ext.extend(bin.exe.PageWindow, Ext.Window, {
	show : function(){
		this.win.show(); 
	},
	createWindow: function(config, cls){
		var desktop = WorkBench.Desk.getDesktop();
        var win = desktop.getWindow(config.id);
        if(!win){
            win = desktop.createWindow(config, cls)
        }    
        return win;
    },
	windowCancel : function(){
		this.win.close();
    },
	windowReset : function(){
		var frm=this.SetPagePanel.form;
		frm.findField('title').setValue("");
		frm.findField('pageTop').setValue("");
		frm.findField('pageBottom').setValue("");
		frm.findField('pageSize').setValue(this.pageSize);
		frm.findField('bottomWidth').setValue(this.bottomWidth);
		frm.findField('leftWidth').setValue(this.leftWidth);
		frm.findField('rightWidth').setValue(this.rightWidth);
		frm.findField('topWidth').setValue(this.topWidth);
		this.Ra.reset();
    },
	windowConfirm : function(){
		var frm=this.SetPagePanel.form;
		this.printConfig['title']=frm.findField('title').getValue();
		this.printConfig['pageTop']=frm.findField('pageTop').getValue();
		this.printConfig['pageBottom']=frm.findField('pageBottom').getValue();
		this.printConfig['pageSize']=frm.findField('pageSize').getValue();
		this.printConfig['bottomWidth']=frm.findField('bottomWidth').getValue();
		this.printConfig['leftWidth']=frm.findField('leftWidth').getValue();
		this.printConfig['rightWidth']=frm.findField('rightWidth').getValue();
		this.printConfig['topWidth']=frm.findField('topWidth').getValue();
		this.printConfig['pageOrient']=frm.findField('pageOrient').getValue();
		this.showPDF(this.url,this.printConfig);
		this.win.close();
    },
	showPDF: function(url,config){
		var paramString=Ext.urlEncode(config);
        var filePath = url+'?'+paramString+'&'+Math.random();

        var embedStr = '<object classid="clsid:CA8A9780-280D-11CF-A24D-444553540000" width="100%" height="100%"><param name="src" value="' + filePath + '"><embed src="' + filePath + '"  width="100%" height="100%"><noembed> Your browser does not support embedded PDF files.</noembed></embed></object>'
        var dlg = this.createWindow({
            id: 'pdf-viewer-'+config.ObjectID,
            iconCls: 'db-icn-adobe',
            constrainHeader: true,
            width: 800,
            height: 530,
            title: config.title,
            html: embedStr,
			buttons: [{
				text: '关闭'.loc(),
				scope:this,
				handler: function(){
				 dlg.close();
				}
			}]
        });   
        dlg.show();         
    }
});

