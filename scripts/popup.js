$(document).ready(
  LoadData()
)

function getParamsSaved() {
  return ["sUrl", "sKey", "sPass", "sPath", "dUrl", "dKey", "dPass", "dPath"];
}

function LoadData() {
  var paramsSaved = getParamsSaved();
  var storage = chrome.storage.local;
  paramsSaved.forEach(element => {
    storage.get([element], function(result) {
      if (result[element]) {
        $('#' + element).val(result[element])
      }
    });
  });
  
}

$('.btn-collap').on('click', function(e){
  let btn = $(e.target)
  let divNext = $(btn).next()
    $(btn).toggleClass('active'); 
  if ($(divNext).height() == 0) {
    $(divNext).css('display', 'block')
    $(divNext).height(200)
  } else {
    $(divNext).height(0)
    setTimeout(() => {
      $(divNext).css('display', 'none')
    }, 200);
  }
})


$('#btnSubmit').on('click', function(e){
  var btn = e.target
  if (!$("#source-form").valid()) {
    alert('Source form is not valid!');
    return
  }
  if (!$("#destination-form").valid()) {
    alert('Destination form is not valid!');
    return
  }

  $(btn).attr('disabled', true);
  
  // save data
  let authObj = saveKeyToLocal();
  var allKey = getAllKey(authObj);
  if (!allKey || allKey.length === 0 ) {
    alert('could not find any key');
    return doAfer(btn)
  }
  console.log(allKey)

  let success = copyAllKey(allKey, authObj);

  alert('Successfully copied ' + success + ' keys / ' + allKey.length + ' keys');
  return doAfer(btn)
})

function doAfer(btn) {
  $(btn).removeAttr('disabled');
}

function saveKeyToLocal() {
  var paramsSaved = getParamsSaved();
  var authObj = {}
  var storage = chrome.storage.local;

  paramsSaved.forEach(element => {
    var obj = {}
    var data = $('#' + element).val();
    if (element.includes('Url')) {
      if (!data.endsWith('/v1/kv/')) {
        data = data + '/v1/kv/'
      }
    } 
    if (element.includes('Path')) {
      if (data.startsWith('/')) {
        data = data.substring(1, data.length)
      }
      if (!data.endsWith('/')) {
        data = data + '/';
      }
    }
    obj[element] = data
    authObj[element] = data
    storage.set(obj, function(){
      console.log(element + ' is set to ' + $('#' + element).val());
    })
  });
  return authObj;
}

function getAllKey(authObj) {
  var allKey = [];
  $.ajax({
    type: "GET",
    url: authObj.sUrl + authObj.sPath + '?recurse=true',
    data: "aaaaa",
    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", "Basic " + btoa(authObj.sKey + ":" + authObj.sPass));
  },
    success: function (response) {
      allKey = response;
    },
    error: function (error) {
        console.log(error)
    },
    dataType: 'json',
    async: false,
  });

  return allKey;
}

function copyAllKey(params, authObj) {
  let success = 0;
  params.forEach(element => {
    let data = atob(element.Value);
    let key = element.Key.replace(authObj.sPath, authObj.dPath);
    let url = authObj.dUrl + key
    $.ajax({
      type: "PUT",
      url: url,
      data: data,
      beforeSend: function (xhr) {
        xhr.setRequestHeader ("Authorization", "Basic " + btoa(authObj.dKey + ":" + authObj.dPass));
    },
      success: function (response) {
        if (response ==  true || response == 'true') {
          success += 1;
        }
      },
      error: function (error) {
          console.log(error)
      },
      dataType: 'json',
      async: false,
    });
  });
  return success;
}

$("#source-form").validate({
  onfocusout: function (element) { $(element).valid() },
  onclick: true,
  rules: {
      's-url': {
          required: true,
      },
      's-key': {
          required: true,
      },
      's-pass': {
        required: true,
      },
      's-path': {
        required: true,
      }
  },
  messages: {
    's-url': {
        required: 'Url can not be blank',
    },
    's-key': {
        required: 'Key can not be blank',
    },
    's-pass': {
      required: 'Pass can not be blank',
    },
    's-path': {
      required: 'Path can not be blank',
    }
  }
});
$("#destination-form").validate({
  onfocusout: function (element) { $(element).valid() },
  onclick: true,
  rules: {
      's-url': {
          required: true,
      },
      's-key': {
          required: true,
      },
      's-pass': {
        required: true,
      },
      's-path': {
        required: true,
      }
  },
  messages: {
    's-url': {
        required: 'Url can not be blank',
    },
    's-key': {
        required: 'Key can not be blank',
    },
    's-pass': {
      required: 'Pass can not be blank',
    },
    's-path': {
      required: 'Path can not be blank',
    }
  }
});