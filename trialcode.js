for results.ejs
  $('.save-link').on('click', function() {
    // e.preventDefault();
    console.log(events.id);
    var thisUrl = $(this).attr('href');
    console.log(thisUrl);

    $.ajax({
      type: "POST",
      url: thisUrl,
      // data: data,
      // success: success,
      dataType: 'JSON'
    });
  });
