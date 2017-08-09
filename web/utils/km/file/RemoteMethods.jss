Ext.namespace("utils.km.file");

utils.km.file.RemoteMethods = function() {
};

utils.km.file.RemoteMethods.prototype = {

    CreateFolder: function(parentId, name, OnSuccess, scope) {
        this._invoke('CreateFolder', {'parentId':parentId, 'name':name}, OnSuccess, scope);
    },
    
    RenameFolder: function(folderId, name, OnSuccess, scope) {
        this._invoke('RenameFolder', {'folderId':folderId, 'name':name}, OnSuccess, scope);
    }, 
    
    RenameFile: function(fileId, name, OnSuccess, scope) {
        this._invoke('RenameFile', {'fileId':fileId, 'name':name}, OnSuccess, scope);
    },      
    
    CommentFile: function(fileId, comment, OnSuccess, scope) {
        this._invoke('CommentFile', {'fileId':fileId, 'comment':comment}, OnSuccess, scope);
    },  
    
    CreateAlbum: function(name, description, OnSuccess, scope) {
        this._invoke('CreateAlbum', {'name':name, 'description':description}, OnSuccess, scope);
    }, 
    
    EditAlbum: function(albumId, name, description, OnSuccess, scope) {
        this._invoke('EditAlbum', {'albumId':albumId, 'name':name, 'description':description}, OnSuccess, scope);
    },
    
    Delete: function(folderIds, fileIds, OnSuccess, scope) {
        this._invoke('Delete', {'folderIds':folderIds, 'fileIds':fileIds}, OnSuccess, scope);
    },        
    
    Move: function(folderIds, fileIds, parentId, OnSuccess, scope) {
        this._invoke('Move', {'folderIds':folderIds, 'fileIds':fileIds, 'parentId':parentId}, OnSuccess, scope);
    },          
    
    Copy: function(folderIds, fileIds, targetFolderId, OnSuccess, scope) {
        this._invoke('Copy', {'folderIds':folderIds, 'fileIds':fileIds, 'targetFolderId':targetFolderId}, OnSuccess, scope);
    },
    
    EmptyRecycleBin: function(OnSuccess, scope) {
        this._invoke('EmptyRecycleBin', {}, OnSuccess, scope);
    },      
    
    Compress: function(folderIds, fileIds, archiveName, compressionLevel, password, targetFolderId, OnSuccess, scope) {
        this._invoke('Compress', {'folderIds':folderIds, 'fileIds':fileIds, 'archiveName':archiveName, 'compressionLevel':compressionLevel, 'password':password, 'targetFolderId':targetFolderId}, OnSuccess, scope, 600000);
    },  
    
    Extract: function(fileId, password, targetFolderId, OnSuccess, scope) {
        this._invoke('Extract', {'fileId':fileId, 'password':password, 'targetFolderId':targetFolderId}, OnSuccess, scope, 600000);
    },                            
    
    SendFeedback: function(subject, description, OnSuccess, scope) {
        this._invoke('SendFeedback', {'subject':subject, 'description':description}, OnSuccess, scope);
    },
    
    GetUploadKey: function(folderId, OnSuccess, scope) {
        this._invoke('GetUploadKey', {'folderId':folderId}, OnSuccess, scope);
    },
    
    GetUploadObject: function(folderId, OnSuccess, scope) {
        this._invoke('GetUploadObject', {'folderId':folderId}, OnSuccess, scope);
    },    
    
    GetUploadStatus: function(postBackId, OnSuccess, scope) {
        this._invoke('GetUploadStatus', {'postBackId':postBackId}, OnSuccess, scope);
    },         
    
    GetAllTags: function(OnSuccess, scope) {
        this._invoke('GetAllTags', {}, OnSuccess, scope);
    }, 
    
    GetTags: function(folderIds, fileIds, OnSuccess, scope) {
        this._invoke('GetTags', {'folderIds':folderIds, 'fileIds':fileIds}, OnSuccess, scope);
    },
    
    AddTags: function(folderIds, fileIds, tags, OnSuccess, scope) {
        this._invoke('AddTags', {'folderIds':folderIds, 'fileIds':fileIds, 'tags':tags}, OnSuccess, scope);
    },              
    
    RemoveTag: function(tag, OnSuccess, scope) {
        this._invoke('RemoveTag', {'tag':tag}, OnSuccess, scope);
    },
    
    EmailFiles: function(fileIds, to, subject, body, OnSuccess, scope) {
        this._invoke('EmailFiles', {'fileIds':fileIds, 'to':to, 'subject':subject, 'body':body}, OnSuccess, scope);
    }, 
    
    GetSharedItem: function(folderId, OnSuccess, scope) {
        this._invoke('GetSharedItem', {'folderId':folderId}, OnSuccess, scope);
    },  
    
    SaveSharedItem: function(folderId, enabled, comment, permissions, OnSuccess, scope) {
        this._invoke('SaveSharedItem', {'folderId':folderId, 'enabled':enabled, 'comment':comment, 'permissions':permissions}, OnSuccess, scope);
    }, 
    
    SendSharingNotificationEmails: function(folderId, users, OnSuccess, scope) {
        this._invoke('SendSharingNotificationEmails', {'folderId':folderId, 'users':users}, OnSuccess, scope);
    },     
    
    PublishFile: function(fileId, folderId, expireDate, update, OnSuccess, scope) {
        this._invoke('PublishFile', {'fileId':fileId, 'folderId':folderId, 'expireDate':expireDate, 'update':update}, OnSuccess, scope);
    },      
    
    UnPublishFile: function(fileId, OnSuccess, scope) {
        this._invoke('UnPublishFile', {'fileId':fileId}, OnSuccess, scope);
    },
    
    PublishFolder: function(folderId, enableExpiration, expireDate, enablePassword, password, enableComment, comment, update, OnSuccess, scope) {
        this._invoke('PublishFolder', {'folderId':folderId, 'enableExpiration':enableExpiration, 'expireDate':expireDate, 'enablePassword':enablePassword, 'password':password, 'enableComment':enableComment, 'comment':comment, 'update':update}, OnSuccess, scope);
    },      
    
    UnPublishFolder: function(folderId, OnSuccess, scope) {
        this._invoke('UnPublishFolder', {'folderId':folderId}, OnSuccess, scope);
    },        
    
    EmailPublishLink: function(resourceType, link, rss, emails, OnSuccess, scope) {
        this._invoke('EmailPublishLink', {'resourceType':resourceType, 'link':link, 'rss':rss, 'emails':emails}, OnSuccess, scope);
    },  
    
    SavePathState: function(state, OnSuccess, scope) {
        this._invoke('SavePathState', {'state':state}, OnSuccess, scope);
    },   
    
    GetCompletePathList: function(OnSuccess, scope) {
        this._invoke('GetCompletePathList', {}, OnSuccess, scope);
    },   
    
    GetAddressBook: function(OnSuccess, scope) {
        this._invoke('GetAddressBook', {}, OnSuccess, scope);
    },         
    
    AddAddress: function(email, name, OnSuccess, scope) {
        this._invoke('AddAddress', {'email':email,'name':name}, OnSuccess, scope);
    },   
    
    RemoveAddress: function(email, OnSuccess, scope) {
        this._invoke('RemoveAddress', {'email':email}, OnSuccess, scope);
    },     
    
    GetSubUsers: function(OnSuccess, scope) {
        this._invoke('GetSubUsers', {}, OnSuccess, scope);
    },   
    
    GetFileManagerSettings: function(OnSuccess, scope) {
        this._invoke('GetFileManagerSettings', {}, OnSuccess, scope);
    },    
    
    SaveFileManagerSetting: function(settingType, settingValue, OnSuccess, scope) {
        this._invoke('SaveFileManagerSetting', {'settingType':settingType,'settingValue':settingValue}, OnSuccess, scope);
    },
    
    SendEmail: function(emails, subject, body, OnSuccess, scope) {
        this._invoke('SendEmail', {'emails':emails,'subject':subject,'body':body}, OnSuccess, scope);
    },  
    
    UploadFromUrl: function(url, folderId, fileName, OnSuccess, scope) {
        this._invoke('UploadFromUrl', {'url':url,'folderId':folderId,'fileName':fileName}, OnSuccess, scope, 3600000);
    },
    
    _invoke: function(fn, params, OnSuccess, scope, timeout) {
       // Ext.lib.Ajax.setDefaultPostHeader(false);
       // Ext.lib.Ajax.initHeader("Content-Type", "application/json; charset=utf-8");
        Ext.Ajax.timeout = timeout || 60000;
		params['functionType']=fn;
        var transId = Ext.Ajax.request({
            url: '/utils/km/file/service.jcp',
            method: 'POST',
            scriptTag: true,
            params:params,
            scope: scope,
            callback: function(options, success, response) {
                var result = Ext.util.JSON.decode(response.responseText);
                if (success) {
                    if(OnSuccess) OnSuccess.call(scope, result);
                } else {
                    //var msg = (result && result.Message) ? result.Message : '网络已断开!'.loc();
                    //Ext.MessageBox.alert('错误'.loc()+'('+response.status+'): '+response.statusText , msg);                            
                }
            }
        });
       // Ext.lib.Ajax.setDefaultPostHeader(true);  
        Ext.Ajax.timeout = 60000;
        return transId;
    }
}