Ext.namespace("ExternalItems.haiwaizhishigongxiang.spacePage");ExternalItems.haiwaizhishigongxiang.spacePage.pluginsFileCount=function(){this.id="ExternalItems.haiwaizhishigongxiang.spacePage.pluginsFileCount";this.init();};ExternalItems.haiwaizhishigongxiang.spacePage.pluginsFileCount.prototype={template:new Ext.XTemplate('<div style="width : 100%;height:255px; overflow:auto"><table style="width:90%;margin-left:25px;border:1px solid grey;margin-top:10px;overflow:auto;">	<tr style="background-color:LightSlateGray;">			<td style="width:50%;height:40px;">项目</td>			<td style="width:50%">数量</td>	</tr>	<tr style="">			<td style="padding-top:10px;border:1px solid grey;">总文件</td>			<td style="border:1px solid grey;">{title1}个</td>	</tr>	<tr style="background-color:rgb(255, 255, 204)">			<td style="padding-top:10px;border:1px solid grey;">总大小</td>			<td style="border:1px solid grey;">{title2}</td>	</tr>	<tr>			<td style="padding-top:10px;border:1px solid grey;">总目录</td>			<td style="border:1px solid grey;">{title3}个</td>	</tr>{tr}</table>	</div>'),init:function(){var tools=[];tools.push({id:"refresh",handler:function(e,target,panel){panel.scope.refresh();}});this.mainPanel=new ExternalItems.haiwaizhishigongxiang.spacePage.Portal.Portlet({id:this.id,title:"文件统计",height:300,iconCls:"iportal-icon-download",scope:this,tools:tools,listeners:{afterrender:function(comp){comp.scope.refresh();}}});},refresh:function(){this.mainPanel.body.mask("数据加载中，请稍后...");if(!this.mainPanel.el||!this.mainPanel.el.dom){return ;}Ext.Ajax.request({url:"/ExternalItems/haiwaizhishigongxiang/spacePage/getFileCount.jcp",method:"POST",scope:this,callback:function(options,success,response){var check=response.responseText;var ajaxResult=Ext.util.JSON.decode(check);if(ajaxResult.success){this.template.overwrite(this.mainPanel.body,ajaxResult.data);}}});}};