/**
 * @author venkat
 */
function responceobject(responce){
	this.data=responce;
}

exports.responceobject=function(responce){
	var resobj=new responceobject(responce)
	return resobj
}
