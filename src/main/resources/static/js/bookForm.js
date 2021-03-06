$(function() {

    var bookContainer = $('#book-form-container');
    var editionsTable = $('#editions-table');
    var editionsDataTable;

    initBookForm();
    initEditionsDataTables();
    initEditionModal();

    function initBookForm() {
	var form = $(bookContainer).find('form');
	var formFields = $(form).find('input, select, textArea');
	var selectFields = $(form).find('.selectpicker');

	var panelFooter = $(bookContainer).find('.panel-footer');
	var editBtn = $(panelFooter).find('.btn-edit');
	var saveBtn = $(panelFooter).find('.btn-save');
	var backBtn = $(panelFooter).find('.btn-back');
	var cancelBtn = $(panelFooter).find('.btn-cancel');

	$(backBtn).on('click', function(event) {
	    window.location.href = "/books";
	});

	$(editBtn).on('click', function(event) {
	    $(formFields).prop('disabled', false);
	    $(selectFields).selectpicker('refresh');
	    $(panelFooter).removeClass('readonly');
	});

	$(saveBtn).on('click', function(e) {
	    if ($(form).valid()) {
		var method = $(form).attr('method');
		var data = $(form).serializeObject();
		$.ajax({
		    type : 'POST',
		    url : '/books',
		    data : JSON.stringify(data),
		    contentType : 'application/json',
		    success : function(data) {
			$(form).find('#bookId').val(data);
			updateBtnVisibility();
			toastr["success"](message.common.savingSuccessMessage);
			$('#toast-container .toast-success').show();
		    }
		});
	    }
	});

	$(cancelBtn).on('click', function(event) {
	    updateBtnVisibility();
	});

	function updateBtnVisibility() {
	    $(formFields).prop('disabled', true);
	    $(selectFields).selectpicker('refresh');
	    $(panelFooter).addClass('readonly');
	}
    }

    function initEditionsDataTables() {
	if (editionsTable.length) {
	    editionsDataTable = $(editionsTable).DataTable({
		language : dataTablesMessages,
		dom : '<"dt-buttons">frt'
	    });
	}
	var dtBtns = $(bookContainer).find('.dt-buttons');
	$(dtBtns).html(dataTablesNewBtnHtml);

	$(editionsTable).on('click', '.edition', function(e) {
	    e.preventDefault();
	    var editionId = $(this).find('td:first').text();
	    $.ajax({
		type : 'GET',
		url : '/books/editions/' + editionId,
		success : function(data) {
		    $('#editionModal').replaceWith(data);
		    initEditionModal();
		    $('#editionModal').show();
		}
	    });
	});
    }

    function initEditionModal() {

	var modal = $('#page-wrapper').find('#editionModal');
	var editionForm = $(modal).find('form');
	var closeBtn = $(modal).find('.close');
	var backBtn = $(modal).find('.panel-footer .btn-back');
	var saveBtn = $(modal).find('.panel-footer .btn-save');
	var newBtn = $(bookContainer).find('.dt-buttons button');

	$(newBtn).on('click', function() {
	    $(modal).show();
	});

	$(closeBtn).on('click', function() {
	    $(editionForm).reset();
	    $(modal).hide();
	});

	$(backBtn).on('click', function() {
	    $(editionForm).reset();
	    $(modal).hide();
	});

	$(saveBtn).on(
	        'click',
	        function() {

		    if ($(editionForm).valid()) {
		        var data = $(editionForm).serializeObject();
		        $.ajax({
		            type : 'POST',
		            url : bookEditionsUrl,
		            data : JSON.stringify(data),
		            contentType : 'application/json',
		            success : function(result) {
			        if (data['id'].length) {
			            updateRow(data, result);
			        } else {
			            addRow(data, result);
			        }
			        $(modal).hide();
			        toastr["success"](message.common.savingSuccessMessage);
			        $('#toast-container .toast-success').show();
		            }
		        });
		    }

		    var falseIcon = '<i class="fa fa-times" aria-hidden="true"></i>';
		    var trueIcon = '<i class="fa fa-check-circle" aria-hidden="true"></i>';

		    function addRow(data, id) {
		        // add row
		        var rowNode = editionsDataTable.row.add(
		                [ id, data['isbn'], data['startDate'], data['endDate'], data['price'] + ' €', data['vat'] + ' %', data['pages'],
		                        data['settled'] == 'true' ? trueIcon : falseIcon, data['copyright'] == 'true' ? trueIcon : falseIcon ]).draw(false).node();
		        $(rowNode).find('td').first().addClass('hidden');
		        $(rowNode).addClass('edition');
		    }

		    function updateRow(data, id) {
		        var row = $(editionsTable).find('tr[data-id="' + id + '"]');
		        editionsDataTable.row(row).data(
		                [ id, data['isbn'], data['startDate'], data['endDate'], data['price'] + ' €', data['vat'] + ' %', data['pages'],
		                        data['settled'] == 'true' ? trueIcon : falseIcon, data['copyright'] == 'true' ? trueIcon : falseIcon ]).draw();
		    }
	        });

	$(window).on('click', function(event) {
	    if (event.target == modal) {
		$(modal).hide();
	    }
	});
    }

});