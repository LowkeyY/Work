var FCKExtCommand=function(A,C,B){this.Name=A;this.Title=C;this.func=B;};FCKExtCommand.prototype.Execute=function(){window.parent.FCKeditor_OnExtWindow(FCK,this.func);};FCKExtCommand.prototype.GetState=function(){return FCK_TRISTATE_OFF;};FCKCommands.RegisterCommand("Report",new FCKExtCommand("Report",FCKLang.ReportDlgTitle,function(A,D){var C="/lib/FCKeditor/editor/plugins/Report/getReportPlugin.jcp";this.reportSelect=new A.form.ComboBox({fieldLabel:"报表选择".loc(),hiddenName:"queryTable",width:200,store:new A.data.JsonStore({url:C,root:"items",autoLoad:true,fields:["value","text"],baseParams:{type:"report",report_id:D.parent_id}}),valueField:"value",displayField:"text",allowBlank:false,blankText:"请选择报表!".loc(),triggerAction:"all",mode:"local"});this.ReportForm=new A.form.FormPanel({labelAlign:"right",url:C,method:"POST",border:false,height:200,width:300,autoScroll:true,bodyStyle:"padding:10px 0px 0px 0px;background:#FFFFFF;",items:[this.reportSelect]});this.windowCancel=function(){B.close();};this.windowConfirm=function(){if(this.ReportForm.form.isValid()){var E=this.reportSelect.getValue();FCKReports.Add(E);B.close();}else{A.msg("error","数据不能提交,请修改表单中标识的错误!".loc());}};var B=new A.Window({title:"报表选择".loc(),layout:"fit",width:350,height:130,closeAction:"hide",plain:true,modal:true,border:false,items:[this.ReportForm],buttons:[{text:"确定".loc(),scope:this,handler:this.windowConfirm},{text:"取消".loc(),scope:this,handler:this.windowCancel}]});B.show();}));var oReportItem=new FCKToolbarButton("Report",FCKLang.ReportBtn);oReportItem.IconPath=FCKPlugins.Items.Report.Path+"Report.gif";FCKToolbarItems.RegisterItem("Report",oReportItem);var FCKReports=new Object();FCKReports.Add=function(A){var B=FCK.CreateElement("SPAN");this.SetupSpan(B,A);};FCKReports.SetupSpan=function(B,A){B.innerHTML="${Report_"+A+"}";B.style.backgroundColor="#ffff00";B.style.color="#000000";if(FCKBrowserInfo.IsGecko){B.style.cursor="default";}B._fckReport=A;B.contentEditable=false;B.onresizestart=function(){FCK.EditorWindow.event.returnValue=false;return false;};};FCKReports._SetupClickListener=function(){FCKReports._ClickListener=function(A){if(A.target.tagName=="SPAN"&&A.target._fckReport){FCKSelection.SelectNode(A.target);}};FCK.EditorDocument.addEventListener("click",FCKReports._ClickListener,true);};FCKReports.OnDoubleClick=function(A){if(A.tagName=="SPAN"&&A._fckReport){FCKCommands.GetCommand("Report").Execute();}};FCK.RegisterDoubleClickHandler(FCKReports.OnDoubleClick,"SPAN");FCKReports.Exist=function(B){var A=FCK.EditorDocument.getElementsByTagName("SPAN");for(var C=0;C<A.length;C++){if(A[C]._fckReport==B){return true;}}};if(FCKBrowserInfo.IsIE){FCKReports.Redraw=function(){var A=FCK.EditorDocument.body.innerText.match(/\[\[[^\[\]]+\]\]/g);if(!A){return ;}var D=FCK.EditorDocument.body.createTextRange();for(var B=0;B<A.length;B++){if(D.findText(A[B])){var C=A[B].match(/\[\[\s*([^\]]*?)\s*\]\]/)[1];D.pasteHTML('<span style="color: #000000; background-color: #ffff00" contenteditable="false" _fckReport="'+C+'">'+A[B]+"</span>");}}};}else{FCKReports.Redraw=function(){if(FCK.EditMode!=FCK_EDITMODE_WYSIWYG){return ;}var D=FCK.EditorDocument.createTreeWalker(FCK.EditorDocument.body,NodeFilter.SHOW_TEXT,FCKReports._AcceptNode,true);var A=new Array();while(oNode=D.nextNode()){A[A.length]=oNode;}for(var G=0;G<A.length;G++){var C=A[G].nodeValue.split(/(\[\[[^\[\]]+\]\])/g);for(var B=0;B<C.length;B++){if(C[B].length>0){if(C[B].indexOf("${")==0){var F=C[B].match(/\[\[\s*([^\]]*?)\s*\]\]/)[1];var E=FCK.EditorDocument.createElement("span");FCKReports.SetupSpan(E,F);A[G].parentNode.insertBefore(E,A[G]);}else{A[G].parentNode.insertBefore(FCK.EditorDocument.createTextNode(C[B]),A[G]);}}}A[G].parentNode.removeChild(A[G]);}FCKReports._SetupClickListener();};FCKReports._AcceptNode=function(A){if(/\[\[[^\[\]]+\]\]/.test(A.nodeValue)){return NodeFilter.FILTER_ACCEPT;}else{return NodeFilter.FILTER_SKIP;}};}FCK.Events.AttachEvent("OnAfterSetHTML",FCKReports.Redraw);FCKXHtml.TagProcessors.span=function(A,B){if(B._fckReport){A=FCKXHtml.XML.createTextNode("${Report_"+B._fckReport+"}");}else{FCKXHtml._AppendChildNodes(A,B,false);}return A;};