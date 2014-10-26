$('#messages').ready(function(){
	$('#messages').addClass('alert-dismissible container');
	$('#messages').attr('role','alert');
	$('#messages').html('<button type="button" data-dismiss="alert" class="close close-alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>'+$('#messages').html());
	
})