var myApp = angular.module("my-app", []);

myApp.controller("PopupCtrl", ['$scope', '$http', function($scope, $http){
   console.log("Controller Initialized");

   var init = function(){

    var xlf = document.getElementById('xlf');
    if(!xlf.addEventListener) return;
    function handleFile(e) { do_file(e.target.files); }
    xlf.addEventListener('change', handleFile, false);
  }

   $scope.cartasDocumentos = [];

    $scope.onSelect = function(cartaDocumento){

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "onCartaDocumentoSelected", cartaDocumento});
      });
    
    }


  $scope.onReadExcel = function(content){
    $scope.cartasDocumentos = [];
    const datos = JSON.parse(content).Sheet1;
    
    $scope.cartasDocumentos = datos.filter((x,i)=> i>0).map(x=>{
      return {
        nombre: x[0],
        apellido: x[1],
        calle: x[3],
        nroCalle: x[4],
        piso: x[5],
        depto: x[6],
        codigoPostal: x[2],
      }
    })
    
    $scope.$apply();
  };

  //No se que onda
  var X = XLSX;
  var XW = {
    /* worker message */
    msg: 'xlsx',
    /* worker scripts */
    worker: './js/excel/xlsxworker.js'
  };

  var global_wb;

  var process_wb = (function() {

    var to_json = function to_json(workbook) {
      var result = {};
      workbook.SheetNames.forEach(function(sheetName) {
        var roa = X.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
        if(roa.length) result[sheetName] = roa;
      });
      return JSON.stringify(result, 2, 2);
    };

    return function process_wb(wb) {
      global_wb = wb;
      var output = to_json(wb);      
      $scope.onReadExcel(output);      
    };
  })();

  var setfmt = window.setfmt = function setfmt() { if(global_wb) process_wb(global_wb); };

  var do_file = (function() {

    var rABS = typeof FileReader !== "undefined" && (FileReader.prototype||{}).readAsBinaryString;
    var domrabs = document.getElementsByName("userabs")[0];
    if(!rABS) domrabs.disabled = !(domrabs.checked = false);

    var use_worker = typeof Worker !== 'undefined';
    var domwork = document.getElementsByName("useworker")[0];
    if(!use_worker) domwork.disabled = !(domwork.checked = false);

    var xw = function xw(data, cb) {
      var worker = new Worker(XW.worker);
      worker.onmessage = function(e) {
        switch(e.data.t) {
          case 'ready': break;
          case 'e': console.error(e.data.d); break;
          case XW.msg: cb(JSON.parse(e.data.d)); break;
        }
      };
      worker.postMessage({d:data,b:rABS?'binary':'array'});
    };

    return function do_file(files) {
      rABS = true;
      use_worker = true;
      var f = files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
        var data = e.target.result;
        if(!rABS) data = new Uint8Array(data);
        if(use_worker) xw(data, process_wb);
        else process_wb(X.read(data, {type: rABS ? 'binary' : 'array'}));
      };
      if(rABS) reader.readAsBinaryString(f);
      else reader.readAsArrayBuffer(f);
    };
  })();


    init();
  }
]);
