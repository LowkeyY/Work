Ext.ns("ExternalItems.haiwaizhishigongxiang")
loadcss("lib.upload.Base");
using("lib.upload.Base");
using("lib.upload.File");
using("lib.CascadeSelect.CascadeSelect");
using("ExternalItems.haiwaizhishigongxiang.FileAttBeforeInitDanDu");
using('ExternalItems.haiwaizhishigongxiang.HWUploadDialogTools')

ExternalItems.haiwaizhishigongxiang.FileAttInputButtonDanDu = function(params) {
	
		params.DataPartMode = "model&data";
		
		Ext.Ajax.request({
			url : CPM.action,
			method : 'GET',
			params : params,
			success : function(response, options) {
				if (response.responseText) {
					var result = Ext.decode(response.responseText);
					var loadModelConfig = {
						listeners : {
							afterrender : function(comp){
								if(this.defualtLoadData){
									for(var att in this.columnBeforeRelations)
										this.formatDataValue(this.defualtLoadData, att);
								}
								var filed ,  filedDefualtValue = (this.defualtLoadData && this.defualtLoadData.FILE_CLASS) || {text : "综合政务" , value:"7d82b4d1-ad7b-4011-b613-5e5c39b479b9"};
								if(filed = this.form.findField("FILE_CLASS")){
									filed.setValue(filedDefualtValue);
									this.changeFiledVisible(filedDefualtValue.value);
								}
								if(filedDefualtValue = (this.defualtLoadData && this.defualtLoadData.SPACE_ID))
									this.hiddenFieldNodeId(filedDefualtValue);
							},
							afterlayout : function(){
								if(this.defualtLoadData)
									this.form.setValues(this.defualtLoadData);
							}
						}
					};
					ExternalItems.haiwaizhishigongxiang.FileAttBeforeInitDanDu(loadModelConfig , result , params , {});
					var dialog = new HWUploadDialogTools({
								uploadUrl : '/ExternalItems/haiwaizhishigongxiang/HWFileupload.jcp',
								filePostName : 'myUpload',
								flashUrl : '/ExternalItems/swfupload/swfupload.swf',
								fileSize : '1000 MB',
								post_params:{
									userId : 0
								},
								fileTypes : '*.*',
								fileTypesDescription : '所有文件',
								scope : this,
								loadModels : result.model,
								loadModelConfig : loadModelConfig,
								paramModels : params,
								modal : true
							})
					dialog.show();
				}
			}
		});		
}