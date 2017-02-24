$( document ).ready(function() {

  var options = {
    valueNames: [
      'search-tags',
      'search-institutions',
      'search-title',
      'search-course',
      'search-tutors',
      'search-teachers',
      'search-students',
      { attr: 'data-typology', name: 'search-typology' }
    ]
  };

  var projectList = new List('project-list', options);
  $('#project-search').on('keyup', function() {
    var searchString = $(this).val();
    projectList.search(searchString);
    $(".list").unmark();
    $(".list").mark(searchString)
  });

  var filters = [];

  $('.checkbox input:checkbox').change(function () {
    var checkboxes = $('.checkbox input:checkbox')
    var checkSelected = [];
    checkboxes.each(function(){
      var value = $(this).val();
      var checked = $(this).is(':checked');
      if(checked){
        checkSelected.push(value)
      }
    })

    if(checkSelected.length == checkboxes.length){
      filters = $.grep(filters, function(d){
           return d.field != 'search-typology';
      });
    }else if(!checkSelected.length){
      filters = $.grep(filters, function(d){
           return d.field != 'search-typology';
      });

      filters.push({
          value: 'undefined', field: 'search-typology'
      })
    }else{
      filters = $.grep(filters, function(d){
           return d.field != 'search-typology';
      });
      checkSelected.forEach(function(d){
        filters.push({
          value: d, field: 'search-typology'
        })
      })
    }
    projectFilter(filters)
  });

  $('.institutions-container button').on('click', function() {
    var value = $(this).val();
    var check = filters.filter(function(d){
      return d.value == value;
    })

    if(check.length){
      filters = $.grep(filters, function(d){
           return d.value != value;
      });
    }else {
      filters.push({
        value: value, field: 'search-institutions'
      })
    }
    projectFilter(filters)
  });

  $('.tags-container button').on('click', function() {
    var value = $(this).val();
    var check = filters.filter(function(d){
      return d.value == value;
    })

    if(check.length){
      filters = $.grep(filters, function(d){
           return d.value != value;
      });
    }else {
      filters.push({
        value: value, field: 'search-tags'
      })
    }
    projectFilter(filters)
  });

  projectList.on('updated', function() {
    var selected = projectList.matchingItems;
    var selectableTags = new Map();
    var selectableInstitutions = new Map();
    selected.forEach(function(d){
      var tags = $(d.elm).find('.search-tags').text()
      tags = tags.split('·');
      tags.forEach(function(tag){
        selectableTags.set(tag.trim(),tag.trim())
      })

      var institutions = $(d.elm).find('.search-institutions').text()
      institutions = institutions.split('·');
      institutions.forEach(function(institution){
        selectableInstitutions.set(institution.trim(),institution.trim())
      })

    })

    var allTagsButtons = $('.tags-container button')
    var allInstitutionsButtons = $('.institutions-container button')

    allTagsButtons.each(function(){
      var value = $(this).val();
      if(Array.from(selectableTags.values()).indexOf(value)< 0){
        $(this).prop('disabled', true)
      }else{
        $(this).prop('disabled', false)
      }
    })

    allInstitutionsButtons.each(function(){
      var value = $(this).val();
      if(Array.from(selectableInstitutions.values()).indexOf(value)< 0){
        $(this).prop('disabled', true)
      }else{
        $(this).prop('disabled', false)
      }
    })

    $('span.selected-projects').text(selected.length)

    if(selected.length){
      $('.no-results').addClass('hidden')
    }else{
      $('.no-results').removeClass('hidden')
    }
  })

  function projectFilter(filters){
    projectList.filter(function(item) {
      var result = true;
      filters.forEach(function(filter){
        var re = new RegExp(escapeRegExp(filter.value));
        var tag = re.exec(item.values()[filter.field]);
        if(!tag){
          result = false
        }
      })
      return result
    });
  }

  function escapeRegExp(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };


})
