$('#button').click(function () {
	$.post('/ethersjsBackend', function (data) {
		console.log(data);
	});
});
