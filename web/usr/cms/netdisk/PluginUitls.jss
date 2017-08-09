Ext.ns("usr.cms.netdisk");
usr.cms.netdisk.PluginUitls = function() {}

usr.cms.netdisk.PluginUitls.prototype = {
	IconsMap : {
		'3gp' : '3gp.gif',
		'album' : 'album.gif',
		'album_shared' : 'album_shared.gif',
		'avi' : 'avi.gif',
		'bmp' : 'bmp.gif',
		'chm' : 'chm.gif',
		'dll' : 'dll.gif',
		'doc' : 'doc.gif',
		'docx' : 'doc.gif',
		'dwf' : 'dwf.gif',
		'exe' : 'exe.gif',
		'folder' : 'folder.gif',
		'folder_shared' : 'folder_shared.gif',
		'gallery' : 'gallery.gif',
		'gif' : 'gif.gif',
		'htm' : 'htm.gif',
		'jpg' : 'jpg.gif',
		'mdb' : 'mdb.gif',
		'mov' : 'mov.gif',
		'mp3' : 'mp3.gif',
		'mpg' : 'mpg.gif',
		'network' : 'network.gif',
		'network_user' : 'network_user.gif',
		'pdf' : 'pdf.gif',
		'png' : 'jpg.gif',
		'pps' : 'pps.gif',
		'ppt' : 'ppt.gif',
		'pptx' : 'ppt.gif',
		'published' : 'published.gif',
		'published_files' : 'published_files.gif',
		'rar' : 'rar.gif',
		'recycle' : 'recycle.gif',
		'rtf' : 'rtf.gif',
		'shared_albums' : 'shared_albums.gif',
		'shared_docs' : 'shared_docs.gif',
		'txt' : 'txt.gif',
		'unknown' : 'unknown.gif',
		'wav' : 'wav.gif',
		'wma' : 'wma.gif',
		'wmv' : 'wmv.gif',
		'xml' : 'xml.gif',
		'xls' : 'xls.gif',
		'xlsx' : 'xls.gif',
		'zip' : 'zip.gif'
	},
	addIcon2GridColumn : function(columnModel, addColumn, fromColumn) {
		var index;
		if (columnModel instanceof Ext.grid.ColumnModel && (index = columnModel.findColumnIndex(addColumn)) != -1) {
			var iconsMap = this.IconsMap, key = fromColumn, setIconFn = function(v, p, record) {
				var isSecrecy = Ext.isObject(record.get("IS_SECRECY")) ? record.get("IS_SECRECY").value : "0";
				return '<div style="float:left;line-height: 16px; height:16px;background: url(\'/themes/types/small/'
						+ ((record.get(key) && iconsMap[record.get(key).toLowerCase().trim()]) || iconsMap.unknown)
						+ '\') no-repeat;" ><img src="'
						+ (isSecrecy === "1" ? "/themes/types/lock.png": "/themes/icon/all/transparent.gif")
						+ '" title=\''+(isSecrecy === "1" ? "保密文件": "公开文件")+'\''
						+ 'style="margin-right:5px;vertical-align:middle;"/>'
						+ v + '</div>';
/*				return '<img src="/themes/types/small/'
						+ ((record.get(key) && iconsMap[record.get(key).toLowerCase().trim()]) || iconsMap.unknown)
						+ '" style="margin-right:5px;vertical-align:middle;"/> '
						+ v;*/
			}
			columnModel.setRenderer(index, setIconFn);
		}
	},
	bytesToSize : function (bytes) {
	    if (bytes == 0 || bytes == '0') return '0 B';
	    var k = 1024, // or 1024
	        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
	        i = Math.floor(Math.log(bytes) / Math.log(k));
	   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
	},
	bytesToSizeColumn : function(columnModel, sizeColumn) {
		var index;
		if (columnModel instanceof Ext.grid.ColumnModel && (index = columnModel.findColumnIndex(sizeColumn)) != -1) {
			columnModel.setRenderer(index, this.bytesToSize);
		}
	}
}