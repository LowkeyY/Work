var dialog=window.parent;var oEditor=dialog.InnerDialogLoaded();var FCK=oEditor.FCK;var FCKLang=oEditor.FCKLang;var FCKConfig=oEditor.FCKConfig;var FCKDebug=oEditor.FCKDebug;var FCKTools=oEditor.FCKTools;var bImageButton=(document.location.search.length>0&&document.location.search.substr(1)=="ImageButton");dialog.AddTab("Info",FCKLang.DlgImgInfoTab);if(!bImageButton&&!FCKConfig.ImageDlgHideLink){dialog.AddTab("Link",FCKLang.DlgImgLinkTab);}if(FCKConfig.ImageUpload){dialog.AddTab("Upload",FCKLang.DlgLnkUpload);}if(!FCKConfig.ImageDlgHideAdvanced){dialog.AddTab("Advanced",FCKLang.DlgAdvancedTag);}function OnDialogTabChange(A){ShowE("divInfo",(A=="Info"));ShowE("divLink",(A=="Link"));ShowE("divUpload",(A=="Upload"));ShowE("divAdvanced",(A=="Advanced"));}var oImage=dialog.Selection.GetSelectedElement();if(oImage&&oImage.tagName!="IMG"&&!(oImage.tagName=="INPUT"&&oImage.type=="image")){oImage=null;}var oLink=dialog.Selection.GetSelection().MoveToAncestorNode("A");var oImageOriginal;function UpdateOriginal(A){if(!eImgPreview){return ;}if(GetE("txtUrl").value.length==0){oImageOriginal=null;return ;}oImageOriginal=document.createElement("IMG");if(A){oImageOriginal.onload=function(){this.onload=null;ResetSizes();};}oImageOriginal.src=eImgPreview.src;}var bPreviewInitialized;window.onload=function(){oEditor.FCKLanguageManager.TranslatePage(document);GetE("btnLockSizes").title=FCKLang.DlgImgLockRatio;GetE("btnResetSize").title=FCKLang.DlgBtnResetSize;LoadSelection();GetE("tdBrowse").style.display=FCKConfig.ImageBrowser?"":"none";GetE("divLnkBrowseServer").style.display=FCKConfig.LinkBrowser?"":"none";UpdateOriginal();if(FCKConfig.ImageUpload){GetE("frmUpload").action=FCKConfig.ImageUploadURL;}dialog.SetAutoSize(true);dialog.SetOkButton(true);SelectField("txtUrl");};function LoadSelection(){if(!oImage){return ;}var D=oImage.getAttribute("_fcksavedurl");if(D==null){D=GetAttribute(oImage,"src","");}GetE("txtUrl").value=D;GetE("txtAlt").value=GetAttribute(oImage,"alt","");GetE("txtVSpace").value=GetAttribute(oImage,"vspace","");GetE("txtHSpace").value=GetAttribute(oImage,"hspace","");GetE("txtBorder").value=GetAttribute(oImage,"border","");GetE("cmbAlign").value=GetAttribute(oImage,"align","");var F,G;var C=/^\s*(\d+)px\s*$/i;if(oImage.style.width){var B=oImage.style.width.match(C);if(B){F=B[1];oImage.style.width="";SetAttribute(oImage,"width",F);}}if(oImage.style.height){var E=oImage.style.height.match(C);if(E){G=E[1];oImage.style.height="";SetAttribute(oImage,"height",G);}}GetE("txtWidth").value=F?F:GetAttribute(oImage,"width","");GetE("txtHeight").value=G?G:GetAttribute(oImage,"height","");GetE("txtAttId").value=oImage.id;GetE("cmbAttLangDir").value=oImage.dir;GetE("txtAttLangCode").value=oImage.lang;GetE("txtAttTitle").value=oImage.title;GetE("txtLongDesc").value=oImage.longDesc;if(oEditor.FCKBrowserInfo.IsIE){GetE("txtAttClasses").value=oImage.className||"";GetE("txtAttStyle").value=oImage.style.cssText;}else{GetE("txtAttClasses").value=oImage.getAttribute("class",2)||"";GetE("txtAttStyle").value=oImage.getAttribute("style",2);}if(oLink){var A=oLink.getAttribute("_fcksavedurl");if(A==null){A=oLink.getAttribute("href",2);}GetE("txtLnkUrl").value=A;GetE("cmbLnkTarget").value=oLink.target;}UpdatePreview();}function Ok(){if(GetE("txtUrl").value.length==0){dialog.SetSelectedTab("Info");GetE("txtUrl").focus();alert(FCKLang.DlgImgAlertUrl);return false;}var A=(oImage!=null);if(A&&bImageButton&&oImage.tagName=="IMG"){if(confirm("Do you want to transform the selected image on a image button?")){oImage=null;}}else{if(A&&!bImageButton&&oImage.tagName=="INPUT"){if(confirm("Do you want to transform the selected image button on a simple image?")){oImage=null;}}}oEditor.FCKUndo.SaveUndoStep();if(!A){if(bImageButton){oImage=FCK.EditorDocument.createElement("input");oImage.type="image";oImage=FCK.InsertElement(oImage);}else{oImage=FCK.InsertElement("img");}}UpdateImage(oImage);var B=GetE("txtLnkUrl").value.Trim();if(B.length==0){if(oLink){FCK.ExecuteNamedCommand("Unlink");}}else{if(oLink){oLink.href=B;}else{dialog.Selection.EnsureSelection();if(!A){oEditor.FCKSelection.SelectNode(oImage);}oLink=oEditor.FCK.CreateLink(B)[0];if(!A){oEditor.FCKSelection.SelectNode(oLink);oEditor.FCKSelection.Collapse(false);}}SetAttribute(oLink,"_fcksavedurl",B);SetAttribute(oLink,"target",GetE("cmbLnkTarget").value);}return true;}function UpdateImage(A,B){A.src=GetE("txtUrl").value;SetAttribute(A,"_fcksavedurl",GetE("txtUrl").value);SetAttribute(A,"alt",GetE("txtAlt").value);SetAttribute(A,"width",GetE("txtWidth").value);SetAttribute(A,"height",GetE("txtHeight").value);SetAttribute(A,"vspace",GetE("txtVSpace").value);SetAttribute(A,"hspace",GetE("txtHSpace").value);SetAttribute(A,"border",GetE("txtBorder").value);SetAttribute(A,"align",GetE("cmbAlign").value);if(!B){SetAttribute(A,"id",GetE("txtAttId").value);}SetAttribute(A,"dir",GetE("cmbAttLangDir").value);SetAttribute(A,"lang",GetE("txtAttLangCode").value);SetAttribute(A,"title",GetE("txtAttTitle").value);SetAttribute(A,"longDesc",GetE("txtLongDesc").value);if(oEditor.FCKBrowserInfo.IsIE){A.className=GetE("txtAttClasses").value;A.style.cssText=GetE("txtAttStyle").value;}else{SetAttribute(A,"class",GetE("txtAttClasses").value);SetAttribute(A,"style",GetE("txtAttStyle").value);}}var eImgPreview;var eImgPreviewLink;function SetPreviewElements(B,A){eImgPreview=B;eImgPreviewLink=A;UpdatePreview();UpdateOriginal();bPreviewInitialized=true;}function UpdatePreview(){if(!eImgPreview||!eImgPreviewLink){return ;}if(GetE("txtUrl").value.length==0){eImgPreviewLink.style.display="none";}else{UpdateImage(eImgPreview,true);if(GetE("txtLnkUrl").value.Trim().length>0){eImgPreviewLink.href="javascript:void(null);";}else{SetAttribute(eImgPreviewLink,"href","");}eImgPreviewLink.style.display="";}}var bLockRatio=true;function SwitchLock(A){bLockRatio=!bLockRatio;A.className=bLockRatio?"BtnLocked":"BtnUnlocked";A.title=bLockRatio?"Lock sizes":"Unlock sizes";if(bLockRatio){if(GetE("txtWidth").value.length>0){OnSizeChanged("Width",GetE("txtWidth").value);}else{OnSizeChanged("Height",GetE("txtHeight").value);}}}function OnSizeChanged(C,A){if(oImageOriginal&&bLockRatio){var B=C=="Width"?GetE("txtHeight"):GetE("txtWidth");if(A.length==0||isNaN(A)){B.value="";return ;}if(C=="Width"){A=A==0?0:Math.round(oImageOriginal.height*(A/oImageOriginal.width));}else{A=A==0?0:Math.round(oImageOriginal.width*(A/oImageOriginal.height));}if(!isNaN(A)){B.value=A;}}UpdatePreview();}function ResetSizes(){if(!oImageOriginal){return ;}if(oEditor.FCKBrowserInfo.IsGecko&&!oImageOriginal.complete){setTimeout(ResetSizes,50);return ;}GetE("txtWidth").value=oImageOriginal.width;GetE("txtHeight").value=oImageOriginal.height;UpdatePreview();}function BrowseServer(){OpenServerBrowser("Image",FCKConfig.ImageBrowserURL,FCKConfig.ImageBrowserWindowWidth,FCKConfig.ImageBrowserWindowHeight);}function LnkBrowseServer(){OpenServerBrowser("Link",FCKConfig.LinkBrowserURL,FCKConfig.LinkBrowserWindowWidth,FCKConfig.LinkBrowserWindowHeight);}function OpenServerBrowser(D,B,C,A){sActualBrowser=D;OpenFileBrowser(B,C,A);}var sActualBrowser;function SetUrl(B,C,A,D){if(sActualBrowser=="Link"){GetE("txtLnkUrl").value=B;UpdatePreview();}else{GetE("txtUrl").value=B;GetE("txtWidth").value=C?C:"";GetE("txtHeight").value=A?A:"";if(D){GetE("txtAlt").value=D;}UpdatePreview();UpdateOriginal(true);}dialog.SetSelectedTab("Info");}function OnUploadCompleted(C,A,D,B){switch(C){case 0:alert("Your file has been successfully uploaded");break;case 1:alert(B);return ;case 101:alert(B);break;case 201:alert('A file with the same name is already available. The uploaded file has been renamed to "'+D+'"');break;case 202:alert("Invalid file type");return ;case 203:alert("Security error. You probably don't have enough permissions to upload. Please check your server.");return ;case 500:alert("The connector is disabled");break;default:alert("Error on file upload. Error number: "+C);return ;}sActualBrowser="";SetUrl(A);GetE("frmUpload").reset();}var oUploadAllowedExtRegex=new RegExp(FCKConfig.ImageUploadAllowedExtensions,"i");var oUploadDeniedExtRegex=new RegExp(FCKConfig.ImageUploadDeniedExtensions,"i");function CheckUpload(){var A=GetE("txtUploadFile").value;if(A.length==0){alert("Please select a file to upload");return false;}if((FCKConfig.ImageUploadAllowedExtensions.length>0&&!oUploadAllowedExtRegex.test(A))||(FCKConfig.ImageUploadDeniedExtensions.length>0&&oUploadDeniedExtRegex.test(A))){OnUploadCompleted(202);return false;}return true;}